import multer from "multer"
//here we are using disk for storage which is a better option than using 
//memory for storage purposes as it can get overloaded if some heavy files enter.


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
  
export const upload = multer(
    { 
        storage
    }
)

//here we have kept the name of the file as the original name 
//only that is being uploaded by the user. 
//We should look into this at the end to change some functionalities.