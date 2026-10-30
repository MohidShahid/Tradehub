const express = require("express");
const router = express.Router();
const upload  = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {isAuthenticated} = require("../middleware/auth");
const {authenticateSeller} = require("../controllers/sellerController")

router.get("/authenticate", isAuthenticated, authenticateSeller);


module.exports = router;