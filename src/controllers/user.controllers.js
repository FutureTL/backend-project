import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import { User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const getAccessAndRefreshToken = async(userid) => {

    try{
        const user = await User.findById(userid);
        const accessToken  = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        //what is this validateBeforeSave:
        //In Mongoose, before a document is saved using .save(), all validations defined in your schema are triggered by default. These can include:

        // Required fields (required: true)

        // Custom validators (e.g., regex for email)

        // Field types (like Number, String, etc.)

        // Setting validateBeforeSave: false tells Mongoose:

        // “Save this document as-is without running any schema validations.”




        //user,refreshToken represents a entry in the dataschema of USER, and in that w
        //we are putting the value of the refresh token we have generated.

        //now we want to also save the refresh token in the database so
        //that when user gives us his refresh token we can compare with the
        //value stored in the database and validate the user.

        return { accessToken, refreshToken };
        }
    catch(error){
            throw new ApiError(500, "Something went wrong in generating access and refresh tokens.")
    }


}


const registerUser =   asyncHandler(async (req,res)=>{
   //Logic for registering user-
        // 1. get user details from frontend.
        // 2. validation-not empty or all the fields are correct.
        // 3. check if user already exists:username, email
        // 4. check for images, avatar
        // 5. upload them to cloudinary, check avatar
        // 6. create user object-create entry in db(we are using mongodb where mostly mostly objects are created)
        // //when we make entries in the db we get response as it is whatever we have created everything is received back in the form of response.
        // 7. remove password and refresh token field from response.
        // 8. check for user creation.(check if response is actually received.)
        // 9. return res

        //data can come from form or json which we can get using req.body but data from url is handled differently.
        //we can extract this data received from req.body and destructure as written in my code:

       const {username, email, fullName,password} = req.body
       console.log("email: ", email);

       //now working on sending data from frontend using postman for testing purposes.
       //we can send data through params also but most of the time body is used.

       //here I learnt a new concept of some in javascript. read more about it and add in the readme file.

       //this is used to check if some field is left empty.
        if(
                [fullName, email, username, password].some((field) => field?.trim() === "")
        ){
                throw new ApiError(400, "All fields are required");
        }

       //now we will check for step 3 , i.e, if the user already exists using email or username as the fields.
       //now if or not the user already exists we will check this using the database only. 
       //So, we have used the $or operator of mongodb. It is equivalent to the logical or operator , even if one expression
       //is true, it will return true.

        const userExisted = await User.findOne({
            $or: [{username}, {email}]
        })

        if(userExisted){
            throw new ApiError(409, "user with this email or username already exists!");
        }

        //now we focus on the next step. middleware krta kuch ni hai bs adds more fields to the req.body 
        //it is providing us access to files- avatar and coverimage

        //LOGIC- we use optional chaining, if avatar is present we get many properties of its
               //like the file size, png etc, but the 1st one gives us the path that multer has saved the file in.
        const avatarLocalPath = req.files?.avatar[0]?.path;
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar image required!");
        }
        

        //now next step is to upload both these files to cloudinary---
        //we have already written the base code in cloudinary file and there we accept a file.

        const avatar     = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        //as avatar is a required field, so as a next step we again check if avatar is sent correctly
        //on cloudinary.
        
        if(!avatar){
            throw new ApiError(400, "avatar image is uploaded on cloudinary!");
        }

        //now we focus on creating the user.
        const user = await User.create({
            username: username.toLowerCase(),
            fullName,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
        })
        console.log("user detail: ", user);
        //here in select we put the fields we want to remove from the reponse of user.
        const userCreated = await User.findById(user._id).select("-password -refreshToken");
        if(!userCreated){
            throw new ApiError(500, "something went wrong in registering the user!");
        }

        console.log("user created", userCreated);
        //error 500 is when server fails to do stuff.

        //as a last step if user is created, we want to send back a proper response. 
        //here we use ApiResponse.js we had created because we want to send the data in a proper structured response
       
        return res.status(201).json(
            new ApiResponse(200, userCreated, "user registered successfully")
        );
       // we send in proper structure we defined in ApiResponse.js File

})


const loginUser = asyncHandler( async (req,res) => {
    //steps followed to login the user-
        //req body-> collect data from that
        // username or email Authentication 
        // find the user 
        // check the password 
        // if user found-> access and refresh token 
        // send cookies- to send the tokens.
    
     const { email, password, username }= req.body;
     console.log("email: ", email);

     if(!email && !username){
        throw new ApiError(400, "email or username required!")
     }

    //we query the database to find email or username using the or operator which 
    //takes objects in an array.
    const user = await User.findOne({
        $or: [{email},{username}]
    })
    
    if(!user){
       throw new ApiError(404, "no user exists with this email or username")
    }

    //now as next step- we check if password is correct. For that we had created a method
    //in user models called ispasswordcorrect and that can be accessed using user not "User".

   const isPasswordValid = await user.isPasswordCorrect(password);

   if(!isPasswordValid){
    throw new ApiError(401, "Password is incorrect");
   }

   //next step now occurs for validated user- we want to generate
   //access and refresh tokens for the user.
   //as both these tokens are very commonly used, we create a method for them.
   //if we have the user id, we can easily create tokens for him.

   const {accessToken, refreshToken} = await getAccessAndRefreshToken(user._id);
   //IMPT NOTE: here also we have written await, beacuse the method being called 
   //           has database interaction so can introduce some delay hence asyncness and we use await.

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   //now we write code for cookies:
    //1. we write an object that ensures that the cookies can be modified 
    // only by the server and not by frontend. 
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )
    //we are also sending access token and refresh token to the user
    //maybe he wants to store them in their browser(not a good practice to 
    //to store in browser but anyways).


    //now

    
})

//now we want to log out the user.
const logoutUser = asyncHandler( async (req, res) => {
    //now the problem with logging out the user is that we dont
    //have the id of the user. 
    
    //Two things to log out the user:
        //1. We have to remove the cookies.
        //2. we also have to clear the refresh token of the user 
            //from his database.
        //for this we design a Middleware.

    //step 1.
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken:1
            }
        },
        {
            new:true
        }
    )

    //step 2.
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

//now we want to create an end point where frontend engg. can hit 
//and refresh the token for the user.

const refreshAccessToken = asyncHandler( async(req,res)=>{

   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized access");
    }
    try {
        const decodedToken =  jwt.verify(
            incomingRefreshToken,
            REFRESH_TOKEN_SECRET
        )
       //this will give me decoded token.
    
    
       const user = await User.findById(decodedToken?._id);
       if(!user){
        throw new ApiError(401, "invalid refresh token");
       }
    
       if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "refresh token expired or used")
       }
    
       //check here: the refreshToken saved in the User details is it encoded or decoded?
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken, newrefreshToken} = await getAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", newrefreshToken)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newrefreshToken},
                "access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, "access token not recreated");
        
    }
    //we have written the controller logic now we move on to 
    //write the endpoint in route. endpoint basically means that we create new route


   
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}