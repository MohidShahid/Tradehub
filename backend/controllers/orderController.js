const Order = require("../models/Order");
const Address = require("../models/Address");
const User = require("../models/User");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.error("Stripe initialization error:", err);
  }
}

// Create a new Order (COD or Stripe)
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      orderItems,
      shippingAddress,
      shippingAddressId,
      paymentMethod = "COD",
      orderNotes = "",
    } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return next(new ErrorHandler("No order items provided", 400));
    }

    // Resolve shipping address
    let resolvedAddress = shippingAddress;
    if (!resolvedAddress && shippingAddressId) {
      if (mongoose.Types.ObjectId.isValid(shippingAddressId)) {
        const found = await Address.findOne({
          _id: shippingAddressId,
          userId,
        });
        if (found) {
          resolvedAddress = {
            fullName: found.fullName,
            phoneNumber: found.phoneNumber,
            completeAddress: found.completeAddress,
            city: found.city,
            state: found.state || "",
            country: found.country || "Pakistan",
            postalCode: found.postalCode || "",
            addressType: found.addressType || "Home",
          };
        }
      }
    }

    if (!resolvedAddress || !resolvedAddress.completeAddress || !resolvedAddress.city) {
      return next(
        new ErrorHandler("Valid delivery shipping address is required", 400)
      );
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce((acc, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      return acc + price * qty;
    }, 0);

    const shippingPrice = 0; // Free shipping in marketplace
    const totalPrice = itemsPrice + shippingPrice;

    // Sanitize order items and guarantee shopId from Product model
    const sanitizedItems = await Promise.all(
      orderItems.map(async (item) => {
        const rawId = item._id || item.productId || item.id;
        const cleanId = String(rawId).split("_")[0];
        let shopId = item.shopId?._id || item.shopId || null;

        if (!shopId && mongoose.Types.ObjectId.isValid(cleanId)) {
          const dbProduct = await Product.findById(cleanId).select("shopId");
          if (dbProduct?.shopId) {
            shopId = dbProduct.shopId;
          }
        }

        return {
          productId: mongoose.Types.ObjectId.isValid(cleanId)
            ? cleanId
            : new mongoose.Types.ObjectId(),
          name: item.name || "Marketplace Product",
          quantity: Math.max(1, Number(item.quantity || 1)),
          price: Number(item.price || 0),
          image: item.image || item.featuredImage || "",
          selectedVariant: item.selectedVariant || null,
          shopId,
        };
      })
    );

    const isStripe = String(paymentMethod).toUpperCase() === "STRIPE";

    const order = await Order.create({
      user: userId,
      orderItems: sanitizedItems,
      shippingAddress: resolvedAddress,
      paymentMethod: isStripe ? "Stripe" : "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderNotes: orderNotes ? String(orderNotes).trim() : "",
    });

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    // Handle Stripe Online Payment
    if (isStripe) {
      if (stripe) {
        // Build Stripe line items
        const lineItems = sanitizedItems.map((item) => ({
          price_data: {
            currency: "pkr",
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100), // PKR paisas
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${frontendUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
          cancel_url: `${frontendUrl}/checkout?canceled=true&order_id=${order._id}`,
          metadata: {
            orderId: String(order._id),
            userId: String(userId),
          },
        });

        order.stripeSessionId = session.id;
        await order.save();

        return res.status(201).json({
          success: true,
          message: "Stripe checkout session created",
          order,
          redirectUrl: session.url,
        });
      } else {
        // Stripe secret key not yet configured in .env -> provide seamless simulated demo redirect
        order.stripeSessionId = `sim_session_${Date.now()}`;
        order.paymentStatus = "Paid";
        order.paidAt = new Date();
        await order.save();

        return res.status(201).json({
          success: true,
          message:
            "Order created. (Stripe running in demo mode, marked as paid)",
          order,
          redirectUrl: `${frontendUrl}/order/success?order_id=${order._id}&demo=true`,
        });
      }
    }

    // COD Flow
    return res.status(201).json({
      success: true,
      message: "Order placed successfully with Cash on Delivery",
      order,
      redirectUrl: null,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to create order", 500)
    );
  }
};

// Verify Stripe Payment
const verifyStripePayment = async (req, res, next) => {
  try {
    const { orderId, sessionId } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new ErrorHandler("Invalid order ID", 400));
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    if (order.paymentStatus === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    if (stripe && sessionId && !sessionId.startsWith("sim_")) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        order.paymentStatus = "Paid";
        order.paidAt = new Date();
        await order.save();
      }
    } else {
      // Demo / simulated
      order.paymentStatus = "Paid";
      order.paidAt = new Date();
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("verifyStripePayment error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to verify payment", 500)
    );
  }
};

// Get single order details
const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid order ID", 400));
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getOrderDetails error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to fetch order", 500)
    );
  }
};

// Get all orders for logged-in user
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to fetch orders", 500)
    );
  }
};

// Get orders for the seller's shop
const getSellerOrders = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.userId });
    if (!shop) {
      return next(
        new ErrorHandler("Shop not found for this seller account", 404)
      );
    }

    // Find orders containing items belonging to this shop
    const orders = await Order.find({ "orderItems.shopId": shop._id })
      .populate("user", "fullName email phoneNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
      shop,
    });
  } catch (error) {
    console.error("getSellerOrders error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to fetch seller orders", 500)
    );
  }
};

// Update order status by seller
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return next(new ErrorHandler("Invalid order status", 400));
    }

    const shop = await Shop.findOne({ owner: req.user.userId });
    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    const order = await Order.findOne({
      _id: id,
      "orderItems.shopId": shop._id,
    });

    if (!order) {
      return next(
        new ErrorHandler(
          "Order not found or does not contain items from your shop",
          404
        )
      );
    }

    order.orderStatus = orderStatus;
    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
      if (order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
        order.paidAt = new Date();
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to update order status", 500)
    );
  }
};

module.exports = {
  createOrder,
  verifyStripePayment,
  getOrderDetails,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
};
