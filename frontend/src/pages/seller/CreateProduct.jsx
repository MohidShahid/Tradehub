import { useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/static/data";
import {
  SelectGroup,
  SelectContent,
  SelectTrigger,
  Select,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductImageUpload from "@/components/shop/ProductImageUpload";
import ProductVariationsSection from "@/components/shop/ProductVariationsSection";
import { Spinner } from "@/components/ui/spinner";
import { createProduct } from "@/services/productService";
import { toast } from "../../components/ui/toast";
import {
  serializeOptionsForSubmit,
  serializeVariantsForSubmit,
  validateProductForm,
} from "@/utils/productVariants";

const INITIAL_PRODUCT = {
  name: "",
  description: "",
  regularPrice: "",
  salePrice: "",
  stock: "",
  sku: "",
  category: "",
};

const CreateProduct = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});
  const [variantErrors, setVariantErrors] = useState({});

  const formId = useId();
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const regularPriceRef = useRef(null);
  const salePriceRef = useRef(null);
  const stockRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (value) => {
    setProduct((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleImagesChange = (updater) => {
    setImages((prev) => {
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

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validation = validateProductForm(
      {
        ...product,
        hasVariants,
        options,
        variants,
      },
      { imageCount: images.length },
    );

    setErrors(validation.errors);
    setVariantErrors(validation.variantErrors);

    if (!validation.isValid) {
      if (validation.errors.name) nameRef.current?.focus();
      else if (validation.errors.description) descriptionRef.current?.focus();
      else if (validation.errors.regularPrice) regularPriceRef.current?.focus();
      else if (validation.errors.salePrice) salePriceRef.current?.focus();
      else if (validation.errors.stock) stockRef.current?.focus();

      const firstMsg =
        Object.values(validation.errors).find(Boolean) ||
        "Please fix the highlighted fields";
      toast.add({ type: "error", description: firstMsg });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", product.name.trim());
      formData.append("description", product.description.trim());
      formData.append("category", product.category);
      formData.append("hasVariants", String(hasVariants));

      if (product.sku.trim()) {
        formData.append("sku", product.sku.trim());
      }

      if (hasVariants) {
        formData.append(
          "options",
          JSON.stringify(serializeOptionsForSubmit(options)),
        );
        formData.append(
          "variants",
          JSON.stringify(serializeVariantsForSubmit(variants)),
        );
      } else {
        formData.append("regularPrice", product.regularPrice);
        if (product.salePrice !== "") {
          formData.append("salePrice", product.salePrice);
        }
        formData.append("stock", product.stock);
      }

      images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      const response = await createProduct(formData);
      toast.add({
        type: "success",
        description: response?.data?.message || "Product Created Successfully",
      });

      setProduct(INITIAL_PRODUCT);
      setImages([]);
      setHasVariants(false);
      setOptions([]);
      setVariants([]);
      setErrors({});
      setVariantErrors({});
    } catch (error) {
      console.error("Create product error:", error.response || error);
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Product Create failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-5 sm:px-8 md:w-[80%] lg:w-[75%]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <h1 className="pt-5 text-3xl font-bold">
          Create <span className="text-(--color-accent-hover)">Product</span>
        </h1>
        <p className="text-muted-foreground">
          Add a product to your shop and configure pricing, stock, or variations
          for customers online
        </p>
      </div>

      <form
        onSubmit={handleCreateProduct}
        noValidate
        className="flex flex-col gap-6 pt-7"
      >
        <Field>
          <FieldLabel htmlFor={`${formId}-name`}>
            Product name<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            ref={nameRef}
            id={`${formId}-name`}
            type="text"
            name="name"
            placeholder="Enter the product name"
            className="p-5"
            value={product.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-description`}>
            Product description<span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            ref={descriptionRef}
            id={`${formId}-description`}
            name="description"
            placeholder="Enter the product description"
            className="h-32 p-4"
            value={product.description}
            onChange={handleChange}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? `${formId}-description-error` : undefined
            }
          />
          {errors.description && (
            <p
              id={`${formId}-description-error`}
              className="text-xs text-destructive"
            >
              {errors.description}
            </p>
          )}
        </Field>

        {!hasVariants && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor={`${formId}-regularPrice`}>
                Regular price (Rs.)<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                ref={regularPriceRef}
                id={`${formId}-regularPrice`}
                type="number"
                name="regularPrice"
                min="1"
                step="any"
                placeholder="Enter regular price (Rs.)"
                className="p-5"
                value={product.regularPrice}
                onChange={handleChange}
                aria-invalid={Boolean(errors.regularPrice)}
                aria-describedby={
                  errors.regularPrice
                    ? `${formId}-regularPrice-error`
                    : undefined
                }
              />
              {errors.regularPrice && (
                <p
                  id={`${formId}-regularPrice-error`}
                  className="text-xs text-destructive"
                >
                  {errors.regularPrice}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-salePrice`}>
                Sale price (Rs.)
              </FieldLabel>
              <Input
                ref={salePriceRef}
                id={`${formId}-salePrice`}
                type="number"
                name="salePrice"
                min="0"
                step="any"
                placeholder="Optional sale price (Rs.)"
                className="p-5"
                value={product.salePrice}
                onChange={handleChange}
                aria-invalid={Boolean(errors.salePrice)}
                aria-describedby={
                  errors.salePrice ? `${formId}-salePrice-error` : undefined
                }
              />
              {errors.salePrice && (
                <p
                  id={`${formId}-salePrice-error`}
                  className="text-xs text-destructive"
                >
                  {errors.salePrice}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-stock`}>
                Stock<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                ref={stockRef}
                id={`${formId}-stock`}
                type="number"
                name="stock"
                min="0"
                step="1"
                placeholder="Enter the stock"
                className="p-5"
                value={product.stock}
                onChange={handleChange}
                aria-invalid={Boolean(errors.stock)}
                aria-describedby={
                  errors.stock ? `${formId}-stock-error` : undefined
                }
              />
              {errors.stock && (
                <p
                  id={`${formId}-stock-error`}
                  className="text-xs text-destructive"
                >
                  {errors.stock}
                </p>
              )}
            </Field>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-sku`}>SKU (Optional)</FieldLabel>
            <Input
              id={`${formId}-sku`}
              type="text"
              name="sku"
              placeholder="Enter base SKU"
              className="h-12 w-full"
              value={product.sku}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-category`}>
              Category<span className="text-destructive">*</span>
            </FieldLabel>

            <Select
              items={categories}
              value={product.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                id={`${formId}-category`}
                className="h-12 w-full justify-between"
                aria-invalid={Boolean(errors.category)}
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories.map((item) => (
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
          </Field>
        </div>

        <div>
          <ProductImageUpload images={images} setImages={handleImagesChange} />
          {errors.images && (
            <p className="mt-1.5 text-xs text-destructive">{errors.images}</p>
          )}
        </div>

        <ProductVariationsSection
          hasVariants={hasVariants}
          onToggleVariants={setHasVariants}
          options={options}
          setOptions={setOptions}
          variants={variants}
          setVariants={setVariants}
          defaultPricing={{
            regularPrice: product.regularPrice,
            salePrice: product.salePrice,
            stock: product.stock || "0",
          }}
          productName={product.name}
          baseSku={product.sku}
          newImages={images}
          error={errors.variations}
          variantErrors={variantErrors}
          onClearVariationError={clearVariationError}
        />

        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-(--color-accent) h-12 text-base font-semibold rounded-xl sm:w-1/2 gap-2"
          >
            {!loading ? (
              <>
                <PlusCircle className="size-6" /> Add Product
              </>
            ) : (
              <>
                <Spinner /> Adding Product...
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
