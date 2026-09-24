const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const { emailService } = require("../middleware/sendMail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, userType } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }
    // Create user
    const user = new User({
      fullName,
      email,
      password,
    });
    if (req.file) {
      // Upload image to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);
      user.profilePic = result?.secure_url;
    }

    await user.save();

    res.status(201).json({
      message: "Account Created Successfully",
      statusCode: 201,
    });

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();
    const url = `${process.env.FRONTEND_URL}/account-activation/${token}`;

    const message = `Dear ${user.fullName},\nPlease click this link to Activate Your Account for email notification.\n${url}\nNote: Please do not reply to this email as this is a system generated email.
Yours sincerely,
Tradehub
`;
    await emailService(user.email, "Account Created", message);
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const accountActivation = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token, isEmailVerified: false });
    if (!user) {
      return next(new ErrorHandler("Token is expired or Invalid", 401));
    }
    user.isEmailVerified = true;
    await user.save();
    return res.json({
      success: true,
      message:
        "Account Verified Successfully, your account has now been activated",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password , rememberMe} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const payload = {
      name: user.fullName,
      userId: user._id,
      email: user.email,
    };
    const expireAt = rememberMe ? "7d" : "1d"
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: expireAt,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({success : true, message : "Logged in successfully"})
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};


const getCurrentUser = async (req, res, next)=> {

 const user = await User.findById({_id : req.user.userId});


 return res.json({success : true, data : user});
}
module.exports = { createUser, accountActivation, loginUser, getCurrentUser };
