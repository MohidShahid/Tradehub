const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, authorizeSeller } = require("../middleware/auth");
const {
  authenticateSeller,
  createShop,
  getMyShop,
  updateMyShop,
} = require("../controllers/sellerController");
const {
  createCoupon,
  getShopCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/CouponsController");

const shopUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

// Seller Authentication & Shop Onboarding
router.get("/authenticate", isAuthenticated, catchAsyncErrors(authenticateSeller));
router.post("/create-shop", isAuthenticated, shopUpload, catchAsyncErrors(createShop));
router.get("/my-shop", isAuthenticated, authorizeSeller, catchAsyncErrors(getMyShop));
router.put("/my-shop", isAuthenticated, authorizeSeller, shopUpload, catchAsyncErrors(updateMyShop));

// Shop Coupons
router.post("/create-coupon", isAuthenticated, authorizeSeller, catchAsyncErrors(createCoupon));
router.get("/get-coupons", isAuthenticated, authorizeSeller, catchAsyncErrors(getShopCoupons));
router.put("/update-coupon", isAuthenticated, authorizeSeller, catchAsyncErrors(updateCoupon));
router.delete("/delete-coupon/:id", isAuthenticated, authorizeSeller, catchAsyncErrors(deleteCoupon));

module.exports = router;
