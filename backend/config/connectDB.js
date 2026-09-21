const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");

const connectDB = async () => {
  try {
    const uri = process.env.DATABASE_URL;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    console.log("Connecting mongodb")
    await mongoose.connect(uri);
    console.log("Database Connected Successfully");
  } catch (error) {
    return new ErrorHandler(error.message, 500);
  }
};

module.exports = connectDB;
