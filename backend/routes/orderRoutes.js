const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeSeller } = require("../middleware/auth");
const {
  createOrder,
  verifyStripePayment,
  getOrderDetails,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.use(isAuthenticated);

router.post("/create", createOrder);
router.post("/verify-payment", verifyStripePayment);
router.get("/my-orders", getMyOrders);
router.get("/seller/orders", authorizeSeller, getSellerOrders);
router.put("/seller/status/:id", authorizeSeller, updateOrderStatus);
router.get("/:id", getOrderDetails);

module.exports = router;
