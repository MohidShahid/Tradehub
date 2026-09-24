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

    const existingUser = User.findById({ _id: decoded.userId });
    if (!existingUser) {
      return next(new ErrorHandler("Invalid Token", 401));
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }
  }
};

module.exports = { isAuthenticated };
