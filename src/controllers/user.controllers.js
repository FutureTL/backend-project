import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
            [fullName, email, username, password].some((field)=> field?.trim()=== "")
       ){
            throw new ApiError(400, "All fields are required");
       }

       //now we will check for step 3 , i.e, if the user already exists using email or username as the fields.
       //now if or not the user already exists we will check this using the database only. 
       //So, we have used the $or operator of mongodb. It is equivalent to the logical or operator , even if one expression
       //is true, it will return true.

        const userExisted=  User.findOne({
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
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

        //here in select we put the fields we want to remove from the reponse of user.
        const userCreated = await User.findById(user._id).select("-password -refreshToken");
        if(!userCreated){
            throw new ApiError(500, "something went wrong in registering the user!");
        }

        //error 500 is when server fails to do stuff.

        //as a last step if user is created, we want to send back a proper response. 
        //here we use ApiResponse.js we had created because we want to send the data in a proper structured response
       
        return res.status(201).json(
            new ApiResponse(200, userCreated, "user registered successfully")
        )
       // we send in proper structure we defined in ApiResponse.js File

})

export {registerUser}