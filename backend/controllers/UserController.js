const  User = require("../models/User")
const  ErrorHandler = require( "../utils/ErrorHandler");


const createUser = async (req , res , next)=>{
   try {
    const {fullName, email, password, userType} = req.body;
     const userEmail = await User.find({email});
    if(userEmail){
       return next(new ErrorHandler("user already exists", 400));
    }
     
     await User.create({fullName, email, password, isBuyer : true});
     res.json({message : "User Created Successfully" , statusCode : 200});
   } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 400));
   }
}



module.exports = {createUser}