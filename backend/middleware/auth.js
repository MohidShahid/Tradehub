const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Access denied. No token provided", 401));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    const existingUser = await User.findById(decoded.userId);
    if (!existingUser) {
      return next(new ErrorHandler("Invalid Token", 401));
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }
    return next(new ErrorHandler(error.message || "Authentication failed", 401));
  }
};


const authorizeSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log(req.user)
    console.log(user)
    if (!user || !user.isSeller) {
      return res.status(403).json({
        message: "Only sellers can perform this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports = { isAuthenticated, authorizeSeller };
