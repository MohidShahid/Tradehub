import { Heart, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import {
  addInWhishlist,
  removeFromWhishlist,
} from "@/lib/features/wishlistSlice";
import { addItemsCart, removeItemsCart } from "@/lib/features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cartItems = useSelector((state) => state.cart.Items);

  const productId = product._id || product.id;
  const isInWishlist = wishlist.some(
    (item) => String(item._id || item.id) === String(productId)
  );

  const cartItem = cartItems.find(
    (item) => String(item._id || item.id) === String(productId)
  );
  const cartQuantity = cartItem?.quantity || 0;

  const imageSrc =
    product.featuredImage ||
    product.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    "/placeholder.png";

  const currentPrice =
    product.salePrice != null &&
    product.salePrice > 0 &&
    product.salePrice < (product.regularPrice || Infinity)
      ? product.salePrice
      : (product.price ?? product.regularPrice ?? 0);

  const originalPrice =
    product.regularPrice != null && product.regularPrice > currentPrice
      ? product.regularPrice
      : (product.oldPrice && product.oldPrice > currentPrice
          ? product.oldPrice
          : null);

  const discountPercent =
    originalPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : (product.discount || 0);

  const handleCardClick = () => {
    const slug = encodeURIComponent(
      String(product.name || "product").toLowerCase().replace(/\s+/g, "-")
    );
    navigate(`/${slug}/${productId}`);
  };

  return (
    <div
      className="group relative flex w-full flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white p-2 sm:p-2.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-(--color-primary)/35 hover:shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image Area - Fluid Aspect Square */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg sm:rounded-xl bg-gray-50/80 p-1.5 sm:p-2">
        <img
          src={imageSrc}
          alt={product.name || "Product"}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-(--color-accent) px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button with stopPropagation */}
        <button
          type="button"
          aria-label="Wishlist"
          className={`absolute right-1.5 top-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full backdrop-blur-xs shadow-xs transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
            isInWishlist
              ? "bg-white text-(--color-accent) shadow-orange-500/20"
              : "bg-white/90 text-gray-400 hover:text-(--color-accent) hover:bg-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              isInWishlist
                ? removeFromWhishlist(productId)
                : addInWhishlist(product)
            );
          }}
        >
          <Heart
            size={13}
            fill={isInWishlist ? "#f97316" : "none"}
            color={isInWishlist ? "#f97316" : "currentColor"}
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="mt-2 flex flex-1 flex-col justify-between space-y-1.5">
        <div>
          {/* Product Name */}
          <h3 className="line-clamp-2 text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-(--color-primary) leading-tight min-h-[2rem] sm:min-h-[2.25rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500">
            <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-bold text-gray-800">
              {product.rating ?? "4.8"}
            </span>
            <span className="text-gray-400 truncate">
              ({product.reviews ?? "200+"})
            </span>
          </div>
        </div>

        {/* Bottom Bar: Price & Quick Add Button / Stepper */}
        <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-gray-100">
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-bold text-(--color-primary) block leading-tight truncate">
              Rs. {Number(currentPrice).toLocaleString("en-PK")}
            </span>

            {originalPrice && (
              <span className="text-[10px] text-gray-400 line-through block leading-tight truncate">
                Rs. {Number(originalPrice).toLocaleString("en-PK")}
              </span>
            )}
          </div>

          {/* Quick Add To Cart or Interactive Stepper */}
          {cartQuantity > 0 ? (
            <div
              className="flex items-center shrink-0 rounded-lg border border-(--color-primary)/30 bg-emerald-50/80 p-0.5 shadow-2xs"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decrease button */}
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-white text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-all duration-150 active:scale-90 cursor-pointer shadow-2xs"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeItemsCart(product));
                }}
                title={
                  cartQuantity === 1
                    ? "Remove from cart"
                    : "Decrease quantity"
                }
              >
                <Minus size={11} strokeWidth={2.5} />
              </button>

              {/* Current Quantity */}
              <span className="min-w-4 sm:min-w-5 px-1 text-center text-[11px] sm:text-xs font-bold text-(--color-primary) select-none">
                {cartQuantity}
              </span>

              {/* Increase button */}
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-(--color-primary) text-white hover:bg-(--color-primary-hover) transition-all duration-150 active:scale-90 cursor-pointer shadow-2xs"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addItemsCart(product));
                }}
                title="Increase quantity"
              >
                <Plus size={11} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Add to cart"
              className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-(--color-primary) text-white shadow-xs transition-all duration-200 hover:bg-(--color-primary-hover) active:scale-90 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addItemsCart(product));
              }}
              title="Add to cart"
            >
              <ShoppingCart size={13} className="sm:size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
