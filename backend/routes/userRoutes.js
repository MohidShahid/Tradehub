const express = require("express");
const router = express.Router();
const {createUser} = require("../controllers/userController");
const upload  = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")


router.post("/create" , upload.single("profilePic"), catchAsyncErrors(createUser));



















module.exports = router;