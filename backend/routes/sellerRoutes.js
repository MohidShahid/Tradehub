const express = require("express");
const router = express.Router();
const upload  = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {isAuthenticated} = require("../middleware/auth");
const {authenticateSeller} = require("../controllers/sellerController");
const {createCoupon, getShopCoupons, updateCoupon, deleteCoupon} = require("../controllers/CouponsController")

router.get("/authenticate", isAuthenticated, authenticateSeller);
router.post("/create-coupon", isAuthenticated, createCoupon);
router.get("/get-coupons", isAuthenticated, getShopCoupons);
router.put("/update-coupon", isAuthenticated, updateCoupon);
router.delete("delete-coupon/:id", isAuthenticated, deleteCoupon);

module.exports = router;