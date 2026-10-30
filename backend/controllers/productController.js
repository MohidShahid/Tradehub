const Product = require("../models/Product");
const Shop = require("../models/Shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadToCloudinary } = require("../services/cloudinaryService");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, regularPrice, salePrice, stock, sku, category } = req.body;
    const shop = await Shop.findOne({ owner: req.user.userId });

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found associated with user account" });
    }

    const files = req.files || [];
    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults.map((result) => result.secure_url);

    const product = new Product({
      name,
      images: urls,
      featuredImage: urls[0] || "",
      description,
      regularPrice,
      salePrice,
      stock,
      category,
      sku: sku ? sku : "",
      shopId: shop._id,
      status : "active"
    });

    await product.save();

    res.json({ success: true, message: "Product Created Successfully" });
  } catch (error) {
    console.error("Create Product error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

module.exports = { createProduct };

