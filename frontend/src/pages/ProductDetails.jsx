import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Check,
  Package,
  Store,
  Share2,
  ArrowLeft,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import {
  addInWhishlist,
  removeFromWhishlist,
} from "@/lib/features/wishlistSlice";
import { addItemsCart } from "@/lib/features/cartSlice";
import { getProductDetails, getProducts } from "@/services/productService";
import { getProductId, getProductPath } from "@/utils/helpers";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";

const ProductDetails = () => {
  const { id, slug } = useParams();
  const dispatch = useDispatch();

  const rawId = id || slug || "";
  const productId = rawId ? String(rawId).split("_")[0] : "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const wishlist = useSelector((state) => state.wishlist.wishlist);

  // Fetch product details from the backend API
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!productId) {
        if (isMounted) {
          setLoading(false);
          setError("No product specified");
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSelectedImage(0);
        setQuantity(1);

        const response = await getProductDetails(productId);
        const data =
          response?.data?.data || response?.data?.product || response?.data;

        if (!isMounted) return;

        if (data && (data._id || data.id || data.name)) {
          setProduct(data);

          // If product has options, pre-select the first values
          if (data.hasVariants && Array.isArray(data.options)) {
            const initial = {};
            data.options.forEach((opt) => {
              if (opt.name && Array.isArray(opt.values) && opt.values.length > 0) {
                initial[opt.name] = opt.values[0];
              }
            });
            setSelectedOptions(initial);
          } else {
            setSelectedOptions({});
          }

          // Fetch related products in the same category
          if (data.category) {
            getProducts({ category: data.category, excludeId: data._id, limit: 4 })
              .then((res) => {
                if (isMounted) setRelatedProducts(res.data?.data || []);
              })
              .catch(() => {});
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching product details:", err);
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Match selected variant if the product has variations
  const matchedVariant = useMemo(() => {
    if (!product?.hasVariants || !Array.isArray(product?.variants)) return null;

    return (
      product.variants.find((v) => {
        const attrs = v.attributes || {};
        return Object.entries(selectedOptions).every(([key, val]) => {
          const attrVal =
            typeof attrs.get === "function" ? attrs.get(key) : attrs[key];
          return (
            String(attrVal || "").trim().toLowerCase() ===
            String(val || "").trim().toLowerCase()
          );
        });
      }) || null
    );
  }, [product, selectedOptions]);

  // Image list
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }
    const fallback = product.featuredImage || product.image;
    return fallback ? [fallback] : [];
  }, [product]);

  const currentImage =
    images[selectedImage] || product?.featuredImage || product?.image || "";

  // Pricing & Inventory
  const regularPrice = Number(
    matchedVariant?.regularPrice ??
      product?.regularPrice ??
      product?.price ??
      0
  );

  const salePrice = Number(
    matchedVariant?.salePrice ??
      product?.salePrice ??
      0
  );

  const hasDiscount = salePrice > 0 && salePrice < regularPrice;
  const finalPrice = hasDiscount ? salePrice : regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  const stock = Number(matchedVariant?.stock ?? product?.stock ?? 0);
  const isOutOfStock = stock <= 0;

  // Wishlist
  const canonicalId = product ? getProductId(product) : "";
  const isWishlisted = wishlist.some(
    (item) => getProductId(item) === canonicalId
  );

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(removeFromWhishlist(canonicalId));
      toast.add({ type: "success", description: "Removed from wishlist" });
    } else {
      dispatch(addInWhishlist(product));
      toast.add({ type: "success", description: "Added to wishlist" });
    }
  };

  // Option selection
  const handleOptionSelect = (optionName, value) => {
    const nextOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(nextOptions);

    // If matching variant has an image, switch gallery preview to it
    if (Array.isArray(product?.variants) && images.length > 0) {
      const v = product.variants.find((variant) => {
        const attrs = variant.attributes || {};
        return Object.entries(nextOptions).every(
          ([k, val]) =>
            String(attrs[k] || "").trim().toLowerCase() ===
            String(val || "").trim().toLowerCase()
        );
      });
      if (v?.image) {
        const idx = images.findIndex((img) => img === v.image);
        if (idx !== -1) setSelectedImage(idx);
      }
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    dispatch(
      addItemsCart({
        ...product,
        quantity,
        selectedVariant: matchedVariant,
        price: finalPrice,
        regularPrice,
        salePrice: hasDiscount ? salePrice : null,
        image: matchedVariant?.image || currentImage || "",
      })
    );
  };

  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      toast.add({
        type: "success",
        description: "Product link copied to clipboard",
      });
    }
  };

  // 1. Loading state
  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <LoaderCircle size={44} className="animate-spin text-green-800" />
        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          Loading product details...
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fetching latest information from the marketplace.
        </p>
      </main>
    );
  }

  // 2. Error / Not found state
  if (error || !product) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle size={36} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Product not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          {error || "This product may have been removed or does not exist."}
        </p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-green-800 px-6 py-2.5 font-semibold text-white transition hover:bg-green-900"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  // 3. Render Product
  const productName = product.name || "Product";
  const category = product.category || "General";
  const description = product.description || "No description provided.";
  const shopName = product.shopId?.shopName || product.seller || "TradeHub Seller";
  const shopRating = Number(product.shopId?.rating ?? product.rating ?? 4.5);
  const shopReviews = Number(product.shopId?.totalReviews ?? product.reviews ?? 0);
  const sku = matchedVariant?.sku || product.sku || "N/A";

  return (
    <main className="min-h-screen bg-stone-50 pb-16 text-gray-800">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 text-sm sm:px-6 lg:px-8">
          <Link to="/" className="text-gray-500 hover:text-green-800">
            Home
          </Link>
          <ChevronRight size={15} className="text-gray-400" />
          <span className="text-gray-500">{category}</span>
          <ChevronRight size={15} className="text-gray-400" />
          <span className="max-w-xs truncate font-medium text-green-900 sm:max-w-md">
            {productName}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-800"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        {/* Main Product Info Card */}
        <section className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
          {/* Images */}
          <div>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-stone-50 p-6 sm:p-10">
              {hasDiscount && (
                <span className="absolute top-4 left-4 z-10 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-bold text-white shadow-xs">
                  -{discountPercent}% OFF
                </span>
              )}

              <button
                type="button"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-orange-500 text-orange-500" : "text-gray-600"}
                />
              </button>

              {currentImage ? (
                <img
                  src={currentImage}
                  alt={productName}
                  className="h-full w-full object-contain transition duration-300 hover:scale-105"
                />
              ) : (
                <Package size={100} className="text-gray-300" />
              )}
            </div>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 bg-stone-50 p-1 transition ${
                      selectedImage === index
                        ? "border-green-800"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Form */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                {category}
              </span>

              {!isOutOfStock ? (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <Check size={14} />
                  In stock
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  Out of stock
                </span>
              )}

              {product.hasVariants && (
                <Badge variant="outline" className="text-[11px]">
                  Variable Product
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {productName}
            </h1>

            {/* Rating & SKU */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                <Star size={15} className="fill-orange-500 text-orange-500" />
                {shopRating.toFixed(1)}
              </div>
              <span className="text-gray-500">
                {shopReviews} {shopReviews === 1 ? "review" : "reviews"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-muted-foreground">SKU: {sku}</span>
            </div>

            <div className="my-5 border-t border-gray-100" />

            {/* Price */}
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-green-900 sm:text-4xl">
                  Rs. {finalPrice.toLocaleString("en-PK")}
                </span>

                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    Rs. {regularPrice.toLocaleString("en-PK")}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <p className="mt-1.5 text-sm font-medium text-green-700">
                  You save Rs. {(regularPrice - salePrice).toLocaleString("en-PK")} ({discountPercent}% off)
                </p>
              )}
            </div>

            {/* Options / Variations Selector */}
            {product.hasVariants &&
              Array.isArray(product.options) &&
              product.options.length > 0 && (
                <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                  {product.options.map((option) => {
                    const currentVal = selectedOptions[option.name];
                    return (
                      <div key={option.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-800">{option.name}:</span>
                          <span className="font-medium text-green-900">
                            {currentVal || "Select"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(option.values || []).map((val) => {
                            const isSelected = currentVal === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleOptionSelect(option.name, val)}
                                className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${
                                  isSelected
                                    ? "border-green-800 bg-green-50 text-green-900 shadow-xs ring-1 ring-green-800"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Description preview */}
            <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base">
              {description}
            </p>

            {/* Seller Shop Card */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-stone-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800">
                <Store size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Sold by</p>
                <p className="truncate font-semibold text-gray-900">{shopName}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-green-700">
                  <ShieldCheck size={13} />
                  TradeHub marketplace seller
                </p>
              </div>

              <button
                type="button"
                aria-label="Share product"
                onClick={handleShare}
                className="cursor-pointer rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-green-800"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Quantity
              </label>

              <div className="flex items-center gap-4">
                <div className="flex h-12 items-center rounded-lg border border-gray-200 bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-full w-11 cursor-pointer items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-10 text-center font-semibold">
                    {isOutOfStock ? 0 : quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="flex h-full w-11 cursor-pointer items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {stock > 0 && stock <= 5 && (
                  <span className="text-sm font-medium text-orange-600">
                    Only {stock} left in stock!
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <ShoppingCart size={19} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <Link
                to="/cart"
                className="flex min-h-12 items-center justify-center rounded-lg border border-green-800 px-5 py-3 font-semibold text-green-900 transition hover:bg-green-50"
              >
                View Cart
              </Link>
            </div>

            {/* Benefits */}
            <div className="mt-7 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck size={21} className="shrink-0 text-green-800" />
                <div>
                  <p className="text-sm font-semibold">Fast Delivery</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Calculated at checkout
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={21} className="shrink-0 text-green-800" />
                <div>
                  <p className="text-sm font-semibold">Verified Seller</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Shop with confidence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw size={21} className="shrink-0 text-green-800" />
                <div>
                  <p className="text-sm font-semibold">Easy Returns</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    7-day return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-6 border-b border-gray-100">
            {[
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["reviews", `Reviews (${shopReviews})`],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`cursor-pointer border-b-2 pb-4 text-sm font-semibold transition ${
                  activeTab === key
                    ? "border-green-800 text-green-900"
                    : "border-transparent text-gray-500 hover:text-green-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div id="product-reviews" className="pt-6 text-sm leading-7 text-gray-600">
            {activeTab === "description" && (
              <>
                <h2 className="mb-3 text-lg font-bold text-gray-900">
                  Product Description
                </h2>
                <p className="whitespace-pre-line">{description}</p>
              </>
            )}

            {activeTab === "specifications" && (
              <>
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Product Specifications
                </h2>
                <dl className="divide-y divide-gray-100">
                  {[
                    ["Product Name", productName],
                    ["Category", category],
                    ["SKU", sku],
                    ["Seller Shop", shopName],
                    ["Status", product.status || "Active"],
                    ["Availability", !isOutOfStock ? `${stock} in stock` : "Out of stock"],
                    ["Product ID", String(product._id || product.id)],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 gap-4 py-3">
                      <dt className="font-medium text-gray-500">{label}</dt>
                      <dd className="break-words font-medium text-gray-800">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {activeTab === "reviews" && (
              <>
                <h2 className="mb-3 text-lg font-bold text-gray-900">
                  Seller Ratings & Reviews
                </h2>
                <div className="flex items-center gap-3">
                  <Star className="fill-orange-500 text-orange-500" size={25} />
                  <span className="text-xl font-bold text-gray-900">
                    {shopRating.toFixed(1)} / 5
                  </span>
                </div>
                <p className="mt-3">
                  {shopReviews > 0
                    ? `This seller has ${shopReviews} review${shopReviews === 1 ? "" : "s"}.`
                    : "No reviews yet for this seller."}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                  You may also like
                </p>
                <h2 className="mt-1 text-2xl font-bold text-green-950">
                  Related Products
                </h2>
              </div>

              <Link
                to="/"
                className="text-sm font-semibold text-green-800 hover:text-orange-500"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => {
                const image =
                  item.featuredImage ||
                  item.image ||
                  (Array.isArray(item.images) && item.images[0]) ||
                  "";
                const name = item.name || "Product";
                const itemPrice = Number(
                  item.salePrice || item.regularPrice || item.price || 0
                );

                return (
                  <Link
                    key={item._id || item.id}
                    to={getProductPath(item)}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4"
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-stone-50 p-3">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Package size={48} className="text-gray-300" />
                      )}
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-green-800">
                      {name}
                    </h3>

                    <p className="mt-2 font-bold text-green-900">
                      Rs. {itemPrice.toLocaleString("en-PK")}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetails;
