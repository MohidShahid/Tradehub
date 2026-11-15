const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

router.use(isAuthenticated);

router.post("/create", createAddress);
router.get("/", getUserAddresses);
router.get("/:id", getAddressById);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.patch("/:id/default", setDefaultAddress);

module.exports = router;
