const  User = require("../models/User")
const  ErrorHandler = require( "../utils/ErrorHandler");
const {uploadToCloudinary}  = require("../services/cloudinaryService");
const {emailService} = require("../middleware/sendMail");
const crypto = require("crypto");

const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Check profile picture
    if (!req.file) {
      return next(new ErrorHandler("Profile picture is required", 400));
    }
    console.log(req.file)
    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);


    // Create user
    const user =  new User({
      fullName,
      email,
      password,
      profilePic: result.secure_url,
    });

    await user.save();

    res.status(201).json({
      message: "User Created Successfully",
      statusCode: 201,
    });
    
    const token = crypto.randomBytes(32).toString('hex');
    user.token  = token;
    await user.save();
    const url = `${process.env.FRONTEND_URL}/verify-email:${token}`

    const message = `Dear ${user.fullName},\nPlease click this link to Activate Your Account for email notification.\n${url}\nNote: Please do not reply to this email as this is a system generated email.
Yours sincerely,
Tradehub
`
    await emailService(user.email, "Account Created", message);

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};



module.exports = {createUser}