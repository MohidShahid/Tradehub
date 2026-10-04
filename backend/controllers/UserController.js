const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const { emailService } = require("../middleware/sendMail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Shop = require("../models/Shop");

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
      isBuyer: true,
    });
    if (req.file) {
      // Upload image to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);
      user.profilePic = result?.secure_url;
    }

    await user.save();

    res.status(201).json({
      message:
        "Account Created Successfully, An activation link sent to your email",
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
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email, isEmailVerified: "true" });
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
    const expireAt = rememberMe ? "7d" : "1d";
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: expireAt,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const getCurrentUser = async (req, res, next) => {
  const user = await User.findById({ _id: req.user.userId }).select(
    "-password -token",
  );

  return res.json({ success: true, data: user });
};

const createSeller = async (req, res, next) => {
  try {
    const { fullName, password, shopName, shopDescription, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Account already exists", 401));
    }

    const user = new User({
      fullName,
      password,
      email,
      isSeller: true,
    });

    await user.save();

    const shop = new Shop({
      shopName,
      description: shopDescription,
      owner: user._id,
    });
    console.log(shop);
    await shop.save();

    res.json({
      success: true,
      message:
        "Account Created Successfully, An activation link sent to your email",
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

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ success: true, message: "Logout Successfullly" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, phone, email } = req.body;
    const userId = req.user.userId || req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Backend validations for fields that are provided
    if (fullName !== undefined) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        return next(new ErrorHandler("Full name must be at least 2 characters", 400));
      }
      user.fullName = fullName.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return next(new ErrorHandler("Please provide a valid email address", 400));
      }

      // Check if email already used by another user
      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return next(new ErrorHandler("Email is already in use by another account", 400));
      }
      user.email = email.trim().toLowerCase();
    }

    const phoneToUpdate = phoneNumber !== undefined ? phoneNumber : phone;
    if (phoneToUpdate !== undefined) {
      const trimmedPhone = String(phoneToUpdate).trim();
      if (trimmedPhone && !/^\+?[0-9\s\-()]{7,15}$/.test(trimmedPhone)) {
        return next(new ErrorHandler("Please enter a valid phone number (7-15 digits)", 400));
      }
      user.phoneNumber = trimmedPhone;
      user.phone = Number(trimmedPhone.replace(/\D/g, "")) || undefined;
    }

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return next(new ErrorHandler("Please upload a valid image file", 400));
      }
      // 5MB limit
      if (req.file.size > 5 * 1024 * 1024) {
        return next(new ErrorHandler("Profile picture size must not exceed 5MB", 400));
      }

      // Upload image to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);
      user.profilePic = result?.secure_url;
    }

    await user.save();

    const sanitizedUser = await User.findById(user._id).select("-password -token");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

module.exports = {
  createUser,
  accountActivation,
  loginUser,
  getCurrentUser,
  createSeller,
  logout,
  updateProfile,
};
