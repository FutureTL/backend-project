import mongoose from "mongoose"

import jwt from "jsonwebtoken"
import bcyrpt from "bcrypt"

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String, //cloudinary url
        required:true
    },
    coverImage:{
        type:String 
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type:String, //because we will store encrypted form of password
        required:[true, 'password is required']
    }, 
    refreshToken:{
        type:String
    },

},{timestamps:true})

//1. arrow function not used as it does not have context
//2. we use async function as it has to encrypt takes time.
userSchema.pre("save", async function(next){ //here we didnt use the arrow function as it does not have context and thus we cannot use "this" keyword which was necessary to be used.
    if(!this.isModified("password")) return next();

    this.password = bcyrpt.hash(this.password, 10)
    next()

})

//this is a custom method that we can call to check if the password entered 
//by the user is correct against the password stored. Observe how we are accessing
//the stored password using this context. and both the passwords are compared using the
//"compare" keyword of bcrypt.
userSchema.methods.isPasswordCorrect= async function(password){
    return await bcyrpt.compare(password, this.password);
}

//while writing these tokens we have not used async function because they 
//are generally not required but according to use case make sure.
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
            fullName: this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)