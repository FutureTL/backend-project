import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential:true
}))

// use is- used for writing different configurations
// the data we will receive will be in various forms . we may receive 
// json Data, urlencoded, file structure.

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded(
    {extended:true,
        limit:"16kb"

    })
)
app.use(express.static("public"))
// to store public files or resources that can be made publicly available.
// we can keep any name we want, here we have chosen the name "public", as we have made the 
// folder in the root directory with that name.

app.use(cookieParser())



//import routes
import userRouter from './routes/user.routes.js'

//before when we were practising we used app.get(), because there only we were using controller and routes through app.
//But now that we have written router in a separate file, so to bring it here we have to use a middleware.
//but now we have separated and to get routes we have to use middleware, so we write like this:



//routes declaration
app.use("/api/v1/users", userRouter)

//      http://8000:users/register- so users part will act as prefix, and then redirect to the regiter route or login route whatever we specify
//This helps in making the app file less cluttered.

// writing like this - /api/v1/users is a standard practice.




export {app}