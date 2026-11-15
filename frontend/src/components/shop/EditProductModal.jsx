import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Pencil, X, LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductImageUpload from "@/components/shop/ProductImageUpload";
import ProductVariationsSection from "@/components/shop/ProductVariationsSection";
import { categories } from "@/static/data";
import {
  normalizeInitialOptions,
  normalizeInitialVariants,
  serializeOptionsForSubmit,
  serializeVariantsForSubmit,
  validateProductForm,
} from "@/utils/productVariants";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const buildFormState = (product) => ({
  name: product?.name || "",
  description: product?.description || "",
  regularPrice:
    product?.regularPrice != null ? String(product.regularPrice) : "",
  salePrice: product?.salePrice != null ? String(product.salePrice) : "",
  stock: product?.stock != null ? String(product.stock) : "0",
  sku: product?.sku || "",
  category: product?.category || "",
  status: product?.status || "active",
});

const getInitialImageUrls = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images;
  }
  return product?.featuredImage ? [product.featuredImage] : [];
};

const revokePreviews = (items) => {
  items.forEach((img) => {
    if (img?.preview) URL.revokeObjectURL(img.preview);
  });
};

const EditProductModal = ({
  open,
  product,
  onOpenChange,
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState(() => buildFormState(product));
  const [existingImages, setExistingImages] = useState(() =>
    getInitialImageUrls(product)
  );
  const [newImages, setNewImages] = useState([]);
  const [hasVariants, setHasVariants] = useState(() =>
    Boolean(
      product?.hasVariants ||
        (Array.isArray(product?.variants) && product.variants.length > 0)
    )
  );
  const [options, setOptions] = useState(() =>
    normalizeInitialOptions(product)
  );
  const [variants, setVariants] = useState(() =>
    normalizeInitialVariants(product)
  );
  const [errors, setErrors] = useState({});
  const [variantErrors, setVariantErrors] = useState({});

  const formIdPrefix = useId();
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const regularPriceRef = useRef(null);
  const salePriceRef = useRef(null);
  const stockRef = useRef(null);
  const newImagesRef = useRef(newImages);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      revokePreviews(newImagesRef.current);
    };
  }, []);

  const categoryOptions = useMemo(() => {
    if (
      form.category &&
      !categories.some((item) => item.value === form.category)
    ) {
      return [...categories, { label: form.category, value: form.category }];
    }
    return categories;
  }, [form.category]);

  const statusOptions = useMemo(() => {
    if (
      form.status &&
      !STATUS_OPTIONS.some((item) => item.value === form.status)
    ) {
      return [
        ...STATUS_OPTIONS,
        {
          label: form.status.charAt(0).toUpperCase() + form.status.slice(1),
          value: form.status,
        },
      ];
    }
    return STATUS_OPTIONS;
  }, [form.status]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRemoveExistingImage = (urlToRemove) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
    setVariants((prev) =>
      prev.map((variant) =>
        variant.image === urlToRemove ? { ...variant, image: "" } : variant
      )
    );
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleNewImagesChange = (updater) => {
    setNewImages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next.length > 0 && errors.images) {
        setErrors((errPrev) => ({ ...errPrev, images: "" }));
      }
      return next;
    });
  };

  const clearVariationError = (combKey) => {
    if (errors.variations) {
      setErrors((prev) => ({ ...prev, variations: "" }));
    }
    if (combKey && variantErrors[combKey]) {
      setVariantErrors((prev) => {
        const next = { ...prev };
        delete next[combKey];
        return next;
      });
    } else if (!combKey && Object.keys(variantErrors).length > 0) {
      setVariantErrors({});
    }
  };

  const validate = () => {
    const validation = validateProductForm(
      {
        ...form,
        hasVariants,
        options,
        variants,
      },
      { imageCount: existingImages.length + newImages.length }
    );

    setErrors(validation.errors);
    setVariantErrors(validation.variantErrors);

    if (validation.errors.name) nameRef.current?.focus();
    else if (validation.errors.description) descriptionRef.current?.focus();
    else if (validation.errors.regularPrice) regularPriceRef.current?.focus();
    else if (validation.errors.salePrice) salePriceRef.current?.focus();
    else if (validation.errors.stock) stockRef.current?.focus();

    return validation.isValid;
  };

  const handleClose = (nextOpen) => {
    if (!nextOpen) {
      revokePreviews(newImages);
      setNewImages([]);
      setErrors({});
      setVariantErrors({});
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?._id || loading) return;
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("sku", form.sku.trim());
    formData.append("category", form.category);
    formData.append("status", form.status);
    formData.append("hasVariants", String(hasVariants));
    formData.append("existingImages", JSON.stringify(existingImages));

    if (hasVariants) {
      formData.append(
        "options",
        JSON.stringify(serializeOptionsForSubmit(options))
      );
      formData.append(
        "variants",
        JSON.stringify(serializeVariantsForSubmit(variants))
      );
    } else {
      formData.append("regularPrice", form.regularPrice);
      formData.append("salePrice", form.salePrice);
      formData.append("stock", form.stock);
    }

    newImages.forEach((img) => {
      if (img?.file) {
        formData.append("images", img.file);
      }
    });

    await onSubmit(product._id, formData);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto p-0 sm:max-w-3xl">
        <DialogHeader className="border-b p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5 text-(--color-primary)">
              <Pencil className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold sm:text-xl">
                Edit Product
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                Update product details, variations, pricing, stock, or images.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5 sm:p-6">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor={`${formIdPrefix}-name`}>
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              ref={nameRef}
              id={`${formIdPrefix}-name`}
              name="name"
              type="text"
              value={form.name}
              onChange={handleFieldChange}
              placeholder="Enter product name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? `${formIdPrefix}-name-error` : undefined
              }
              required
            />
            {errors.name && (
              <p
                id={`${formIdPrefix}-name-error`}
                className="text-xs text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor={`${formIdPrefix}-description`}>
              Product Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              ref={descriptionRef}
              id={`${formIdPrefix}-description`}
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              placeholder="Describe key features, materials, and specifications"
              className="min-h-24"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? `${formIdPrefix}-description-error`
                  : undefined
              }
              required
            />
            {errors.description && (
              <p
                id={`${formIdPrefix}-description-error`}
                className="text-xs text-destructive"
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Pricing & Stock (Simple products only) */}
          {!hasVariants && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${formIdPrefix}-regularPrice`}>
                  Regular Price (Rs.) <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={regularPriceRef}
                  id={`${formIdPrefix}-regularPrice`}
                  name="regularPrice"
                  type="number"
                  min="1"
                  step="any"
                  value={form.regularPrice}
                  onChange={handleFieldChange}
                  placeholder="0"
                  aria-invalid={Boolean(errors.regularPrice)}
                  aria-describedby={
                    errors.regularPrice
                      ? `${formIdPrefix}-regularPrice-error`
                      : undefined
                  }
                  required
                />
                {errors.regularPrice && (
                  <p
                    id={`${formIdPrefix}-regularPrice-error`}
                    className="text-xs text-destructive"
                  >
                    {errors.regularPrice}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`${formIdPrefix}-salePrice`}>
                  Sale Price (Rs.)
                </Label>
                <Input
                  ref={salePriceRef}
                  id={`${formIdPrefix}-salePrice`}
                  name="salePrice"
                  type="number"
                  min="0"
                  step="any"
                  value={form.salePrice}
                  onChange={handleFieldChange}
                  placeholder="Optional"
                  aria-invalid={Boolean(errors.salePrice)}
                  aria-describedby={
                    errors.salePrice
                      ? `${formIdPrefix}-salePrice-error`
                      : undefined
                  }
                />
                {errors.salePrice && (
                  <p
                    id={`${formIdPrefix}-salePrice-error`}
                    className="text-xs text-destructive"
                  >
                    {errors.salePrice}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`${formIdPrefix}-stock`}>
                  Stock <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={stockRef}
                  id={`${formIdPrefix}-stock`}
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleFieldChange}
                  placeholder="0"
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={
                    errors.stock ? `${formIdPrefix}-stock-error` : undefined
                  }
                  required
                />
                {errors.stock && (
                  <p
                    id={`${formIdPrefix}-stock-error`}
                    className="text-xs text-destructive"
                  >
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SKU, Category & Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${formIdPrefix}-sku`}>SKU (Optional)</Label>
              <Input
                id={`${formIdPrefix}-sku`}
                name="sku"
                type="text"
                value={form.sku}
                onChange={handleFieldChange}
                placeholder="SKU-001"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`${formIdPrefix}-category`}>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                items={categoryOptions}
                value={form.category}
                onValueChange={(value) => {
                  setForm((prev) => ({ ...prev, category: value }));
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: "" }));
                  }
                }}
              >
                <SelectTrigger
                  id={`${formIdPrefix}-category`}
                  className="h-9 w-full justify-between"
                  aria-invalid={Boolean(errors.category)}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categoryOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`${formIdPrefix}-status`}>Status</Label>
              <Select
                items={statusOptions}
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger
                  id={`${formIdPrefix}-status`}
                  className="h-9 w-full justify-between"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Visibility</SelectLabel>
                    {statusOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Product Images</p>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {existingImages.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
                  >
                    <img
                      src={url}
                      alt={`${form.name || "Product"} image ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      aria-label={`Remove image ${idx + 1}`}
                      className="absolute top-1 right-1 cursor-pointer rounded-full bg-white p-1 text-red-600 shadow hover:bg-red-50"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Replacement / Additional Images */}
          <div>
            <ProductImageUpload
              images={newImages}
              setImages={handleNewImagesChange}
            />
            {errors.images && (
              <p className="mt-1.5 text-xs text-destructive">{errors.images}</p>
            )}
          </div>

          {/* Variations */}
          <ProductVariationsSection
            hasVariants={hasVariants}
            onToggleVariants={setHasVariants}
            options={options}
            setOptions={setOptions}
            variants={variants}
            setVariants={setVariants}
            defaultPricing={{
              regularPrice: form.regularPrice,
              salePrice: form.salePrice,
              stock: form.stock || "0",
            }}
            productName={form.name}
            baseSku={form.sku}
            existingImages={existingImages}
            newImages={newImages}
            error={errors.variations}
            variantErrors={variantErrors}
            onClearVariationError={clearVariationError}
          />

          {/* Footer Actions */}
          <div className="flex flex-col-reverse justify-end gap-2.5 border-t pt-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleClose(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-(--color-primary) text-white hover:bg-(--color-primary-hover)"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
