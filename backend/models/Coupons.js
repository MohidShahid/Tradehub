const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponsSchema = Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },

  discountValue: {
    type: Number,
    required: true,
  },

  minimumOrderAmount: {
    type: Number,
    default: 0,
  },

  totalCoupons: {
    type: Number,
    default: 0,
  },

  alreadyUsed: {
    type: Number,
    default: 0,
  },

  applicableProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  expiryDate : {
    type : Date,
    default : Date.now(),
  },
  isActive : {
    type : Boolean,
    default : false,
  }
});

const Coupons = mongoose.model("Coupons", couponsSchema);
module.exports = Coupons;
