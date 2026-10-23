
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
} from "lucide-react";
import { products } from "@/static/data";

const ProductDetails = () => {
  const { slug, id } = useParams();

  const product = products.find((p) => String(p.id) === String(id));

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Package size={56} className="mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-800">
          Product not found
        </h1>
        <p className="mt-2 text-gray-500">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Adjust these field names to match your static data.
  const productName = product.name || product.title || slug;
  const productImage = product.image || product.images?.[0] || "";
  const images =
    product.images?.length > 0
      ? product.images
      : productImage
        ? [productImage]
        : [];

  const price = Number(product.price) || 0;
  const originalPrice = Number(
    product.originalPrice || product.oldPrice || 0,
  );
  const stock = Number(product.stock ?? product.quantity ?? 10);
  const description =
    product.description || "No description is available for this product.";
  const category = product.category || "General";
  const rating = Number(product.rating) || 4.5;
  const reviews = Number(product.reviewsCount ?? product.reviewCount ?? 0);
  const sellerName = product.sellerName || product.seller || "TradeHub Seller";

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const relatedProducts = products
    .filter(
      (p) =>
        String(p.id) !== String(product.id) &&
        p.category === product.category,
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    // Connect your Redux addItemsCart action here.
    // Example: dispatch(addItemsCart({ ...product, quantity }))
    setAddedToCart(true);
  };

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
          <span className="font-medium text-green-900">{productName}</span>
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

        {/* Main product section */}
        <section className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
          {/* Product images */}
          <div>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-stone-50 p-6 sm:p-10">
              {discount > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-bold text-white">
                  -{discount}% OFF
                </span>
              )}

              <button
                type="button"
                aria-label="Add to wishlist"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
              >
                <Heart
                  size={20}
                  className={
                    isWishlisted
                      ? "fill-orange-500 text-orange-500"
                      : "text-gray-600"
                  }
                />
              </button>

              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
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
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border-2 bg-stone-50 p-2 transition ${
                      selectedImage === index
                        ? "border-green-800"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} view ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                {category}
              </span>

              {stock > 0 ? (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                  <Check size={14} />
                  In stock
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600">
                  Out of stock
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {productName}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                <Star size={15} className="fill-orange-500 text-orange-500" />
                {rating.toFixed(1)}
              </div>
              <span className="text-gray-500">
                {reviews} {reviews === 1 ? "review" : "reviews"}
              </span>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("product-reviews")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="font-medium text-green-800 hover:underline"
              >
                View reviews
              </button>
            </div>

            <div className="my-6 border-t border-gray-100" />

            {/* Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-green-900 sm:text-4xl">
                  Rs. {price.toLocaleString("en-PK")}
                </span>

                {originalPrice > price && (
                  <span className="text-lg text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString("en-PK")}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  You save Rs.{" "}
                  {(originalPrice - price).toLocaleString("en-PK")} (
                  {discount}% off)
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Price includes any applicable product discounts.
              </p>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base">
              {description}
            </p>

            {/* Seller */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-stone-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800">
                <Store size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Sold by</p>
                <p className="truncate font-semibold text-gray-900">
                  {sellerName}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-green-700">
                  <ShieldCheck size={13} />
                  TradeHub marketplace seller
                </p>
              </div>

              <button
                type="button"
                aria-label="Share product"
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
                className="rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-green-800"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold text-gray-800">
                Quantity
              </label>

              <div className="flex items-center gap-4">
                <div className="flex h-12 items-center rounded-lg border border-gray-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-full w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-10 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock}
                    onClick={() =>
                      setQuantity((q) => Math.min(stock, q + 1))
                    }
                    className="flex h-full w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {stock > 0 && stock <= 5 && (
                  <span className="text-sm font-medium text-orange-600">
                    Only {stock} left
                  </span>
                )}
              </div>
            </div>

            {/* Purchase buttons */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <ShoppingCart size={19} />
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </button>

              <Link
                to="/cart"
                className="flex min-h-12 items-center justify-center rounded-lg border border-green-800 px-5 py-3 font-semibold text-green-900 transition hover:bg-green-50"
              >
                View Cart
              </Link>
            </div>

            {addedToCart && (
              <p className="mt-3 text-sm font-medium text-green-700">
                UI preview: connect your Redux cart action to save this item.
              </p>
            )}

            {/* Service benefits */}
            <div className="mt-7 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck size={21} className="shrink-0 text-green-800" />
                <div>
                  <p className="text-sm font-semibold">Delivery</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Delivery options at checkout
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={21}
                  className="shrink-0 text-green-800"
                />
                <div>
                  <p className="text-sm font-semibold">Secure shopping</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Shop with confidence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw size={21} className="shrink-0 text-green-800" />
                <div>
                  <p className="text-sm font-semibold">Returns</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Check seller's return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product information tabs */}
        <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-6 border-b border-gray-100">
            {[
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["reviews", `Reviews (${reviews})`],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`border-b-2 pb-4 text-sm font-semibold transition ${
                  activeTab === key
                    ? "border-green-800 text-green-900"
                    : "border-transparent text-gray-500 hover:text-green-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            id="product-reviews"
            className="pt-6 text-sm leading-7 text-gray-600"
          >
            {activeTab === "description" && (
              <>
                <h2 className="mb-3 text-lg font-bold text-gray-900">
                  Product Description
                </h2>
                <p>{description}</p>
                <p className="mt-3">
                  Explore quality products from independent sellers on
                  TradeHub. Check the product information and seller policies
                  before placing your order.
                </p>
              </>
            )}

            {activeTab === "specifications" && (
              <>
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Product Specifications
                </h2>
                <dl className="divide-y divide-gray-100">
                  {[
                    ["Product", productName],
                    ["Category", category],
                    ["Seller", sellerName],
                    ["Availability", stock > 0 ? "In stock" : "Out of stock"],
                    ["Product ID", String(product.id)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-2 gap-4 py-3"
                    >
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
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-3">
                  <Star className="fill-orange-500 text-orange-500" size={25} />
                  <span className="text-xl font-bold text-gray-900">
                    {rating.toFixed(1)} / 5
                  </span>
                </div>
                <p className="mt-3">
                  {reviews > 0
                    ? `This product has ${reviews} review${reviews === 1 ? "" : "s"}.`
                    : "There are no customer reviews yet. Be the first to review this product after purchasing it."}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Related products */}
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
                const image = item.image || item.images?.[0];
                const name = item.name || item.title || "Product";

                return (
                  <Link
                    key={item.id}
                    to={`/products/${encodeURIComponent(
                      String(name).toLowerCase().replace(/\s+/g, "-"),
                    )}/${item.id}`}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4"
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
                      Rs. {Number(item.price || 0).toLocaleString("en-PK")}
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
