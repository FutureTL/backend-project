//this middleware will help in verifying the user
//whenever required.

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler( async(req, _, next)=>{

    //see here we have written _ in place of res as it is not used. will be seen in real production code
    
    try {
        //why verify JWT- because when the user logged in
        //we gave him access token and refresh token, and using
        //these now we can verify the user.
    
        //if the user is verfied , we will add a new object
        //called req.user along with req.body, 
    
        //next role: when the work of this middleware is over we will
        //pass on the control to the next thing.This next thing could be
        //another middleware or server.
    
       const token =  req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")
       //what have we done in the above line:
        //we have access of cookies in req beause if we see the app.js file there we had indtalled
        //cookieparser middleware.
      //we have place ? after cookies as they may not be available 
      //as in case of mobile devices. So the user can also send headers and one we need is the authentication hearder which 
      //has the format: 
                //authentication: bearer <accessToken>
                //as we only need the accessToken so we remove the bearer part and space present after it. 
    
        
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        //now we are sure of having the token.
        //Next step: Verify it
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //inside verify: it accepts token we want to verify and the secret key.
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        //as user is verified we extract its id. for reference see user.models.js and see jwt.sign-this part
            // return jwt.sign(
                    // {
     // (we have used this _id in our code here.)    _id: this._id,
                    //     email: this.email,
                    //     username:this.username,
                    //     fullName: this.fullName
            
                    // }
        if(!user){
            throw new ApiError(401 , "invalid access token");
    
        }
        req.user = user; //a new object user is adding in req as we intended
        next() //now the work of this middleware is complete. control passed to the next thing.
            
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
    //mostly the use of the middleware comes in the routes.


    //finally to see this middleware in action go to routes/user.routes.js
    // see logout route and there verifyJWT is being run to verify the user, before
    //logging out the user.

})