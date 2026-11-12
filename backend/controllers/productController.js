const crypto = require("crypto");
const slugify = require("slugify");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");

const findSellerShop = async (userId) => {
  return Shop.findOne({ owner: userId });
};

const generateUniqueSlug = async (name, customSlug, excludeProductId = null) => {
  const baseSource = customSlug || name || "product";
  const baseSlug =
    slugify(String(baseSource), { lower: true, strict: true, trim: true }) ||
    "product";

  let candidate = baseSlug;
  const conflictQuery = (slugValue) =>
    excludeProductId
      ? { slug: slugValue, _id: { $ne: excludeProductId } }
      : { slug: slugValue };

  if (!(await Product.exists(conflictQuery(candidate)))) {
    return candidate;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = crypto.randomBytes(2).toString("hex");
    candidate = `${baseSlug}-${suffix}`;
    if (!(await Product.exists(conflictQuery(candidate)))) {
      return candidate;
    }
  }

  return `${baseSlug}-${Date.now()}`;
};

const resolveVariants = (variants, validUrls, uploadedUrls) => {
  const validSet = new Set(validUrls);

  return variants.map((variant) => {
    let image = variant.image || "";

    if (image.startsWith("__new__:")) {
      const idx = Number(image.slice("__new__:".length));
      image = Number.isInteger(idx) && uploadedUrls[idx] ? uploadedUrls[idx] : "";
    } else if (image && !validSet.has(image)) {
      image = "";
    }

    const mapped = {
      attributes: variant.attributes,
      sku: variant.sku || "",
      regularPrice: variant.regularPrice,
      salePrice: variant.salePrice ?? null,
      stock: variant.stock,
      image,
      isActive: variant.isActive !== false,
    };

    if (variant._id) {
      mapped._id = variant._id;
    }

    return mapped;
  });
};

const summarizeVariants = (variants) => {
  const activeVariants = variants.filter((v) => v.isActive !== false);
  const pool = activeVariants.length > 0 ? activeVariants : variants;

  const totalStock = activeVariants.reduce(
    (sum, v) => sum + Number(v.stock || 0),
    0
  );

  let lowestVariant = pool[0];
  let lowestEffective = Infinity;

  for (const variant of pool) {
    const hasSale =
      variant.salePrice !== null &&
      variant.salePrice !== undefined &&
      variant.salePrice > 0 &&
      variant.salePrice < variant.regularPrice;
    const effective = hasSale ? variant.salePrice : variant.regularPrice;

    if (effective < lowestEffective) {
      lowestEffective = effective;
      lowestVariant = variant;
    }
  }

  return {
    regularPrice: lowestVariant ? lowestVariant.regularPrice : 0,
    salePrice: lowestVariant ? (lowestVariant.salePrice ?? null) : null,
    stock: totalStock,
  };
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      regularPrice,
      salePrice,
      stock,
      sku,
      category,
      slug,
      status,
      hasVariants,
      options,
      variants,
    } = req.body;

    const shop = await findSellerShop(req.user.userId);
    if (!shop) {
      return next(
        new ErrorHandler("Shop not found associated with user account", 404)
      );
    }

    const files = req.files || [];
    if (files.length === 0) {
      return next(new ErrorHandler("At least one product image is required", 400));
    }

    const uploadResults = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer))
    );
    const urls = uploadResults.map((result) => result.secure_url);

    const uniqueSlug = await generateUniqueSlug(name, slug);

    const resolvedVariants = hasVariants
      ? resolveVariants(variants, urls, urls)
      : [];
    const pricingSummary = hasVariants
      ? summarizeVariants(resolvedVariants)
      : {
          regularPrice,
          salePrice: salePrice ?? null,
          stock,
        };

    const product = new Product({
      name,
      slug: uniqueSlug,
      images: urls,
      featuredImage: urls[0] || "",
      description,
      regularPrice: pricingSummary.regularPrice,
      salePrice: pricingSummary.salePrice,
      stock: pricingSummary.stock,
      category,
      sku: sku || "",
      shopId: shop._id,
      status: status || "active",
      hasVariants,
      options: hasVariants ? options : [],
      variants: resolvedVariants,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const getShopProducts = async (req, res, next) => {
  try {
    const shop = await findSellerShop(req.user.userId);
    if (!shop) {
      return next(new ErrorHandler("Shop not found", 401));
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find({ shopId: shop._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ shopId: shop._id }),
    ]);

    return res.json({
      success: true,
      data: products,
      pagination: {
        totalProducts,
        totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("getShopProducts error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ success: true, data: products });
  } catch (error) {
    console.error("getProducts error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const shop = await findSellerShop(req.user.userId);
    if (!shop) {
      return next(
        new ErrorHandler("Shop not found associated with user account", 404)
      );
    }

    const existingProduct = await Product.findOne({
      _id: productId,
      shopId: shop._id,
    });

    if (!existingProduct) {
      return next(
        new ErrorHandler(
          "Product not found or you are not authorized to update it",
          404
        )
      );
    }

    const {
      name,
      description,
      regularPrice,
      salePrice,
      stock,
      sku,
      category,
      status,
      slug,
      hasVariants,
      options,
      variants,
      existingImages,
    } = req.body;

    if (name !== undefined) existingProduct.name = name;
    if (description !== undefined) existingProduct.description = description;
    if (category !== undefined) existingProduct.category = category;
    if (sku !== undefined) existingProduct.sku = sku;
    if (status !== undefined) existingProduct.status = status;

    if (slug !== undefined) {
      existingProduct.slug = await generateUniqueSlug(
        existingProduct.name,
        slug,
        existingProduct._id
      );
    }

    const files = req.files || [];
    let uploadedUrls = [];
    let finalImages = [...(existingProduct.images || [])];

    if (existingImages !== undefined || files.length > 0) {
      const allowedExisting = new Set(existingProduct.images || []);
      const keptImages =
        existingImages !== undefined
          ? existingImages.filter((url) => allowedExisting.has(url))
          : [...(existingProduct.images || [])];

      const uploadResults = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer))
      );
      uploadedUrls = uploadResults.map((result) => result.secure_url);
      finalImages = [...keptImages, ...uploadedUrls];

      if (finalImages.length === 0) {
        return next(
          new ErrorHandler("At least one product image is required", 400)
        );
      }

      const removedImages = (existingProduct.images || []).filter(
        (url) => !finalImages.includes(url)
      );

      existingProduct.images = finalImages;
      existingProduct.featuredImage = finalImages[0] || "";

      if (removedImages.length > 0) {
        await Promise.allSettled(
          removedImages.map((url) => deleteFromCloudinary(url))
        );
      }
    }

    const nextHasVariants =
      hasVariants !== undefined ? hasVariants : Boolean(existingProduct.hasVariants);

    if (nextHasVariants) {
      const nextOptions =
        options !== undefined ? options : existingProduct.options || [];
      const nextVariants =
        variants !== undefined ? variants : existingProduct.variants || [];

      const resolvedVariants = resolveVariants(
        nextVariants,
        finalImages,
        uploadedUrls
      );
      const summary = summarizeVariants(resolvedVariants);

      existingProduct.hasVariants = true;
      existingProduct.options = nextOptions;
      existingProduct.variants = resolvedVariants;
      existingProduct.regularPrice = summary.regularPrice;
      existingProduct.salePrice = summary.salePrice;
      existingProduct.stock = summary.stock;
    } else {
      existingProduct.hasVariants = false;
      existingProduct.options = [];
      existingProduct.variants = [];

      if (regularPrice !== undefined) {
        existingProduct.regularPrice = regularPrice;
      }

      if (salePrice !== undefined) {
        if (
          salePrice !== null &&
          existingProduct.regularPrice != null &&
          salePrice > existingProduct.regularPrice
        ) {
          return next(
            new ErrorHandler("Sale price cannot exceed regular price", 400)
          );
        }
        existingProduct.salePrice = salePrice;
      }

      if (stock !== undefined) {
        existingProduct.stock = stock;
      }
    }

    await existingProduct.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: existingProduct,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shop = await findSellerShop(req.user.userId);
    if (!shop) {
      return next(
        new ErrorHandler("Shop not found associated with user account", 404)
      );
    }

    const product = await Product.findOneAndDelete({
      _id: id,
      shopId: shop._id,
    });

    if (!product) {
      return next(
        new ErrorHandler(
          "Product not found or you are not authorized to delete it",
          404
        )
      );
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      await Promise.allSettled(
        product.images.map((url) => deleteFromCloudinary(url))
      );
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
      data: { _id: product._id },
    });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

module.exports = {
  createProduct,
  getShopProducts,
  getProducts,
  updateProduct,
  deleteProduct,
};
