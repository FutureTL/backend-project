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


export {app}