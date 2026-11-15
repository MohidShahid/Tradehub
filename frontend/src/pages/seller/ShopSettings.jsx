import { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Phone,
  Tag,
  Save,
  Loader2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { getMyShop, updateMyShop } from "@/services/accountService";
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

const ShopSettings = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    category: "",
    description: "",
    phoneNumber: "",
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

  const [logoMode, setLogoMode] = useState("upload");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [bannerMode, setBannerMode] = useState("upload");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchShop = async () => {
      try {
        const res = await getMyShop();
        if (!isMounted) return;
        const data = res.data?.data;
        if (data) {
          setShop(data);
          setFormData({
            shopName: data.shopName || "",
            category: data.category || "Electronics & Gadgets",
            description: data.description || "",
            phoneNumber: data.phoneNumber || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              zipCode: data.address?.zipCode || "",
              country: data.address?.country || "Pakistan",
            },
            logo: data.logo || "",
            banner: data.banner || "",
          });
          if (data.logo) {
            setLogoPreview(data.logo);
          }
          if (data.banner) {
            setBannerPreview(data.banner);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load shop:", err);
        toast.add({
          type: "error",
          description: err.response?.data?.message || "Failed to load shop profile",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchShop();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSavedSuccess(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName.trim()) {
      toast.add({ type: "error", description: "Shop name cannot be empty" });
      return;
    }

    try {
      setSaving(true);

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

      const res = await updateMyShop(payload);

      if (res.data?.data) {
        const updated = res.data.data;
        setShop(updated);
        if (updated.logo) setLogoPreview(updated.logo);
        if (updated.banner) setBannerPreview(updated.banner);
        setLogoFile(null);
        setBannerFile(null);
      }

      setSavedSuccess(true);
      toast.add({
        type: "success",
        description: "Shop profile updated successfully",
      });
    } catch (err) {
      console.error("Failed to update shop:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to update shop",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-700 size-8" />
        <p className="mt-2 text-sm text-slate-500">Loading shop settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/dashboard">Seller</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/shop">Shop Settings</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shop Settings & Profile</h1>
          <p className="text-sm text-slate-500">
            Manage your store branding, category, and courier pickup location.
          </p>
        </div>

        {shop?.owner && (
          <a
            href={`/shop/${shop.owner}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
          >
            <ExternalLink size={15} />
            <span>View Public Storefront</span>
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity & Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Store size={18} className="text-emerald-700" /> Shop Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Name
              </label>
              <Input
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="My Store Name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
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
              Shop Description / Bio
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell buyers about your quality, shipping policies, and specialties..."
            />
          </div>
        </div>

        {/* Pickup & Courier Contact */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-700" /> Pickup & Courier Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact / Pickup Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Street Address (Warehouse / Store location)
              </label>
              <Input
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Building, street, sector"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City
              </label>
              <Input
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="e.g. Karachi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Province
              </label>
              <Input
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="e.g. Sindh"
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
                placeholder="75000"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Tag size={18} className="text-emerald-700" /> Branding & Store Media
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload image files or paste direct URLs to update your storefront appearance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                setSavedSuccess(false);
              }}
              urlValue={formData.logo}
              onUrlChange={(url) => {
                setFormData((prev) => ({ ...prev, logo: url }));
                setLogoPreview(url);
                setSavedSuccess(false);
              }}
              preview={logoPreview || formData.logo}
              onClear={() => {
                setLogoFile(null);
                setLogoPreview("");
                setFormData((prev) => ({ ...prev, logo: "" }));
                setSavedSuccess(false);
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
                setSavedSuccess(false);
              }}
              urlValue={formData.banner}
              onUrlChange={(url) => {
                setFormData((prev) => ({ ...prev, banner: url }));
                setBannerPreview(url);
                setSavedSuccess(false);
              }}
              preview={bannerPreview || formData.banner}
              onClear={() => {
                setBannerFile(null);
                setBannerPreview("");
                setFormData((prev) => ({ ...prev, banner: "" }));
                setSavedSuccess(false);
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
              <CheckCircle size={15} /> Changes saved successfully!
            </span>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="ml-auto h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 rounded-xl gap-2.5 cursor-pointer text-sm shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={18} /> Save Shop Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShopSettings;
