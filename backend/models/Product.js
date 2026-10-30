const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = Schema({
  name: String,
  description: String,
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  regularPrice: Number,
  salePrice: Number,
  stock: Number,
  category: String,
  images: {
    type: [String],
    default: [],
  },

  featuredImage: {
    type: String,
    default: "",
  },
  sku: String,
  status: {
    type: String,
    enum: ["draft", "pending", "active", "rejected", "inactive", "archived"],
    default: "draft",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
