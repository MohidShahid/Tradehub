const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
    completeAddress : {
      type : String,
      default : null,
    },
    city: String,
    country: String,
    state: String,
    postalCode: String,
    isDefault : {
      type : Boolean,
      default : false,
    }
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
