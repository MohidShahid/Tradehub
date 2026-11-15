import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Banknote,
  ShoppingBag,
  Loader2,
  Calendar,
  Truck,
  ExternalLink,
} from "lucide-react";
import { getOrderDetails, verifyPayment } from "@/services/orderService";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // If returned from Stripe checkout session, verify payment
        if (sessionId) {
          try {
            await verifyPayment({ orderId, sessionId });
          } catch (err) {
            console.error("Payment verification warning:", err);
          }
        }

        const res = await getOrderDetails(orderId);
        if (!isMounted) return;
        setOrder(res.data?.order || null);
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, sessionId]);

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  // Calculate estimated delivery date: 3-5 days from order creation
  const getEstimatedDelivery = (dateStr) => {
    const orderDate = dateStr ? new Date(dateStr) : new Date();
    const minDelivery = new Date(orderDate);
    minDelivery.setDate(minDelivery.getDate() + 3);
    const maxDelivery = new Date(orderDate);
    maxDelivery.setDate(maxDelivery.getDate() + 5);

    const options = { month: "short", day: "numeric" };
    return `${minDelivery.toLocaleDateString("en-US", options)} - ${maxDelivery.toLocaleDateString("en-US", options)}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/70 px-4 py-16 text-center">
        <Loader2 size={40} className="animate-spin text-orange-500 mb-3" />
        <h2 className="text-lg font-bold text-gray-800">
          Confirming your order...
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Verifying payment & generating order receipt.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        {/* Celebration Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          {/* Top Banner */}
          <div className="bg-linear-to-b from-green-50/80 to-white px-6 pt-10 pb-6 text-center sm:px-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-xs ring-8 ring-green-50">
              <CheckCircle size={36} strokeWidth={2.5} />
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-800">
              Order Confirmed
            </span>

            <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Thank You For Your Order!
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-gray-500">
              Your order has been placed and is being processed by the merchant.
              We'll send updates as soon as it ships.
            </p>

            {order && (
              <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-gray-100/80 px-4 py-2 font-mono text-xs sm:text-sm text-gray-700">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-bold text-gray-900">#{order._id}</span>
              </div>
            )}
          </div>

          {order ? (
            <div className="p-6 sm:p-10 space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-5 sm:grid-cols-3">
                {/* Delivery Date */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100/70 text-orange-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Est. Delivery
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {getEstimatedDelivery(order.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Payment Method & Status */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
                    {order.paymentMethod === "Stripe" ? (
                      <CreditCard size={18} />
                    ) : (
                      <Banknote size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Payment
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {order.paymentMethod === "Stripe"
                        ? "Card (Stripe)"
                        : "Cash on Delivery"}
                    </p>
                    <span
                      className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100/70 text-green-600">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Deliver To
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {order.shippingAddress?.city}, {order.shippingAddress?.country || "Pakistan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="mb-3 text-sm font-bold text-gray-900">
                  Items in this order ({order.orderItems?.length || 0})
                </h2>

                <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
                  {order.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50/50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-50 border p-1.5 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Package size={24} className="text-gray-300" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Quantity: {item.quantity} &times; {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs sm:text-sm font-extrabold text-gray-900 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(order.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200/80 pt-2 flex justify-between text-sm sm:text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>

              {/* Delivery Note */}
              <div className="flex items-center gap-2.5 rounded-xl bg-orange-50/60 border border-orange-100 p-3 text-xs text-orange-800">
                <Truck size={17} className="shrink-0 text-orange-600" />
                <span>
                  Our delivery partner will reach out to you via SMS / phone call
                  before delivering to your doorstep.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              Your order confirmation has been dispatched.
            </div>
          )}

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-90 transition w-full sm:w-auto"
            >
              <ShoppingBag size={16} /> Continue Shopping
            </Link>

            <Link
              to="/user-profile"
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline w-full sm:w-auto"
            >
              <span>View in Profile / Orders</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
