import { useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  clearWishlist,
  removeFromWhishlist,
} from "@/lib/features/wishlistSlice";
import { addItemsCart, removeItemsCart } from "@/lib/features/cartSlice";
import {
  formatPricePKR,
  getProductId,
  getProductImage,
  getProductPath,
  getProductPricing,
} from "@/utils/helpers";

const runViewTransition = (update) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function" &&
    !prefersReducedMotion
  ) {
    document.documentElement.classList.add("wishlist-transitioning");
    const transition = document.startViewTransition(() => {
      flushSync(update);
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove("wishlist-transitioning");
    });
  } else {
    update();
  }
};

const WishlistSection = ({ embedded = false }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cartItems = useSelector((state) => state.cart.Items);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const confirmDialogRef = useRef(null);
  const rawId = useId();
  const scopePrefix = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const dialogTitleId = `clear-wishlist-title-${scopePrefix}`;
  const searchInputId = `wishlist-search-${scopePrefix}`;
  const sortSelectId = `wishlist-sort-${scopePrefix}`;

  const categories = useMemo(() => {
    const unique = new Set();
    for (const item of wishlist) {
      if (item?.category) {
        unique.add(String(item.category).trim());
      }
    }
    return Array.from(unique);
  }, [wishlist]);

  const filteredWishlist = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = wishlist.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        String(item?.category || "").toLowerCase() ===
          selectedCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        item?.name,
        item?.category,
        item?.seller,
        item?.sellerName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort(
        (a, b) =>
          getProductPricing(a).currentPrice - getProductPricing(b).currentPrice,
      );
    }

    if (sortBy === "price-desc") {
      return [...filtered].sort(
        (a, b) =>
          getProductPricing(b).currentPrice - getProductPricing(a).currentPrice,
      );
    }

    return filtered;
  }, [wishlist, searchQuery, selectedCategory, sortBy]);

  const totalValue = useMemo(
    () =>
      wishlist.reduce(
        (sum, item) => sum + getProductPricing(item).currentPrice,
        0,
      ),
    [wishlist],
  );

  const handleRemoveItem = (productId) => {
    runViewTransition(() => {
      dispatch(removeFromWhishlist(productId));
    });
  };

  const handleConfirmClear = () => {
    confirmDialogRef.current?.close();
    runViewTransition(() => {
      dispatch(clearWishlist());
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("recent");
  };

  const gridClassName = embedded
    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4";

  return (
    <div className="space-y-6">
      {/* Header & Bulk Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {embedded ? (
            <h2 className="text-2xl font-bold text-slate-900 [text-wrap:balance]">
              My <span className="text-(--color-accent)">Wishlist</span>
            </h2>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl [text-wrap:balance]">
              Your Saved <span className="text-(--color-accent)">Wishlist</span>
            </h1>
          )}
          <p className="mt-1.5 text-sm text-gray-500 [text-wrap:pretty]">
            {wishlist.length > 0
              ? `${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} saved • Estimated total ${formatPricePKR(totalValue)}`
              : "Keep track of products you love and move them to your cart anytime."}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-(--color-accent)">
            <Heart size={32} aria-hidden="true" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 [text-wrap:balance]">
            Your wishlist is empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 [text-wrap:pretty]">
            Tap the heart icon on any product to save it here for quick price
            checks and effortless shopping later.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--color-accent) px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:opacity-90"
            >
              Explore Marketplace
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              to="/cart"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Cart
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter & Sort Toolbar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative min-w-0 flex-1 basis-52">
                <label htmlFor={searchInputId} className="sr-only">
                  Search saved wishlist items
                </label>
                <Search
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id={searchInputId}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter saved items..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-(--color-primary) focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 shrink-0">
                <label
                  htmlFor={sortSelectId}
                  className="text-xs font-semibold text-gray-500 whitespace-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id={sortSelectId}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs sm:text-sm font-medium text-gray-800 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer"
                >
                  <option value="recent">Recently Saved</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  aria-pressed={selectedCategory === "all"}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-(--color-primary) text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({wishlist.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === category
                        ? "bg-(--color-primary) text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtered Results or No Match State */}
          {filteredWishlist.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-base font-semibold text-gray-800">
                No saved items match your filter
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try clearing your search query or selecting another category.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex min-h-9 items-center rounded-lg bg-gray-100 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <section aria-labelledby={`wishlist-heading-${scopePrefix}`}>
              <h2 id={`wishlist-heading-${scopePrefix}`} className="sr-only">
                Saved Wishlist Products
              </h2>

              <ul role="list" className={gridClassName}>
                {filteredWishlist.map((product) => {
                  const productId = getProductId(product);
                  const safeId = productId.replace(/[^a-zA-Z0-9_-]/g, "-");
                  const imageSrc = getProductImage(product);
                  const { currentPrice, originalPrice, discountPercent } =
                    getProductPricing(product);
                  const productUrl = getProductPath(product);

                  const stockCount =
                    product?.stock != null ? Number(product.stock) : null;
                  const isOutOfStock = stockCount !== null && stockCount <= 0;

                  const cartItem = cartItems.find(
                    (item) => getProductId(item) === productId,
                  );
                  const cartQuantity = cartItem?.quantity || 0;

                  return (
                    <li
                      key={productId}
                      className="wishlist-card-item"
                      style={{
                        viewTransitionName: `wishlist-${scopePrefix}-${safeId}`,
                      }}
                    >
                      <article className="wishlist-card group relative flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white p-2 sm:p-3 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-(--color-primary)/35 hover:shadow-md">
                        {/* Media Area */}
                        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg sm:rounded-xl bg-gray-50/80 p-2">
                          <img
                            src={imageSrc}
                            alt={product?.name || "Wishlist product"}
                            loading="lazy"
                            className={`aspect-square h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105 ${
                              isOutOfStock ? "opacity-55 grayscale-[35%]" : ""
                            }`}
                          />

                          {discountPercent > 0 && (
                            <span className="absolute left-1.5 top-1.5 rounded-md bg-(--color-accent) px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                              -{discountPercent}%
                            </span>
                          )}

                          {isOutOfStock && (
                            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                              Out of Stock
                            </span>
                          )}

                          <button
                            type="button"
                            aria-label={`Remove ${product?.name || "item"} from wishlist`}
                            onClick={() => handleRemoveItem(productId)}
                            className="wishlist-icon-btn absolute right-1.5 top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-xs backdrop-blur-xs transition-colors hover:bg-red-50 hover:text-red-600 active:scale-90 cursor-pointer"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="mt-2.5 flex flex-1 flex-col justify-between space-y-2">
                          <div className="min-w-0">
                            {/* Category & Stock */}
                            <div className="mb-1 flex items-center justify-between gap-1.5">
                              <span className="truncate text-[10px] sm:text-[11px] font-medium text-gray-400">
                                {product?.category ||
                                  product?.seller ||
                                  "TradeHub"}
                              </span>
                              {!isOutOfStock && (
                                <span className="shrink-0 text-[10px] font-semibold text-emerald-700">
                                  In stock
                                </span>
                              )}
                            </div>

                            {/* Primary Stretched Link Heading */}
                            <h3>
                              <Link
                                to={productUrl}
                                className="card-link line-clamp-2 min-h-[2rem] sm:min-h-[2.4rem] text-xs sm:text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-(--color-primary)"
                              >
                                {product?.name}
                              </Link>
                            </h3>

                            {/* Rating */}
                            <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                              <Star
                                size={12}
                                aria-hidden="true"
                                className="shrink-0 fill-amber-400 text-amber-400"
                              />
                              <span className="font-bold text-gray-800">
                                {product?.rating ?? "4.8"}
                              </span>
                              <span className="truncate text-gray-400">
                                ({product?.reviews ?? "200+"})
                              </span>
                            </div>

                            {/* Price */}
                            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                              <span className="text-xs sm:text-sm md:text-base font-bold text-(--color-primary)">
                                {formatPricePKR(currentPrice)}
                              </span>
                              {originalPrice && (
                                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                  {formatPricePKR(originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <footer className="border-t border-gray-100 pt-2">
                            {isOutOfStock ? (
                              <button
                                type="button"
                                disabled
                                className="flex min-h-8 sm:min-h-9 w-full items-center justify-center rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-400 cursor-not-allowed"
                              >
                                Currently Unavailable
                              </button>
                            ) : cartQuantity > 0 ? (
                              <div className="flex w-full items-center justify-between rounded-lg border border-(--color-primary)/30 bg-emerald-50/80 p-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  aria-label={`Decrease quantity of ${product?.name || "item"}`}
                                  onClick={() =>
                                    dispatch(removeItemsCart(product))
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-(--color-primary) shadow-2xs transition-colors hover:bg-(--color-primary) hover:text-white active:scale-90 cursor-pointer"
                                >
                                  <Minus
                                    size={13}
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                  />
                                </button>

                                <span className="min-w-0 px-1 text-center text-xs font-bold text-(--color-primary) select-none">
                                  {cartQuantity}
                                  <span className="hidden sm:inline">
                                    {" "}
                                    in Cart
                                  </span>
                                </span>

                                <button
                                  type="button"
                                  aria-label={`Increase quantity of ${product?.name || "item"}`}
                                  onClick={() =>
                                    dispatch(addItemsCart(product))
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-md bg-(--color-primary) text-white shadow-2xs transition-colors hover:bg-(--color-primary-hover) active:scale-90 cursor-pointer"
                                >
                                  <Plus
                                    size={13}
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => dispatch(addItemsCart(product))}
                                className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-(--color-primary) px-3 text-xs font-semibold text-white shadow-xs transition hover:bg-(--color-primary-hover) active:scale-95 cursor-pointer"
                              >
                                <ShoppingCart size={14} aria-hidden="true" />
                                Add to Cart
                              </button>
                            )}
                          </footer>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}

      {/* Native Modal Confirmation Dialog for Clear Wishlist */}
      <dialog
        ref={confirmDialogRef}
        aria-labelledby={dialogTitleId}
        onClick={(e) => {
          if (e.target === confirmDialogRef.current) {
            confirmDialogRef.current.close();
          }
        }}
        className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Trash2 size={20} aria-hidden="true" />
          </div>

          <div>
            <h2 id={dialogTitleId} className="text-lg font-bold text-gray-900">
              Clear your wishlist?
            </h2>
            <p className="mt-1 text-sm text-gray-500 [text-wrap:pretty]">
              This will remove all {wishlist.length} saved{" "}
              {wishlist.length === 1 ? "item" : "items"} from your wishlist. You
              can still find products anytime across the marketplace.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => confirmDialogRef.current?.close()}
              className="min-h-10 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="min-h-10 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              Clear Wishlist
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default WishlistSection;
