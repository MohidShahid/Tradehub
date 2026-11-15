/**
 * Returns the canonical string identifier for a product object or ID primitive.
 */
export const getProductId = (item) => {
  if (!item) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  const baseId = String(item._id || item.id || "");
  if (item.selectedVariant?._id) {
    return `${baseId}_${item.selectedVariant._id}`;
  }
  return baseId;
};

/**
 * Returns the primary display image source for a product.
 */
export const getProductImage = (product) =>
  product?.featuredImage ||
  product?.image ||
  (Array.isArray(product?.images) && product.images[0]) ||
  "/placeholder.png";

/**
 * Resolves selling price, original price, and discount percentage across
 * both static catalog items and MongoDB product documents.
 */
export const getProductPricing = (product) => {
  const currentPrice =
    product?.salePrice != null &&
    product.salePrice > 0 &&
    product.salePrice < (product.regularPrice || Infinity)
      ? Number(product.salePrice)
      : Number(product?.price ?? product?.regularPrice ?? 0);

  const originalPrice =
    product?.regularPrice != null && product.regularPrice > currentPrice
      ? Number(product.regularPrice)
      : product?.oldPrice && product.oldPrice > currentPrice
        ? Number(product.oldPrice)
        : null;

  const discountPercent =
    originalPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : Number(product?.discount || 0);

  return { currentPrice, originalPrice, discountPercent };
};

/**
 * Builds the product detail route path for a given product.
 */
export const getProductPath = (product) => {
  const productId = getProductId(product);
  const slug = encodeURIComponent(
    String(product?.slug || product?.name || "product")
      .toLowerCase()
      .replace(/\s+/g, "-")
  );
  return `/${slug}/${productId}`;
};

/**
 * Formats an amount in PKR currency notation.
 */
export const formatPricePKR = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;

