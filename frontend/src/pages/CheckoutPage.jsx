import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Check,
  ChevronRight,
  FileText,
} from "lucide-react";

import { clearCart } from "@/lib/features/cartSlice";
import { getUserAddresses } from "@/services/addressService";
import { createOrder } from "@/services/orderService";
import AddressModal from "@/components/cart/AddressModal";
import { toast } from "@/components/ui/toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.Items);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState("auto");

  // Order state
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "Stripe"
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    let isMounted = true;

    const loadAddresses = async () => {
      if (!isAuthenticated && !user) {
        if (isMounted) setLoadingAddresses(false);
        return;
      }

      try {
        setLoadingAddresses(true);
        const res = await getUserAddresses();
        if (!isMounted) return;
        const list = res.data?.addresses || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0] || null;
        setSelectedAddress(def);
      } catch (err) {
        console.error("Checkout address fetch error:", err);
      } finally {
        if (isMounted) setLoadingAddresses(false);
      }
    };

    loadAddresses();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.salePrice ?? item.regularPrice ?? item.price) || 0) *
        item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString("en-PK")}`;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated && !user) {
      toast.add({
        type: "error",
        description: "Please log in to place an order",
      });
      navigate("/login?redirect=/checkout");
      return;
    }

    if (cartItems.length === 0) {
      toast.add({
        type: "error",
        description: "Your cart is empty",
      });
      navigate("/cart");
      return;
    }

    if (!selectedAddress) {
      toast.add({
        type: "error",
        description: "Please select or add a delivery address",
      });
      setAddressModalMode("add");
      setIsAddressModalOpen(true);
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          productId: item._id || item.productId || item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.salePrice ?? item.regularPrice ?? item.price ?? 0),
          image: item.image || item.featuredImage || "",
          selectedVariant: item.selectedVariant || null,
          shopId: item.shopId || null,
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName || user?.fullName || "Recipient",
          phoneNumber: selectedAddress.phoneNumber || user?.phoneNumber || "",
          completeAddress: selectedAddress.completeAddress,
          city: selectedAddress.city,
          state: selectedAddress.state || "",
          country: selectedAddress.country || "Pakistan",
          postalCode: selectedAddress.postalCode || "",
          addressType: selectedAddress.addressType || "Home",
        },
        paymentMethod,
        orderNotes,
      };

      const res = await createOrder(orderPayload);

      // Clear cart items from store
      dispatch(clearCart());

      if (paymentMethod === "Stripe" && res.data?.redirectUrl) {
        toast.add({
          type: "info",
          description: "Redirecting to secure payment...",
        });
        window.location.href = res.data.redirectUrl;
      } else {
        toast.add({
          type: "success",
          description: "Order placed successfully!",
        });
        const orderId = res.data?.order?._id;
        navigate(`/order/success?order_id=${orderId}`);
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to place order. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/70 px-4 py-16 text-center">
        <div className="rounded-2xl border bg-white p-10 max-w-md w-full shadow-xs">
          <ShoppingBag size={55} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-gray-500">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/cart"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-6 py-3 font-semibold text-white hover:opacity-90 transition w-full"
          >
            <ArrowLeft size={16} /> View Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 px-4 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/checkout">Checkout</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Order <span className="text-(--color-accent)">Checkout</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Confirm your delivery address and choose a payment method.
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-(--color-accent) hover:underline"
          >
            <ArrowLeft size={15} /> Back to Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column (2 cols): Address, Payment Method, Order Notes */}
          <div className="space-y-6 lg:col-span-2">
            {/* 1. Delivery Address Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      1. Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                {selectedAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      setAddressModalMode("select");
                      setIsAddressModalOpen(true);
                    }}
                    className="text-xs font-semibold text-(--color-accent) hover:underline"
                  >
                    Change Address
                  </button>
                )}
              </div>

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-6 text-gray-400">
                  <Loader2 size={20} className="animate-spin text-orange-500" />
                  <span className="ml-2 text-xs">Loading addresses...</span>
                </div>
              ) : selectedAddress ? (
                <div className="rounded-xl border border-orange-500/60 bg-orange-50/20 p-4 ring-1 ring-orange-500/10">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-bold text-gray-900 text-sm">
                      {selectedAddress.fullName || user?.fullName || "Recipient"}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                      {selectedAddress.addressType || "Home"}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        <Check size={11} strokeWidth={3} /> Default
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedAddress.completeAddress}, {selectedAddress.city}
                    {selectedAddress.state ? `, ${selectedAddress.state}` : ""}
                    {selectedAddress.postalCode ? ` - ${selectedAddress.postalCode}` : ""}
                  </p>

                  <p className="mt-1.5 text-xs text-gray-500">
                    Phone: {selectedAddress.phoneNumber || user?.phoneNumber || "N/A"}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                  <MapPin className="mx-auto mb-2 text-gray-300" size={36} />
                  <p className="text-sm font-semibold text-gray-800">
                    No delivery address selected
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add a delivery address to complete your order.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressModalMode("add");
                      setIsAddressModalOpen(true);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-(--color-accent) px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-90"
                  >
                    <Plus size={15} /> Add Delivery Address
                  </button>
                </div>
              )}
            </div>

            {/* 2. Payment Method Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="mb-4 flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    2. Payment Method
                  </h2>
                  <p className="text-xs text-gray-500">
                    Select how you want to pay for your purchase
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                    paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          paymentMethod === "COD"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Banknote size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-500">Pay when delivered</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        paymentMethod === "COD"
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "COD" && (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-gray-500 border-t border-gray-100 pt-2.5">
                    Pay with cash directly to the courier agent upon receiving your items.
                  </p>
                </div>

                {/* Stripe Card Payment Option */}
                <div
                  onClick={() => setPaymentMethod("Stripe")}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                    paymentMethod === "Stripe"
                      ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          paymentMethod === "Stripe"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <CreditCard size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          Pay with Card
                        </p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, etc.</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        paymentMethod === "Stripe"
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "Stripe" && (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-gray-500 border-t border-gray-100 pt-2.5">
                    Secure 256-bit encrypted card checkout handled powered by Stripe.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Order Notes / Delivery Instructions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="mb-3 flex items-center gap-2">
                <FileText size={18} className="text-gray-500" />
                <h3 className="text-sm font-bold text-gray-900">
                  Delivery Instructions (Optional)
                </h3>
              </div>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please leave with the building guard or call before delivery"
                className="w-full resize-none rounded-xl border border-gray-300 p-3 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* Sidebar (1 col): Order Summary & Place Order Button */}
          <div className="space-y-6 lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              {/* Items Preview */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3 mb-4">
                {cartItems.map((item) => {
                  const itemPrice = Number(
                    item.salePrice ?? item.regularPrice ?? item.price ?? 0
                  );
                  return (
                    <div
                      key={item._id || item.productId || item.name}
                      className="flex items-center justify-between gap-3 pt-3 first:pt-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-50 border p-1 flex items-center justify-center">
                          <img
                            src={item.image || item.featuredImage}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-900 shrink-0">
                        {formatPrice(itemPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-extrabold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={submitting}
                onClick={handlePlaceOrder}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-accent) py-3.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing Order...
                  </>
                ) : paymentMethod === "Stripe" ? (
                  <>
                    Pay with Card ({formatPrice(subtotal)})
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    Confirm & Place Order
                    <ChevronRight size={17} />
                  </>
                )}
              </button>

              <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-green-600 shrink-0" />
                  SSL 256-bit encrypted checkout
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-green-600 shrink-0" />
                  Estimated delivery in 2-4 business days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection / Creation Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        selectedAddressId={selectedAddress?._id}
        initialMode={addressModalMode}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
        onAddressCreated={(newAddr) => {
          setAddresses((prev) => [newAddr, ...prev]);
          setSelectedAddress(newAddr);
        }}
        onAddressDeleted={(deletedId) => {
          setAddresses((prev) => prev.filter((a) => a._id !== deletedId));
          if (selectedAddress?._id === deletedId) {
            setSelectedAddress(
              addresses.find((a) => a._id !== deletedId) || null
            );
          }
        }}
      />
    </div>
  );
};

export default CheckoutPage;
