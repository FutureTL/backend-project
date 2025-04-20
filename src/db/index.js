
import mongoose from "mongoose"
import {db_name} from "../constants.js"



const connectDB = async ()=>{
 
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
        console.log("\n Mongodb connected: ", `${connectionInstance.connection.host}`);
  
    } catch (error) {
        console.log("Error in mongodb connection: ", `${error}`);
        
    }
}

export default connectDB