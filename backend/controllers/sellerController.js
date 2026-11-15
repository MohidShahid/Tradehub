const Shop = require("../models/Shop");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadToCloudinary } = require("../services/cloudinaryService");

// Authenticate / Check if the current logged-in user already has a shop
const authenticateSeller = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user._id;

    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      return res.status(200).json({
        success: true,
        isSeller: false,
        hasShop: false,
        message: "No shop registered for this account",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      isSeller: true,
      hasShop: true,
      message: "Seller Account authenticated",
      data: shop,
    });
  } catch (error) {
    console.error("Seller authenticate error:", error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

// Create a new shop for an authenticated user (buyer upgrading to seller)
const createShop = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user._id;
    const {
      shopName,
      description,
      category,
      phoneNumber,
      address,
      logo,
      banner,
    } = req.body;

    if (!shopName || !shopName.trim()) {
      return next(new ErrorHandler("Shop name is required", 400));
    }

    // Check if user already owns a shop
    const existingShop = await Shop.findOne({ owner: userId });
    if (existingShop) {
      return next(new ErrorHandler("You already have an existing shop", 400));
    }

    // Check if another shop has the exact same name (case-insensitive)
    const duplicate = await Shop.findOne({
      shopName: { $regex: new RegExp(`^${shopName.trim()}$`, "i") },
    });
    if (duplicate) {
      return next(
        new ErrorHandler(
          "A shop with this name already exists. Please choose a unique name.",
          400,
        ),
      );
    }

    let logoUrl = logo ? logo.trim() : "";
    let bannerUrl = banner ? banner.trim() : "";

    // Upload logo file if provided
    if (req.files?.logo?.[0]) {
      const file = req.files.logo[0];
      if (!file.mimetype.startsWith("image/")) {
        return next(
          new ErrorHandler("Please upload a valid image file for logo", 400),
        );
      }
      const uploadRes = await uploadToCloudinary(file.buffer);
      logoUrl = uploadRes?.secure_url || logoUrl;
    }

    // Upload banner file if provided
    if (req.files?.banner?.[0]) {
      const file = req.files.banner[0];
      if (!file.mimetype.startsWith("image/")) {
        return next(
          new ErrorHandler("Please upload a valid image file for banner", 400),
        );
      }
      const uploadRes = await uploadToCloudinary(file.buffer);
      bannerUrl = uploadRes?.secure_url || bannerUrl;
    }

    let parsedAddress = address || {};
    if (typeof parsedAddress === "string") {
      try {
        parsedAddress = JSON.parse(parsedAddress);
      } catch (err) {
        parsedAddress = {};
      }
    }

    const shop = new Shop({
      owner: userId,
      shopName: shopName.trim(),
      description: description ? description.trim() : "",
      category: category ? category.trim() : "",
      phoneNumber: phoneNumber ? String(phoneNumber).trim() : "",
      address: parsedAddress,
      logo: logoUrl,
      banner: bannerUrl,
      rating: 0,
      totalReviews: 0,
    });

    await shop.save();

    // Mark the user as a seller
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isSeller: true },
      { new: true },
    ).select("-password -token -tokenExpires");

    return res.status(201).json({
      success: true,
      message: "Shop created successfully!",
      data: shop,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Create shop error:", error);
    return next(new ErrorHandler("Failed to create shop", 500));
  }
};

// Get the authenticated seller's shop profile
const getMyShop = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user._id;
    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.error("Get my shop error:", error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

// Update the authenticated seller's shop profile
const updateMyShop = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user._id;
    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    const {
      shopName,
      description,
      category,
      phoneNumber,
      address,
      logo,
      banner,
    } = req.body;

    if (shopName && shopName.trim() !== shop.shopName) {
      // Check duplicate
      const duplicate = await Shop.findOne({
        _id: { $ne: shop._id },
        shopName: { $regex: new RegExp(`^${shopName.trim()}$`, "i") },
      });
      if (duplicate) {
        return next(new ErrorHandler("Shop name already taken", 400));
      }
      shop.shopName = shopName.trim();
    }

    if (description !== undefined) shop.description = description.trim();
    if (category !== undefined) shop.category = category.trim();
    if (phoneNumber !== undefined) shop.phoneNumber = String(phoneNumber).trim();

    // Upload logo file if provided, otherwise update from URL if passed
    if (req.files?.logo?.[0]) {
      const file = req.files.logo[0];
      if (!file.mimetype.startsWith("image/")) {
        return next(
          new ErrorHandler("Please upload a valid image file for logo", 400),
        );
      }
      const uploadRes = await uploadToCloudinary(file.buffer);
      shop.logo = uploadRes?.secure_url || shop.logo;
    } else if (logo !== undefined) {
      shop.logo = logo.trim();
    }

    // Upload banner file if provided, otherwise update from URL if passed
    if (req.files?.banner?.[0]) {
      const file = req.files.banner[0];
      if (!file.mimetype.startsWith("image/")) {
        return next(
          new ErrorHandler("Please upload a valid image file for banner", 400),
        );
      }
      const uploadRes = await uploadToCloudinary(file.buffer);
      shop.banner = uploadRes?.secure_url || shop.banner;
    } else if (banner !== undefined) {
      shop.banner = banner.trim();
    }

    if (address !== undefined) {
      let parsedAddress = address;
      if (typeof parsedAddress === "string") {
        try {
          parsedAddress = JSON.parse(parsedAddress);
        } catch (err) {
          parsedAddress = shop.address;
        }
      }
      shop.address = parsedAddress;
    }

    await shop.save();

    return res.status(200).json({
      success: true,
      message: "Shop details updated successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Update my shop error:", error);
    return next(new ErrorHandler("Failed to update shop", 500));
  }
};

module.exports = {
  authenticateSeller,
  createShop,
  getMyShop,
  updateMyShop,
};
