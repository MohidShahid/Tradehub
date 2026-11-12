const mongoose = require("mongoose");
const { z } = require("zod");
const ErrorHandler = require("../utils/ErrorHandler");

const PRODUCT_STATUSES = [
  "draft",
  "pending",
  "active",
  "rejected",
  "inactive",
  "archived",
];

const optionSchema = z.object({
  name: z.string().trim().min(1, "Option name is required").max(50),
  values: z
    .array(z.string().trim().min(1, "Option value cannot be empty").max(60))
    .min(1, "Each option must have at least one value"),
});

const variantSchema = z.object({
  _id: z.string().trim().optional(),
  attributes: z.record(z.string().trim().min(1), z.string().trim().min(1)),
  sku: z.string().trim().max(80).optional().default(""),
  regularPrice: z.coerce
    .number({ error: "Variant regular price must be a number" })
    .positive("Variant regular price must be greater than 0"),
  salePrice: z.coerce
    .number({ error: "Variant sale price must be a number" })
    .min(0, "Variant sale price cannot be negative")
    .nullable()
    .optional()
    .default(null),
  stock: z.coerce
    .number({ error: "Variant stock must be a number" })
    .int("Variant stock must be a whole number")
    .min(0, "Variant stock cannot be negative"),
  image: z.string().trim().optional().default(""),
  isActive: z.boolean().optional().default(true),
});

const baseFields = {
  name: z.string().trim().min(1, "Product name is required").max(200),
  description: z.string().trim().min(1, "Product description is required"),
  category: z.string().trim().min(1, "Category is required"),
  slug: z.string().trim().optional(),
  sku: z.string().trim().max(80).optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  hasVariants: z.boolean().optional(),
  regularPrice: z.coerce
    .number({ error: "Regular price must be a number" })
    .positive("Regular price must be greater than 0")
    .optional(),
  salePrice: z.coerce
    .number({ error: "Sale price must be a number" })
    .min(0, "Sale price cannot be negative")
    .nullable()
    .optional(),
  stock: z.coerce
    .number({ error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .optional(),
  options: z.array(optionSchema).max(3, "Max 3 options allowed").optional(),
  variants: z.array(variantSchema).optional(),
};

const createSchema = z.object({
  ...baseFields,
  sku: baseFields.sku.default(""),
  status: baseFields.status.default("active"),
  hasVariants: baseFields.hasVariants.default(false),
  salePrice: baseFields.salePrice.default(null),
  options: baseFields.options.default([]),
  variants: baseFields.variants.default([]),
});

const updateSchema = z
  .object(baseFields)
  .partial()
  .extend({
    existingImages: z.array(z.string()).optional(),
  });

const parseJsonField = (value, label) => {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }
};

const normalizeBody = (raw = {}) => {
  const body = { ...raw };

  if (body.hasVariants !== undefined) {
    body.hasVariants =
      body.hasVariants === true || body.hasVariants === "true";
  }

  if (body.salePrice === "" || body.salePrice === "null") {
    body.salePrice = null;
  }

  if (body.regularPrice === "") delete body.regularPrice;
  if (body.stock === "") delete body.stock;

  if (body.options !== undefined) {
    body.options = parseJsonField(body.options, "options");
  }

  if (body.variants !== undefined) {
    const parsed = parseJsonField(body.variants, "variants");
    body.variants = Array.isArray(parsed)
      ? parsed.map((v) => ({
          ...v,
          salePrice:
            v?.salePrice === "" || v?.salePrice === "null" ? null : v?.salePrice,
          isActive:
            v?.isActive === undefined
              ? true
              : v.isActive === true || v.isActive === "true",
        }))
      : parsed;
  }

  if (body.existingImages !== undefined) {
    body.existingImages = parseJsonField(body.existingImages, "existingImages");
  }

  return body;
};

const checkVariantRules = (data) => {
  if (!data.hasVariants) {
    if (
      data.regularPrice != null &&
      data.salePrice != null &&
      data.salePrice > data.regularPrice
    ) {
      return "Sale price cannot exceed regular price";
    }
    return null;
  }

  if (!data.options?.length) {
    return "Add at least one variation option";
  }
  if (!data.variants?.length) {
    return "Add at least one variation combination";
  }

  const hasActiveVariant = data.variants.some((v) => v.isActive !== false);
  if (!hasActiveVariant) {
    return "At least one variation must be active";
  }

  for (let i = 0; i < data.variants.length; i += 1) {
    const v = data.variants[i];
    if (v.salePrice != null && v.salePrice > v.regularPrice) {
      return `Variant #${i + 1} sale price cannot exceed regular price`;
    }
  }

  return null;
};

const validateProductId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Valid product ID is required", 400));
  }
  return next();
};

const validateCreateProduct = (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      return next(
        new ErrorHandler(parsed.error.issues[0]?.message || "Invalid data", 400)
      );
    }

    const data = parsed.data;
    if (!data.hasVariants) {
      if (data.regularPrice === undefined) {
        return next(new ErrorHandler("Regular price is required", 400));
      }
      if (data.stock === undefined) {
        return next(new ErrorHandler("Stock is required", 400));
      }
    }

    const ruleError = checkVariantRules(data);
    if (ruleError) {
      return next(new ErrorHandler(ruleError, 400));
    }

    req.body = data;
    return next();
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
};

const validateUpdateProduct = (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      return next(
        new ErrorHandler(parsed.error.issues[0]?.message || "Invalid data", 400)
      );
    }

    const data = parsed.data;
    if (data.hasVariants === false) {
      if (data.regularPrice === undefined) {
        return next(new ErrorHandler("Regular price is required", 400));
      }
      if (data.stock === undefined) {
        return next(new ErrorHandler("Stock is required", 400));
      }
    }

    if (
      data.hasVariants === true ||
      data.options !== undefined ||
      data.variants !== undefined
    ) {
      const ruleError = checkVariantRules({ ...data, hasVariants: true });
      if (ruleError) {
        return next(new ErrorHandler(ruleError, 400));
      }
    } else {
      const ruleError = checkVariantRules({ ...data, hasVariants: false });
      if (ruleError) {
        return next(new ErrorHandler(ruleError, 400));
      }
    }

    req.body = data;
    return next();
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
};

module.exports = {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
};
