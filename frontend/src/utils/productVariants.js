export const buildCombinationKey = (attributes = {}) =>
  Object.entries(attributes)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(
      ([key, value]) =>
        `${String(key).trim().toLowerCase()}=${String(value).trim().toLowerCase()}`
    )
    .join("|");

export const generateVariantCombinations = (
  options = [],
  existingVariants = [],
  defaults = {}
) => {
  const validOptions = options
    .map((opt) => ({
      name: String(opt?.name || "").trim(),
      values: Array.isArray(opt?.values)
        ? opt.values.map((v) => String(v).trim()).filter(Boolean)
        : [],
    }))
    .filter((opt) => opt.name && opt.values.length > 0);

  if (validOptions.length === 0) return [];

  const existingMap = new Map();
  existingVariants.forEach((variant) => {
    const key = buildCombinationKey(variant?.attributes);
    if (key) {
      existingMap.set(key, variant);
    }
  });

  const combinations = validOptions.reduce((acc, option) => {
    if (acc.length === 0) {
      return option.values.map((val) => ({ [option.name]: val }));
    }
    const next = [];
    acc.forEach((combo) => {
      option.values.forEach((val) => {
        next.push({ ...combo, [option.name]: val });
      });
    });
    return next;
  }, []);

  return combinations.map((attributes) => {
    const existing = existingMap.get(buildCombinationKey(attributes));
    if (existing) {
      return {
        ...existing,
        attributes,
      };
    }

    return {
      attributes,
      sku: "",
      regularPrice: defaults.regularPrice || "",
      salePrice: defaults.salePrice || "",
      stock: defaults.stock ?? "0",
      image: "",
      isActive: true,
    };
  });
};

export const normalizeInitialOptions = (product) => {
  if (!Array.isArray(product?.options)) return [];
  return product.options.map((opt, idx) => ({
    id: `opt-${idx}-${opt?.name || "option"}`,
    name: opt?.name || "",
    values: Array.isArray(opt?.values) ? [...opt.values] : [],
    pendingValue: "",
  }));
};

export const normalizeInitialVariants = (product) => {
  if (!Array.isArray(product?.variants)) return [];
  return product.variants.map((variant) => ({
    _id: variant?._id,
    attributes:
      variant?.attributes && typeof variant.attributes === "object"
        ? { ...variant.attributes }
        : {},
    sku: variant?.sku || "",
    regularPrice:
      variant?.regularPrice != null ? String(variant.regularPrice) : "",
    salePrice: variant?.salePrice != null ? String(variant.salePrice) : "",
    stock: variant?.stock != null ? String(variant.stock) : "0",
    image: variant?.image || "",
    isActive: variant?.isActive !== false,
  }));
};

export const buildVariantSummary = (variants = []) => {
  const active = variants.filter((v) => v.isActive !== false);
  const totalStock = active.reduce((sum, v) => {
    const num = Number(v.stock);
    return sum + (Number.isFinite(num) && num > 0 ? Math.floor(num) : 0);
  }, 0);

  let minPrice = null;
  active.forEach((v) => {
    const reg = Number(v.regularPrice);
    const sale = v.salePrice !== "" && v.salePrice != null ? Number(v.salePrice) : null;
    const effective =
      sale !== null && Number.isFinite(sale) && sale > 0 && sale < reg ? sale : reg;
    if (Number.isFinite(effective) && effective > 0) {
      minPrice = minPrice === null ? effective : Math.min(minPrice, effective);
    }
  });

  return {
    activeCount: active.length,
    totalCount: variants.length,
    totalStock,
    minPrice,
  };
};

export const serializeOptionsForSubmit = (options = []) =>
  options
    .map((opt) => ({
      name: String(opt.name || "").trim(),
      values: (opt.values || []).map((v) => String(v).trim()).filter(Boolean),
    }))
    .filter((opt) => opt.name && opt.values.length > 0);

export const serializeVariantsForSubmit = (variants = []) =>
  variants.map((variant) => {
    const payload = {
      attributes: variant.attributes,
      sku: String(variant.sku || "").trim(),
      regularPrice: Number(variant.regularPrice),
      salePrice:
        variant.salePrice === "" || variant.salePrice == null
          ? null
          : Number(variant.salePrice),
      stock: Math.floor(Number(variant.stock || 0)),
      image: variant.image || "",
      isActive: variant.isActive !== false,
    };
    if (variant._id) {
      payload._id = variant._id;
    }
    return payload;
  });

const checkPriceAndStock = (regularPrice, salePrice, stock) => {
  const rowErrors = {};
  const reg = Number(regularPrice);

  if (regularPrice === "" || regularPrice == null || !Number.isFinite(reg) || reg <= 0) {
    rowErrors.regularPrice = "Enter a valid regular price greater than 0";
  }

  if (salePrice !== "" && salePrice != null) {
    const sale = Number(salePrice);
    if (!Number.isFinite(sale) || sale < 0) {
      rowErrors.salePrice = "Sale price cannot be negative";
    } else if (Number.isFinite(reg) && reg > 0 && sale > reg) {
      rowErrors.salePrice = "Sale price cannot exceed regular price";
    }
  }

  const stockNum = Number(stock);
  if (
    stock === "" ||
    stock == null ||
    !Number.isFinite(stockNum) ||
    stockNum < 0 ||
    !Number.isInteger(stockNum)
  ) {
    rowErrors.stock = "Enter a valid whole stock quantity (0 or more)";
  }

  return rowErrors;
};

export const validateProductForm = (values, { imageCount = 0 } = {}) => {
  const errors = {};
  const variantErrors = {};

  if (!String(values?.name || "").trim()) {
    errors.name = "Product name is required";
  }
  if (!String(values?.description || "").trim()) {
    errors.description = "Product description is required";
  }
  if (!String(values?.category || "").trim()) {
    errors.category = "Select a category";
  }
  if (imageCount === 0) {
    errors.images = "Please upload or keep at least one product image";
  }

  if (!values?.hasVariants) {
    Object.assign(
      errors,
      checkPriceAndStock(values?.regularPrice, values?.salePrice, values?.stock)
    );
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      variantErrors,
    };
  }

  const cleanOptions = serializeOptionsForSubmit(values?.options);
  if (cleanOptions.length === 0) {
    errors.variations = "Add at least one option (e.g., Color or Size) with values";
  } else {
    const seen = new Set();
    for (const opt of cleanOptions) {
      const key = opt.name.toLowerCase();
      if (seen.has(key)) {
        errors.variations = `Duplicate option name "${opt.name}"`;
        break;
      }
      seen.add(key);
    }
  }

  const variantsList = Array.isArray(values?.variants) ? values.variants : [];
  if (!errors.variations && variantsList.length === 0) {
    errors.variations = "Add option values to generate product variations";
  } else if (
    !errors.variations &&
    !variantsList.some((v) => v.isActive !== false)
  ) {
    errors.variations = "Keep at least one variation active";
  }

  variantsList.forEach((row, idx) => {
    const rowErr = checkPriceAndStock(row.regularPrice, row.salePrice, row.stock);
    const firstMsg = rowErr.regularPrice || rowErr.salePrice || rowErr.stock;
    if (firstMsg) {
      const key = buildCombinationKey(row.attributes) || String(idx);
      variantErrors[key] = firstMsg;
      if (!errors.variations) {
        errors.variations = "Fix the highlighted variation rows below";
      }
    }
  });

  return {
    isValid:
      Object.keys(errors).length === 0 &&
      Object.keys(variantErrors).length === 0,
    errors,
    variantErrors,
  };
};

