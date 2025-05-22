//Imaine we have taken the file from the user and stored in our 
//local server.

//Now the aim of this code is to collect that file from our server and 
//upload it to a third party service like cloudinary.

//since we are dealing with the database we will use try and catch block.

//we will bring important info- api secret, api key and keep it in env variables

//we unlink the file if it is not successfully uploaded in cloudinary.

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {

      try {
        
        if(!localFilePath)return null;

        //if file found, upload file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
        })

        //file uploaded successfully
        console.log("file uploaded successfully ", response);
        return response

      } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved
        //temporary file as it is not uploaded to cloudinary. 
      }


}


export { uploadOnCloudinary }