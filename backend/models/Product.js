const mongoose = require("mongoose");
const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    values: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const variantSchema = new Schema({
  attributes: {
    type: Map,
    of: String,
    required: true,
  },
  sku: {
    type: String,
    trim: true,
    default: "",
  },
  regularPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: {
    type: Number,
    default: null,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const productSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      trim: true,
      default: "",
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [optionSchema],
      default: [],
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "active", "rejected", "inactive", "archived"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
