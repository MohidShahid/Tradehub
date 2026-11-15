import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Banknote,
  Loader2,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { getMyOrders } from "@/services/orderService";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders();
        if (!isMounted) return;
        setOrders(res.data?.orders || []);
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  if (loading) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center">
        <Loader2 size={30} className="animate-spin text-orange-500 mb-2" />
        <p className="text-xs text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <ShoppingBag size={44} className="mx-auto mb-3 text-gray-300" />
        <h3 className="text-base font-bold text-gray-800">No orders placed yet</h3>
        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
          Explore products from our sellers and place your first order.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-(--color-accent) px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={order._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-gray-300 space-y-4"
          >
            {/* Order Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-gray-900">
                    #{order._id}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                  <Calendar size={12} /> Placed on {orderDate}
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-gray-900">
                  {formatPrice(order.totalPrice)}
                </span>
                <div className="flex items-center justify-end gap-1 text-[11px] text-gray-500 mt-0.5">
                  {order.paymentMethod === "Stripe" ? (
                    <CreditCard size={12} />
                  ) : (
                    <Banknote size={12} />
                  )}
                  <span>
                    {order.paymentMethod === "Stripe" ? "Card" : "COD"} (
                    {order.paymentStatus})
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="divide-y divide-gray-50 space-y-2">
              {order.orderItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 pt-2 first:pt-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-50 border p-1 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Package size={16} className="text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity} &times; {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-900 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Card Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin size={13} className="shrink-0 text-gray-400" />
                <span className="truncate max-w-xs">
                  {order.shippingAddress?.completeAddress},{" "}
                  {order.shippingAddress?.city}
                </span>
              </div>

              <Link
                to={`/order/success?order_id=${order._id}`}
                className="inline-flex items-center gap-1 font-semibold text-(--color-accent) hover:underline"
              >
                View Receipt <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersSection;
