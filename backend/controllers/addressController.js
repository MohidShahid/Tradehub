const Address = require("../models/Address");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

// Create a new address
const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      fullName,
      phoneNumber,
      completeAddress,
      city,
      state,
      country,
      postalCode,
      addressType,
      isDefault,
    } = req.body;

    if (!completeAddress || !city) {
      return next(
        new ErrorHandler("Complete address and city are required", 400)
      );
    }

    const existingCount = await Address.countDocuments({ userId });
    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      userId,
      fullName: fullName || "",
      phoneNumber: phoneNumber || "",
      completeAddress,
      city,
      state: state || "",
      country: country || "Pakistan",
      postalCode: postalCode || "",
      addressType: addressType || "Home",
      isDefault: Boolean(shouldBeDefault),
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error("createAddress error:", error);
    return next(new ErrorHandler(error.message || "Failed to create address", 500));
  }
};

// Get all addresses for logged-in user
const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const addresses = await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("getUserAddresses error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to fetch addresses", 500)
    );
  }
};

// Get a single address
const getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid address ID", 400));
    }

    const address = await Address.findOne({ _id: id, userId });
    if (!address) {
      return next(new ErrorHandler("Address not found", 404));
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("getAddressById error:", error);
    return next(new ErrorHandler(error.message || "Failed to fetch address", 500));
  }
};

// Update an address
const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      fullName,
      phoneNumber,
      completeAddress,
      city,
      state,
      country,
      postalCode,
      addressType,
      isDefault,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid address ID", 400));
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId },
      {
        $set: {
          ...(fullName != null && { fullName }),
          ...(phoneNumber != null && { phoneNumber }),
          ...(completeAddress != null && { completeAddress }),
          ...(city != null && { city }),
          ...(state != null && { state }),
          ...(country != null && { country }),
          ...(postalCode != null && { postalCode }),
          ...(addressType != null && { addressType }),
          ...(isDefault != null && { isDefault: Boolean(isDefault) }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(new ErrorHandler("Address not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    console.error("updateAddress error:", error);
    return next(new ErrorHandler(error.message || "Failed to update address", 500));
  }
};

// Delete an address
const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid address ID", 400));
    }

    const deleted = await Address.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return next(new ErrorHandler("Address not found", 404));
    }

    // If deleted address was default, make another one default if any exists
    if (deleted.isDefault) {
      const another = await Address.findOne({ userId });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("deleteAddress error:", error);
    return next(new ErrorHandler(error.message || "Failed to delete address", 500));
  }
};

// Set address as default
const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid address ID", 400));
    }

    await Address.updateMany({ userId }, { isDefault: false });

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!address) {
      return next(new ErrorHandler("Address not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Default address updated",
      address,
    });
  } catch (error) {
    console.error("setDefaultAddress error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to set default address", 500)
    );
  }
};

module.exports = {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
