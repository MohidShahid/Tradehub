import { useId, useMemo, useState } from "react";
import { Layers, Plus, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildCombinationKey,
  buildVariantSummary,
  generateVariantCombinations,
} from "@/utils/productVariants";

const QUICK_OPTION_PRESETS = ["Color", "Size", "Storage"];

const createEmptyOption = (name = "") => ({
  id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name,
  values: [],
  pendingValue: "",
});

const ProductVariationsSection = ({
  hasVariants,
  onToggleVariants,
  options,
  setOptions,
  variants,
  setVariants,
  defaultPricing,
  productName = "",
  baseSku = "",
  existingImages = [],
  newImages = [],
  error,
  variantErrors = {},
  onClearVariationError,
}) => {
  const toggleId = useId();
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkSalePrice, setBulkSalePrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const availableImages = useMemo(
    () => [
      ...existingImages.map((url, idx) => ({
        value: url,
        preview: url,
        label: `Image ${idx + 1}`,
      })),
      ...newImages.map((img, idx) => ({
        value: `__new__:${idx}`,
        preview: img.preview,
        label: `New ${idx + 1}`,
      })),
    ],
    [existingImages, newImages]
  );

  const summary = useMemo(() => buildVariantSummary(variants), [variants]);

  const syncVariantsFromOptions = (nextOptions) => {
    setOptions(nextOptions);
    const nextVariants = generateVariantCombinations(
      nextOptions,
      variants,
      defaultPricing
    );
    setVariants(nextVariants);
    onClearVariationError?.();
  };

  const handleToggleChange = (checked) => {
    const enabled = Boolean(checked);
    onToggleVariants(enabled);
    if (enabled && options.length === 0) {
      setOptions([createEmptyOption("Color")]);
    }
    onClearVariationError?.();
  };

  const handleAddOption = (presetName = "") => {
    if (options.length >= 3) return;
    setOptions((prev) => [...prev, createEmptyOption(presetName)]);
  };

  const handleRemoveOption = (optionId) => {
    const nextOptions = options.filter((opt) => opt.id !== optionId);
    syncVariantsFromOptions(nextOptions);
  };

  const handleOptionNameChange = (optionId, nextName) => {
    const prevOption = options.find((o) => o.id === optionId);
    const prevName = prevOption?.name?.trim();
    const trimmedNext = nextName;

    const nextOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, name: trimmedNext } : opt
    );

    const renamedVariants =
      prevName && trimmedNext.trim() && prevName !== trimmedNext.trim()
        ? variants.map((variant) => {
            const nextAttrs = { ...(variant.attributes || {}) };
            if (Object.prototype.hasOwnProperty.call(nextAttrs, prevName)) {
              nextAttrs[trimmedNext.trim()] = nextAttrs[prevName];
              delete nextAttrs[prevName];
            }
            return { ...variant, attributes: nextAttrs };
          })
        : variants;

    setOptions(nextOptions);
    setVariants(
      generateVariantCombinations(nextOptions, renamedVariants, defaultPricing)
    );
    onClearVariationError?.();
  };

  const handlePendingValueChange = (optionId, value) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId ? { ...opt, pendingValue: value } : opt
      )
    );
  };

  const commitOptionValues = (optionId, rawValue) => {
    const option = options.find((o) => o.id === optionId);
    if (!option) return;

    const parts = String(rawValue ?? option.pendingValue ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (parts.length === 0) return;

    const existingLower = new Set(option.values.map((v) => v.toLowerCase()));
    const mergedValues = [...option.values];

    parts.forEach((val) => {
      if (!existingLower.has(val.toLowerCase())) {
        existingLower.add(val.toLowerCase());
        mergedValues.push(val);
      }
    });

    const nextOptions = options.map((opt) =>
      opt.id === optionId
        ? { ...opt, values: mergedValues, pendingValue: "" }
        : opt
    );
    syncVariantsFromOptions(nextOptions);
  };

  const handleRemoveOptionValue = (optionId, valueToRemove) => {
    const nextOptions = options.map((opt) =>
      opt.id === optionId
        ? {
            ...opt,
            values: opt.values.filter((v) => v !== valueToRemove),
          }
        : opt
    );
    syncVariantsFromOptions(nextOptions);
  };

  const handleVariantFieldChange = (combKey, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        buildCombinationKey(variant.attributes) === combKey
          ? { ...variant, [field]: value }
          : variant
      )
    );
    onClearVariationError?.(combKey);
  };

  const handleBulkApply = () => {
    if (
      bulkPrice === "" &&
      bulkSalePrice === "" &&
      bulkStock === ""
    ) {
      return;
    }

    setVariants((prev) =>
      prev.map((variant) => ({
        ...variant,
        ...(bulkPrice !== "" ? { regularPrice: bulkPrice } : {}),
        ...(bulkSalePrice !== "" ? { salePrice: bulkSalePrice } : {}),
        ...(bulkStock !== "" ? { stock: bulkStock } : {}),
      }))
    );
    onClearVariationError?.();
  };

  const handleAutoGenerateSkus = () => {
    const prefix = (baseSku || productName || "PRD")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 12);

    setVariants((prev) =>
      prev.map((variant) => {
        const suffix = Object.values(variant.attributes || {})
          .map((val) =>
            String(val)
              .toUpperCase()
              .replace(/[^A-Z0-9]+/g, "")
              .slice(0, 4)
          )
          .filter(Boolean)
          .join("-");
        return {
          ...variant,
          sku: `${prefix || "PRD"}-${suffix || "VAR"}`,
        };
      })
    );
  };

  return (
    <section
      aria-label="Product variations"
      className="space-y-4 rounded-xl border bg-muted/20 p-4 sm:p-5"
    >
      {/* Toggle Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Checkbox
            id={toggleId}
            checked={hasVariants}
            onCheckedChange={handleToggleChange}
            className="mt-0.5 cursor-pointer"
          />
          <div>
            <Label
              htmlFor={toggleId}
              className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
            >
              <Layers className="size-4 text-(--color-primary)" aria-hidden="true" />
              This product has variations
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add options like Size, Color, or Storage with separate price,
              stock, and SKU per combination.
            </p>
          </div>
        </div>

        {hasVariants && summary.totalCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary">
              {summary.activeCount}/{summary.totalCount} active
            </Badge>
            <Badge variant="outline">Total stock: {summary.totalStock}</Badge>
            {summary.minPrice !== null && (
              <Badge variant="outline">
                From Rs. {summary.minPrice.toLocaleString("en-PK")}
              </Badge>
            )}
          </div>
        )}
      </div>

      {hasVariants && (
        <div className="space-y-5 border-t pt-4">
          {/* Option Groups */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">
                Variation Options ({options.length}/3)
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                {QUICK_OPTION_PRESETS.filter(
                  (preset) =>
                    !options.some(
                      (opt) => opt.name.trim().toLowerCase() === preset.toLowerCase()
                    )
                ).map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={options.length >= 3}
                    onClick={() => handleAddOption(preset)}
                    className="h-7 px-2.5 text-xs cursor-pointer"
                  >
                    <Plus className="size-3" />
                    {preset}
                  </Button>
                ))}

                {options.length < 3 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddOption("")}
                    className="h-7 px-2.5 text-xs cursor-pointer"
                  >
                    <Plus className="size-3" />
                    Custom Option
                  </Button>
                )}
              </div>
            </div>

            {options.map((option, optIdx) => (
              <div
                key={option.id}
                className="space-y-3 rounded-lg border bg-background p-3.5"
              >
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`${option.id}-name`}
                      className="text-xs text-muted-foreground"
                    >
                      Option #{optIdx + 1} Name
                    </Label>
                    <Input
                      id={`${option.id}-name`}
                      type="text"
                      value={option.name}
                      onChange={(e) =>
                        handleOptionNameChange(option.id, e.target.value)
                      }
                      placeholder="e.g., Color, Size, Storage"
                      className="h-9"
                    />
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove option ${option.name || optIdx + 1}`}
                    onClick={() => handleRemoveOption(option.id)}
                    className="text-destructive hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {/* Option values */}
                <div className="space-y-2">
                  <Label
                    htmlFor={`${option.id}-values`}
                    className="text-xs text-muted-foreground"
                  >
                    Values (press Enter or comma to add)
                  </Label>

                  <div className="flex gap-2">
                    <Input
                      id={`${option.id}-values`}
                      type="text"
                      value={option.pendingValue}
                      onChange={(e) =>
                        handlePendingValueChange(option.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          commitOptionValues(option.id);
                        }
                      }}
                      placeholder={
                        option.name
                          ? `Add ${option.name} values (e.g., Red, Black)`
                          : "Add option values (e.g., M, L, XL)"
                      }
                      className="h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => commitOptionValues(option.id)}
                      className="h-9 shrink-0 cursor-pointer"
                    >
                      Add
                    </Button>
                  </div>

                  {option.values.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {option.values.map((val) => (
                        <Badge
                          key={val}
                          variant="secondary"
                          className="gap-1.5 py-1 pr-1.5 pl-2.5 text-xs"
                        >
                          <span>{val}</span>
                          <button
                            type="button"
                            aria-label={`Remove value ${val}`}
                            onClick={() =>
                              handleRemoveOptionValue(option.id, val)
                            }
                            className="rounded-full p-0.5 hover:bg-background/80 cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Apply Controls */}
          {variants.length > 0 && (
            <div className="space-y-2.5 rounded-lg border bg-background p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quick Bulk Fill ({variants.length} combinations)
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleAutoGenerateSkus}
                  className="h-7 gap-1 px-2 text-xs cursor-pointer"
                >
                  <Sparkles className="size-3.5" />
                  Auto-fill SKUs
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <Input
                  type="number"
                  min="1"
                  step="any"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  placeholder="Regular Rs."
                  aria-label="Bulk regular price"
                  className="h-8 text-xs"
                />
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={bulkSalePrice}
                  onChange={(e) => setBulkSalePrice(e.target.value)}
                  placeholder="Sale Rs. (optional)"
                  aria-label="Bulk sale price"
                  className="h-8 text-xs"
                />
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  placeholder="Stock"
                  aria-label="Bulk stock"
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleBulkApply}
                  className="h-8 text-xs cursor-pointer"
                >
                  Apply to All
                </Button>
              </div>
            </div>
          )}

          {/* Variants Matrix Table */}
          {variants.length > 0 && (
            <div
              tabIndex={0}
              role="region"
              aria-label="Product variations table"
              className="overflow-x-auto rounded-lg border bg-background"
            >
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th scope="col" className="px-3 py-2.5">
                      Active
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Variation
                    </th>
                    {availableImages.length > 0 && (
                      <th scope="col" className="px-3 py-2.5">
                        Image
                      </th>
                    )}
                    <th scope="col" className="px-3 py-2.5">
                      Regular (Rs.) *
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Sale (Rs.)
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      Stock *
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      SKU
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((variant) => {
                    const combKey = buildCombinationKey(variant.attributes);
                    const rowError = variantErrors[combKey];
                    const selectedImg = availableImages.find(
                      (img) => img.value === variant.image
                    );

                    return (
                      <tr
                        key={combKey}
                        className={
                          variant.isActive === false
                            ? "bg-muted/25 opacity-65"
                            : ""
                        }
                      >
                        <td className="px-3 py-2.5 align-top">
                          <Checkbox
                            aria-label={`Enable ${Object.values(variant.attributes || {}).join(" / ")}`}
                            checked={variant.isActive !== false}
                            onCheckedChange={(checked) =>
                              handleVariantFieldChange(
                                combKey,
                                "isActive",
                                Boolean(checked)
                              )
                            }
                            className="mt-1.5 cursor-pointer"
                          />
                        </td>

                        <td className="px-3 py-2.5 align-top">
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {Object.entries(variant.attributes || {}).map(
                              ([k, v]) => (
                                <Badge
                                  key={k}
                                  variant="outline"
                                  className="text-xs font-medium"
                                >
                                  {v}
                                </Badge>
                              )
                            )}
                          </div>
                          {rowError && (
                            <p className="mt-1 text-[11px] font-medium text-destructive">
                              {rowError}
                            </p>
                          )}
                        </td>

                        {availableImages.length > 0 && (
                          <td className="px-3 py-2.5 align-top">
                            <Select
                              value={selectedImg ? selectedImg.value : "__default__"}
                              onValueChange={(val) =>
                                handleVariantFieldChange(
                                  combKey,
                                  "image",
                                  val === "__default__" ? "" : val
                                )
                              }
                            >
                              <SelectTrigger className="h-8 w-28 text-xs">
                                <SelectValue placeholder="Default" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__default__">
                                  Default
                                </SelectItem>
                                {availableImages.map((img) => (
                                  <SelectItem key={img.value} value={img.value}>
                                    <span className="flex items-center gap-1.5">
                                      <img
                                        src={img.preview}
                                        alt=""
                                        className="size-4 rounded object-cover"
                                      />
                                      {img.label}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        )}

                        <td className="px-3 py-2.5 align-top">
                          <Input
                            type="number"
                            min="1"
                            step="any"
                            value={variant.regularPrice}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                combKey,
                                "regularPrice",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            aria-invalid={Boolean(rowError)}
                            className="h-8 w-24 text-xs"
                          />
                        </td>

                        <td className="px-3 py-2.5 align-top">
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            value={variant.salePrice}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                combKey,
                                "salePrice",
                                e.target.value
                              )
                            }
                            placeholder="Optional"
                            className="h-8 w-24 text-xs"
                          />
                        </td>

                        <td className="px-3 py-2.5 align-top">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                combKey,
                                "stock",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            aria-invalid={Boolean(rowError)}
                            className="h-8 w-20 text-xs"
                          />
                        </td>

                        <td className="px-3 py-2.5 align-top">
                          <Input
                            type="text"
                            value={variant.sku}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                combKey,
                                "sku",
                                e.target.value
                              )
                            }
                            placeholder="SKU"
                            className="h-8 w-28 text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
      )}
    </section>
  );
};

export default ProductVariationsSection;

