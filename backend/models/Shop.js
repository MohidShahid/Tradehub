const mongoose = require("mongoose");

const { Schema } = mongoose;

const shopSchema = Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: String,
    description: String,
    logo: String,
    banner: String,
    category: String,
    phoneNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "Pakistan" },
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    // status: {
    //   type: String,
    //   enum: ["pending", "approved", "rejected", "suspended"],
    //   default: "pending",
    // },
  },
  { timestamps: true },
);


const Shop = mongoose.model("Shop" , shopSchema);

module.exports = Shop;
