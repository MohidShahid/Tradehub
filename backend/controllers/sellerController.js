const Shop = require("../models/Shop")
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");

const authenticateSeller = async(req, res, next)=>{
  try {
     const user = req.user;

    const shop = await Shop.findOne({userId : user._id});

    if(!shop){
        return next(new ErrorHandler("Doesn't have a shop on this account", 401));
    }
    return res.json({message : "Seller Account authenticated", data : shop});
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
}


module.exports  = {authenticateSeller}