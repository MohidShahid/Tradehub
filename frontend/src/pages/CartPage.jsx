
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";

import {
  addItemsCart,
  removeItemsCart,
} from "@/lib/features/cartSlice";

import { Link } from "react-router-dom";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.Items);
  const dispatch = useDispatch();

  // Replace this with your actual saved address from Redux/API.
  const selectedAddress = null;

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
            <ShoppingBag
              size={55}
              className="mx-auto mb-4 text-gray-300"
            />
            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>
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
                            onClick={() =>
                              dispatch(removeItemsCart(item))
                            }
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
                              onClick={() =>
                                dispatch(removeItemsCart(item))
                              }
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
                              onClick={() =>
                                dispatch(addItemsCart(item))
                              }
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

              {/* Delivery Address */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={19} className="text-(--color-accent)" />
                    <h2 className="font-bold text-gray-900">
                      Delivery Address
                    </h2>
                  </div>
                </div>

                {selectedAddress ? (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {selectedAddress.fullName}
                      </span>
                      {selectedAddress.isDefault && (
                        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-6 text-gray-500">
                      {selectedAddress.streetAddress},{" "}
                      {selectedAddress.city},{" "}
                      {selectedAddress.state},{" "}
                      {selectedAddress.country}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {selectedAddress.phone}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-800">
                      No delivery address selected
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Add your shipping address during checkout to see
                      available delivery options.
                    </p>
                  </div>
                )}

                <Link
                  to="/checkout"
                  className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-(--color-accent) hover:opacity-80"
                >
                  {selectedAddress ? "Change Address" : "Add Delivery Address"}
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Order Summary */}
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
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
                    <span className="font-medium text-green-600">
                      Free
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t" />

                {/* Coupon */}
                <div className="mb-5">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Tag size={16} />
                    Promo Code
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
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
                  <span className="font-bold text-gray-900">
                    Estimated Total
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-accent) py-3.5 font-semibold text-white transition hover:opacity-90"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>

                <div className="mt-5 space-y-3 border-t pt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-green-600" />
                    Secure checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={17} className="text-green-600" />
                    Delivery options at checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
