
// Ek warapper bana rehe hai jo bar bar use ho reha hai 
const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error))
    }
}
export { asyncHandler }













// (requestHandler) iske jagah ek fucntion ayega 
// Ye ek pura function return  kar reha hai tabhi higher order function banega 
// return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//             .catch((error) => next(error))
//     }






// const asyncHandler = () => { } //Normal function 
// const asyncHandler = (func) => { () => { } } //Bracket ko hata denge 
// const asyncHandler = async (func) => () => { }  //Bracket ko hata denge 

// const asyncHandler=(func)=>async(req,res,next)=>{
//     try {
//         await func(req,res,next)
        
//     } catch (error) {
//         res.status(error.code || 500 ).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }

