import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

const port = process.env.PORT || 8000

dotenv.config({
    path: './env'
})
 
connectDB()
.then(()=>{

    app.on("Error: ", (error)=>{
        console.error(`some error has occured: ${error}`)
    }) //TO CHECK FOR SOME ERROR BEFORE APP CAN LISTEN ON PORT
    
    app.listen(port, ()=>{
    console.log(`server is connected at port: ${port}`);
    
    })
})
.catch((error)=>{
    console.log(`database connection failed:  ${error}`)
})
 
 
 
 
 
 
 
 
 
 // Approach-1
// import mongoose from "mongoose"
// import express from "express"

// const app= express()
// const port= process.env.PORT

// ;( async ()=>{

//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
//         app.on("Error: ", (error)=>{
//             console.error("error: ", `${error}`);
//             throw error
//         })

//         app.listen(port, ()=>{
//             console.log(`app is listening on port ${port}`);
//         } )
        
//     } catch (error) {
//         console.error("error: ",`${error}`);
//         throw error;
//     }
// })()