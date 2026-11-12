const Coupons = require("../models/Coupons");
const Shop = require("../models/Shop");
const ErrorHandler = require("../utils/ErrorHandler");

const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      totalCoupons,
      alreadyUsed,
      applicableProducts,
      expiryDate,
    } = req.body;

    const shop = await Shop.findOne({ userId: req.user._id });
    if (!shop) {
      return next(new ErrorHandler("Doesn't have a shop on this account", 401));
    }

    const existingCoupon = await Coupons.findOne({ code });

    if (existingCoupon) {
      return next(
        new ErrorHandler(
          "Coupon Code already exists choose a different one.",
          401,
        ),
      );
    }

    const coupon = new Coupons({
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      totalCoupons,
      alreadyUsed,
      applicableProducts,
      shopId: shop._id,
      expiryDate: expiryDate,
      isActive: true,
    });

    await coupon.save();

    return res.json({ success: true, message: "Coupon Created Successfully" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const getShopCoupons = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ userId: req.user._id });
    if (!shop) {
      return next(new ErrorHandler("Doesn't have a shop on this account", 401));
    }

    const coupons = await Coupons.find({ shopId: shop._id });

    return res.json({ success: true, data: coupons });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      totalCoupons,
      applicableProducts,
      expiryDate,
    } = req.body;

    const shop = await Shop.findOne({ userId: req.user._id });
    if (!shop) {
      return next(new ErrorHandler("Doesn't have a shop on this account", 401));
    }

    const existingCoupon = await Coupons.findOne({ code });

    if (!existingCoupon) {
      return next(
        new ErrorHandler(`${code} didnt exist give correct data`, 401),
      );
    }

    const updatedCoupon = await Coupons.findOneAndUpdate(
      { code },
      {
        code,
        discountType,
        discountValue,
        minimumOrderAmount,
        totalCoupons,
        alreadyUsed,
        applicableProducts,
        shopId: shop._id,
        expiryDate: expiryDate,


        isActive: true,
      },
    );

    return res.json({ success: true, message: "Coupon Updated Successfully" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const deleteCoupon = async()=>{
  try {
    const {id} = req.params;
    await Coupons.findByIdAndDelete({_id : id});

    return res.json({success : true, message : "Coupon deleted successfully"})
    
    
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
}

module.exports = { createCoupon, getShopCoupons, updateCoupon, deleteCoupon };
