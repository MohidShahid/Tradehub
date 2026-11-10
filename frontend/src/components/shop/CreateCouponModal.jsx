import { useState, useEffect } from "react";
import { TicketPercent, Search, ShoppingBag, CalendarDays } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { validateCoupon } from "@/utils/Validations";
import { getShopProducts } from "@/services/productService";
import { toast } from "../../components/ui/toast";
import { Spinner } from "../ui/spinner";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrderAmount: 0,
  totalCoupons: "",
  expiryDate: "",
  applicableProducts: [],
};

const CreateCouponModal = ({ open, onOpenChange, onSubmit, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [productSearch, setProductSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const params = { page: 1, limit: 1 };

        const res = await getShopProducts(params);

        // Adjust these paths to match your actual API response.
        const data = res.data.data;

        setProducts(data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalProducts(data.pagination?.totalProducts || 0);
      } catch (error) {
        console.log("Backend error:", error.response);

        toast.add({
          type: "error",
          description:
            error.response?.data?.message ||
            error.message ||
            "Get Products failed",
        });
      } 
    };
    getProducts();
  }, [page]);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const toggleProduct = (productId) => {
    setForm((prev) => ({
      ...prev,
      applicableProducts: prev.applicableProducts.includes(productId)
        ? prev.applicableProducts.filter((id) => id !== productId)
        : [...prev.applicableProducts, productId],
    }));
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const errors = validateCoupon(form);
    setErrors(errors);
    if(!Object.keys(errors).length === 0) return 

    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discountValue: Number(form.discountValue),
      minimumOrderAmount: Number(form.minimumOrderAmount),
      totalCoupons: Number(form.totalCoupons),
      alreadyUsed: 0,
      applicableProducts: form.applicableProducts,
    };

    onSubmit(payload);
    setForm(initialForm);
    setErrors({});
    setProductSearch("");
  };

  const handleClose = (value) => {
    if (!value) {
      setForm(initialForm);
      setErrors({});
      setProductSearch("");
    }

    onOpenChange(value);
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2.5">
              <TicketPercent className="h-6 w-6 text-green-700" />
            </div>

            <div>
              <DialogTitle className="text-xl font-semibold">
                Create Coupon
              </DialogTitle>

              <DialogDescription className="mt-1">
                Create a discount offer for your customers.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code *</Label>

            <Input
              id="code"
              placeholder="e.g. SUMMER20"
              value={form.code}
              onChange={(e) =>
                updateField("code", e.target.value.toUpperCase())
              }
              className="uppercase"
            />

            {errors.code && (
              <p className="text-xs text-red-500">{errors.code}</p>
            )}
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type *</Label>

              <select
                value={form.discountType}
                onChange={(e) => updateField("discountType", e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Discount Value *</Label>

              <Input
                type="number"
                min="0"
                placeholder={form.discountType === "percentage" ? "20" : "500"}
                value={form.discountValue}
                onChange={(e) => updateField("discountValue", e.target.value)}
              />

              {errors.discountValue && (
                <p className="text-xs text-red-500">{errors.discountValue}</p>
              )}
            </div>
          </div>

          {/* Minimum Order */}
          <div className="space-y-2">
            <Label>Minimum Order Amount (Rs.)</Label>

            <Input
              type="number"
              min="0"
              value={form.minimumOrderAmount}
              onChange={(e) =>
                updateField("minimumOrderAmount", e.target.value)
              }
              placeholder="1000"
            />
          </div>

          {/* Coupon Limit */}
          <div className="space-y-2">
            <Label>Total Coupon Limit *</Label>

            <Input
              type="number"
              min="1"
              placeholder="e.g. 100"
              value={form.totalCoupons}
              onChange={(e) => updateField("totalCoupons", e.target.value)}
            />

            <p className="text-xs text-gray-400">
              Maximum number of times this coupon can be redeemed.
            </p>

            {errors.totalCoupons && (
              <p className="text-xs text-red-500">{errors.totalCoupons}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Expiry Date *</Label>

            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                type="date"
                min={today}
                value={form.expiryDate}
                onChange={(e) => updateField("expiryDate", e.target.value)}
                className="pl-10"
              />
            </div>

            {errors.expiryDate && (
              <p className="text-xs text-red-500">{errors.expiryDate}</p>
            )}
          </div>

          {/* Applicable Products */}
          <div className="space-y-3">
            <div>
              <Label>Applicable Products</Label>
              <p className="mt-1 text-xs text-gray-400">
                Select products or leave empty to apply this coupon to all
                products in your shop.
              </p>
            </div>

            {/* Selected products count */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingBag size={16} />
                Selected Products
              </div>

              <span className="font-semibold text-green-700">
                {form.applicableProducts.length === 0
                  ? "All Products"
                  : `${form.applicableProducts.length} Selected`}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                placeholder="Search your products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
              {filteredProducts.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400">
                  No products found.
                </p>
              )}
              {filteredProducts.map((product) => {
                const selected = form.applicableProducts.includes(product._id);

                return (
                  <label
                    key={product._id}
                    className="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleProduct(product._id)}
                        className="h-4 w-4 accent-green-700"
                      />

                      <span className="text-sm font-medium text-gray-700">
                        {product.name}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      Rs.{" "}
                      {Number(
                        product.salePrice ??
                          product.regularPrice  ??
                          0,
                      ).toLocaleString()}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="bg-green-700 hover:bg-green-800 cursor-pointer" disabled={loading} onClick={handleSubmit}>
              <TicketPercent className="mr-2 h-4 w-4" />
              {loading ? <Spinner /> : ""} Create Coupon
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCouponModal;
