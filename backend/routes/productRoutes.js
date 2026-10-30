const express = require("express");
const router = express.Router();
const upload  = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {authorizeSeller, isAuthenticated} = require("../middleware/auth");
const { createProduct } = require("../controllers/productController")


router.post("/create", isAuthenticated, authorizeSeller, upload.array("images"), createProduct)


module.exports = router;