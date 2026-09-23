const express = require("express");
const router = express.Router();
const {createUser, accountActivation, loginUser, getCurrentUser} = require("../controllers/userController");
const upload  = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {isAuthenticated} = require("../middleware/auth")





router.post("/create" , upload.single("profilePic"), catchAsyncErrors(createUser));
router.post("/account-activation" , accountActivation);
router.post("/login" , loginUser);
router.get("/me" , isAuthenticated, getCurrentUser);


















module.exports = router;