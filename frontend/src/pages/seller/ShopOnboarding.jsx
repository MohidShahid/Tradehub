import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Store,
  Sparkles,
  MapPin,
  Phone,
  Tag,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createShop } from "@/services/accountService";
import { setShopDetails } from "@/lib/features/shopSlice";
import { updateUserSuccess } from "@/lib/features/userSlice";
import ShopImagePicker from "@/components/shop/ShopImagePicker";

const CATEGORIES = [
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Home & Living",
  "Beauty & Personal Care",
  "Sports & Outdoor",
  "Books & Stationery",
  "Groceries & Food",
  "Toys, Kids & Baby",
  "Automotive & Tools",
  "Other",
];

const ShopOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    shopName: "",
    category: "Electronics & Gadgets",
    description: "",
    phoneNumber: user?.phoneNumber ? String(user.phoneNumber) : "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Pakistan",
    },
    logo: "",
    banner: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [logoMode, setLogoMode] = useState("upload");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [bannerMode, setBannerMode] = useState("upload");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    } else if (formData.shopName.trim().length < 3) {
      newErrors.shopName = "Shop name must be at least 3 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Contact/pickup phone number is required";
    }

    if (!formData.address.city.trim()) {
      newErrors["address.city"] = "City is required for courier pickup";
    }

    if (!formData.address.street.trim()) {
      newErrors["address.street"] = "Street address is required for pickup";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.add({
        type: "error",
        description: "Please sign in to create your shop",
      });
      navigate("/login?redirect=/seller/onboarding");
      return;
    }

    if (!validate()) {
      toast.add({
        type: "error",
        description: "Please fill in all required shop details",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("shopName", formData.shopName.trim());
      payload.append("category", formData.category);
      payload.append("description", formData.description.trim());
      payload.append("phoneNumber", formData.phoneNumber.trim());
      payload.append("address", JSON.stringify(formData.address));

      if (logoMode === "upload" && logoFile) {
        payload.append("logo", logoFile);
      } else if (formData.logo.trim()) {
        payload.append("logo", formData.logo.trim());
      }

      if (bannerMode === "upload" && bannerFile) {
        payload.append("banner", bannerFile);
      } else if (formData.banner.trim()) {
        payload.append("banner", formData.banner.trim());
      }

      const res = await createShop(payload);

      if (res.data?.data) {
        dispatch(setShopDetails(res.data.data));
      }
      if (res.data?.user) {
        dispatch(updateUserSuccess(res.data.user));
      }

      toast.add({
        type: "success",
        description: "🎉 Shop created! Welcome to your seller dashboard.",
      });

      navigate("/seller/dashboard");
    } catch (err) {
      console.error("Create shop failed:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to create shop. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-10 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles size={14} /> TradeHub Seller Onboarding
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Open Your Shop & Start Selling
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Join thousands of merchants reaching active buyers across the marketplace.
              Complete your shop profile to begin listing products and managing orders.
            </p>
          </div>

          <div className="hidden lg:grid absolute right-6 top-1/2 -translate-y-1/2 grid-cols-2 gap-3 opacity-90">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
              <TrendingUp className="mx-auto mb-1 text-emerald-400" size={20} />
              <p className="text-xs font-bold">Fast Payouts</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
              <Package className="mx-auto mb-1 text-emerald-400" size={20} />
              <p className="text-xs font-bold">Courier Pickup</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center col-span-2">
              <ShieldCheck className="mx-auto mb-1 text-emerald-400" size={20} />
              <p className="text-xs font-bold">Zero Setup Fees</p>
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Fields */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Step 1: Shop Identity */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="size-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Shop Identity
                  </h2>
                  <p className="text-xs text-slate-500">
                    What should buyers call your shop?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Store
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Tech Store, Velvet Chic"
                      className="pl-9"
                    />
                  </div>
                  {errors.shopName && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.shopName}
                    </p>
                  )}
                  {formData.shopName && (
                    <p className="mt-1 text-[11px] text-slate-400 font-mono">
                      Your store URL: tradehub.com/shop/
                      <span className="text-emerald-700 font-semibold">
                        {formData.shopName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shop Bio / Description
                  </label>
                  <div className="relative">
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell buyers what you sell, your specialties, and your promise of quality..."
                      className="resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Contact & Pickup Location */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="size-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Pickup & Business Contact
                  </h2>
                  <p className="text-xs text-slate-500">
                    Used for courier order pickups and delivery correspondence
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. 03001234567"
                      className="pl-9"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address (Pickup Point) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Warehouse #, Building, Street name"
                      className="pl-9"
                    />
                  </div>
                  {errors["address.street"] && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors["address.street"]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="e.g. Lahore"
                    />
                    {errors["address.city"] && (
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        {errors["address.city"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State / Province
                    </label>
                    <Input
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="e.g. Punjab"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postal Code
                    </label>
                    <Input
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      placeholder="e.g. 54000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Branding (Optional) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="size-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Store Branding (Optional)
                  </h2>
                  <p className="text-xs text-slate-500">
                    You can customize or change these images anytime from your shop settings
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <ShopImagePicker
                  label="Shop Logo"
                  helpText="1:1 square recommended (e.g. 500x500px)"
                  aspectRatio="square"
                  mode={logoMode}
                  onModeChange={setLogoMode}
                  file={logoFile}
                  onFileChange={(f) => {
                    setLogoFile(f);
                    setLogoPreview(URL.createObjectURL(f));
                  }}
                  urlValue={formData.logo}
                  onUrlChange={(url) => {
                    setFormData((prev) => ({ ...prev, logo: url }));
                    setLogoPreview(url);
                  }}
                  preview={logoPreview || formData.logo}
                  onClear={() => {
                    setLogoFile(null);
                    setLogoPreview("");
                    setFormData((prev) => ({ ...prev, logo: "" }));
                  }}
                />

                <ShopImagePicker
                  label="Store Banner"
                  helpText="Wide banner recommended (e.g. 1200x300px or 16:9)"
                  aspectRatio="banner"
                  mode={bannerMode}
                  onModeChange={setBannerMode}
                  file={bannerFile}
                  onFileChange={(f) => {
                    setBannerFile(f);
                    setBannerPreview(URL.createObjectURL(f));
                  }}
                  urlValue={formData.banner}
                  onUrlChange={(url) => {
                    setFormData((prev) => ({ ...prev, banner: url }));
                    setBannerPreview(url);
                  }}
                  preview={bannerPreview || formData.banner}
                  onClear={() => {
                    setBannerFile(null);
                    setBannerPreview("");
                    setFormData((prev) => ({ ...prev, banner: "" }));
                  }}
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to="/"
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                &larr; Cancel and return home
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-9 rounded-xl shadow-sm gap-2.5 cursor-pointer text-base"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Shop...
                  </>
                ) : (
                  <>
                    Launch My Shop <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Right Column: Live Shop Preview & Value Props */}
          <div className="space-y-6">
            {/* Live Preview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Storefront Card Preview
              </p>

              <div className="rounded-xl border border-slate-100 overflow-hidden shadow-xs bg-white">
                {/* Banner preview */}
                <div className="h-20 bg-gradient-to-r from-emerald-800 to-slate-900 relative">
                  {(bannerPreview || formData.banner) && (
                    <img
                      src={bannerPreview || formData.banner}
                      alt="Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 pt-0 relative">
                  {/* Logo avatar */}
                  <div className="-mt-8 mb-2 flex items-end justify-between">
                    <div className="size-16 rounded-xl border-2 border-white bg-slate-100 shadow-sm overflow-hidden flex items-center justify-center text-slate-400 font-bold text-lg">
                      {logoPreview || formData.logo ? (
                        <img
                          src={logoPreview || formData.logo}
                          alt="Logo"
                          className="size-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        formData.shopName ? formData.shopName.charAt(0).toUpperCase() : <Store size={22} />
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {formData.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 truncate">
                    {formData.shopName || "Your Shop Name"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {formData.description ||
                      "Your store description and brand highlights will appear here."}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {formData.address.city || "Pickup City"}
                    </span>
                    <span className="font-semibold text-emerald-700">★ 5.0 (New)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Checklist */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                What happens after opening?
              </h4>
              <ul className="space-y-2.5 text-xs text-emerald-950">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>Immediate access to the <strong>Seller Dashboard</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>Create unlimited products with pricing, stock & variations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>Manage shop orders and generate discount coupons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>Update your profile and address anytime from settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOnboarding;
