const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authorizeSeller, isAuthenticated } = require("../middleware/auth");
const {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
} = require("../validators/productValidator");
const {
  createProduct,
  getShopProducts,
  getProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post(
  "/create",
  isAuthenticated,
  authorizeSeller,
  upload.array("images"),
  validateCreateProduct,
  createProduct
);
router.get("/shop", isAuthenticated, authorizeSeller, getShopProducts);
router.get("/public", getProducts);
router.get("/:id", getProductDetails);
router.put(
  "/update/:id",
  isAuthenticated,
  authorizeSeller,
  upload.array("images"),
  validateProductId,
  validateUpdateProduct,
  updateProduct
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeSeller,
  validateProductId,
  deleteProduct
);

module.exports = router;