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
    rating : Number,
    totalReviews : Number,
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
