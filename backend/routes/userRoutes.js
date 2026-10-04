const express = require("express");
const router = express.Router();
const {createUser, accountActivation, loginUser, getCurrentUser, createSeller, logout, updateProfile} = require("../controllers/userController");
const upload  = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {isAuthenticated} = require("../middleware/auth")





router.post("/create" , upload.single("profilePic"), catchAsyncErrors(createUser));
router.post("/account-activation" , accountActivation);
router.post("/login" , loginUser);
router.get("/me" , isAuthenticated, getCurrentUser);
router.post("/create-seller" , upload.single("profilePic"), catchAsyncErrors(createSeller));
router.post("/logout", isAuthenticated, logout);
router.patch("/update-profile", isAuthenticated, upload.single("profilePic"), catchAsyncErrors(updateProfile));


















module.exports = router;