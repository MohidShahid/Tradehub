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
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  MapPin,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

import {
  addItemsCart,
  removeItemsCart,
  deleteItemCart,
} from "@/lib/features/cartSlice";
import { getUserAddresses } from "@/services/addressService";
import AddressModal from "@/components/cart/AddressModal";
import { toast } from "@/components/ui/toast";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.Items);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState("auto"); // "auto", "add", "select"

  // Fetch user addresses on mount or when auth changes
  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated && !user) return;

    const loadAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await getUserAddresses();
        if (!isMounted) return;
        const list = res.data?.addresses || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0] || null;
        setSelectedAddress(def);
      } catch (err) {
        console.error("Cart address fetch error:", err);
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

  const handleCheckoutClick = () => {
    if (!isAuthenticated && !user) {
      toast.add({
        type: "error",
        description: "Please log in to proceed to checkout",
      });
      navigate("/login?redirect=/cart");
      return;
    }

    if (!selectedAddress) {
      toast.add({
        type: "error",
        description: "Please add a delivery address to proceed with checkout",
      });
      setAddressModalMode("add");
      setIsAddressModalOpen(true);
      return;
    }

    navigate("/checkout");
  };

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
              <BreadcrumbLink href="/cart">Shopping Cart</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Your Shopping{" "}
              <span className="text-(--color-accent)">Cart</span>
            </h1>
            <p className="mt-2 text-gray-500">
              Review your items before proceeding to checkout.
            </p>
          </div>

          <span className="text-sm font-medium text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </span>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-2xl border bg-white p-10 text-center">
            <ShoppingBag size={55} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--color-accent) px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            {/* Cart Products */}
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                <h2 className="mb-2 text-lg font-bold text-gray-900">
                  Cart Items
                </h2>

                {cartItems.map((item) => {
                  const price = Number(
                    item.salePrice ?? item.regularPrice ?? item.price ?? 0
                  );

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col gap-5 border-b border-gray-100 py-6 last:border-0 sm:flex-row"
                    >
                      {/* Product Image */}
                      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                        <img
                          src={item.image || item.featuredImage}
                          alt={item.name}
                          className="h-full w-full rounded-xl object-contain p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col justify-between gap-4">
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.category || "Marketplace Product"}
                            </p>
                            <p className="mt-2 text-sm font-medium text-gray-700">
                              {formatPrice(price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => dispatch(deleteItemCart(item))}
                            className="h-fit text-gray-400 transition hover:text-red-500"
                            title="Remove item"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="inline-flex items-center rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() => dispatch(removeItemsCart(item))}
                              className="p-2.5 transition hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-10 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => dispatch(addItemsCart(item))}
                              className="p-2.5 transition hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatPrice(price * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatPrice(price)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-accent) hover:underline"
              >
                <ArrowRight className="rotate-180" size={17} />
                Continue Shopping
              </Link>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5 lg:col-span-1">
              {/* Delivery Address Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={19} className="text-(--color-accent)" />
                    <h2 className="font-bold text-gray-900">
                      Delivery Address
                    </h2>
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
                      Change
                    </button>
                  )}
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-6 text-gray-400">
                    <Loader2 size={20} className="animate-spin text-orange-500" />
                    <span className="ml-2 text-xs">Loading address...</span>
                  </div>
                ) : !isAuthenticated && !user ? (
                  /* Guest user prompt */
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-4 text-center">
                    <p className="text-xs text-gray-600">
                      Sign in to select or add your delivery address.
                    </p>
                    <Link
                      to="/login?redirect=/cart"
                      className="mt-2.5 inline-flex items-center justify-center rounded-lg bg-(--color-accent) px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-90"
                    >
                      Log in to Add Address
                    </Link>
                  </div>
                ) : selectedAddress ? (
                  /* Address Displayed */
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
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

                    {(selectedAddress.phoneNumber || user?.phoneNumber) && (
                      <p className="mt-1 text-xs text-gray-500">
                        Phone: {selectedAddress.phoneNumber || user?.phoneNumber}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setAddressModalMode("add");
                          setIsAddressModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-(--color-accent) hover:underline"
                      >
                        <Plus size={13} /> Add another
                      </button>

                      <Link
                        to="/address?redirect=/cart"
                        className="inline-flex items-center gap-1 font-medium text-gray-500 hover:text-gray-800"
                      >
                        Manage addresses <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* No Address Found */
                  <div className="space-y-3">
                    <div className="rounded-xl border border-orange-200/80 bg-orange-50/60 p-3.5">
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          size={16}
                          className="mt-0.5 shrink-0 text-orange-600"
                        />
                        <div>
                          <p className="text-xs font-semibold text-orange-950">
                            No delivery address found
                          </p>
                          <p className="mt-0.5 text-[11px] text-orange-700 leading-normal">
                            Add a delivery address to calculate shipping &
                            complete your purchase.
                          </p>
                        </div>
                      </div>

                      {/* Add Address button (opens modal directly on Cart page) */}
                      <button
                        type="button"
                        onClick={() => {
                          setAddressModalMode("add");
                          setIsAddressModalOpen(true);
                        }}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-(--color-accent) py-2 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition"
                      >
                        <Plus size={14} /> Add Delivery Address
                      </button>
                    </div>

                    {/* Or navigate to dedicated address page */}
                    <Link
                      to="/address/create?redirect=/cart"
                      className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500 hover:text-(--color-accent)"
                    >
                      <span>Or open full address page</span>
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-xs">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                <div className="my-5 border-t" />

                {/* Promo Code */}
                <div className="mb-5">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Tag size={16} /> Promo Code
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      className="rounded-lg bg-gray-100 px-4 text-sm font-semibold transition hover:bg-gray-200"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="my-5 border-t" />

                <div className="mb-5 flex items-center justify-between">
                  <span className="font-bold text-gray-900">Estimated Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Proceed to Checkout Button */}
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-accent) py-3.5 font-semibold text-white shadow-xs transition hover:opacity-90"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                <div className="mt-5 space-y-3 border-t pt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-green-600" />
                    Secure checkout guaranteed
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={17} className="text-green-600" />
                    Delivery tracked to your address
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Management / Creation Modal */}
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

export default CartPage;
