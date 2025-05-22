//asyncHandler is a higher order function that accepts another function and executes it within itself.
const asyncHandler = (requestHandler)=> {

    return (req, res, next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch( (err)=> next(err) )
    }
}


export {asyncHandler}

//asyncHandler is a higher order function that can accept a function as a 
// parameter, and execute it within its body.

//2 ways of writing such functions is through async await or promises.


//const asyncHandler = (func) => async (req,res,next) =>
//  {
//         try {
//             await func(req,res,next)
            
//         } catch (error) {
//             res.status(err.code || 500).json({
//                 sucess: false,
//                 message:err.message
//             })
//         }
//    }