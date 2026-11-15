import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Plus,
  Check,
  Building,
  Home,
  Briefcase,
  Loader2,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  createAddress,
  getUserAddresses,
  deleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
} from "@/services/addressService";
import { toast } from "@/components/ui/toast";

const AddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const isCreateRoute = location.pathname.endsWith("/create");

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    completeAddress: "",
    city: "",
    state: "",
    country: "Pakistan",
    postalCode: "",
    addressType: "Home",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getUserAddresses();
      const list = res.data?.addresses || [];
      setAddresses(list);
      if (list.length === 0) {
        setShowAddForm(true);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to load addresses",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getUserAddresses();
        if (!isMounted) return;
        const list = res.data?.addresses || [];
        setAddresses(list);
        if (list.length === 0) {
          setShowAddForm(true);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch addresses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Recipient name is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.completeAddress.trim()) {
      newErrors.completeAddress = "Street address / building is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await createAddress(formData);

      toast.add({
        type: "success",
        description: "Delivery address saved successfully",
      });

      setFormData({
        fullName: "",
        phoneNumber: "",
        completeAddress: "",
        city: "",
        state: "",
        country: "Pakistan",
        postalCode: "",
        addressType: "Home",
        isDefault: false,
      });

      if (redirect) {
        navigate(redirect);
        return;
      }

      await fetchAddresses();
      setShowAddForm(false);
      if (isCreateRoute) {
        navigate("/address");
      }
    } catch (err) {
      console.error("Address save error:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to save address",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.add({
        type: "success",
        description: "Address deleted successfully",
      });
      await fetchAddresses();
    } catch (err) {
      console.error("Delete address error:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to delete address",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await apiSetDefaultAddress(id);
      toast.add({
        type: "success",
        description: "Default delivery address updated",
      });
      await fetchAddresses();
    } catch (err) {
      console.error("Set default error:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to update default address",
      });
    }
  };

  // Whether the full-page create form should be shown
  const isFormVisible = isCreateRoute || showAddForm || addresses.length === 0;

  return (
    <div className="min-h-screen bg-gray-50/70 px-4 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {redirect === "/cart" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink href="/address">Delivery Addresses</BreadcrumbLink>
            </BreadcrumbItem>
            {isCreateRoute && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/address/create">Add New</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back link if redirect */}
        {redirect && (
          <Link
            to={redirect}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-accent) hover:underline"
          >
            <ArrowLeft size={16} /> Return to Cart
          </Link>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {isCreateRoute ? (
                <>
                  Add Delivery <span className="text-(--color-accent)">Address</span>
                </>
              ) : (
                <>
                  Delivery <span className="text-(--color-accent)">Addresses</span>
                </>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isCreateRoute
                ? "Enter your shipping details below to save a new delivery address."
                : "Manage your saved shipping addresses for faster and smoother checkout."}
            </p>
          </div>

          {!isCreateRoute && !showAddForm && addresses.length > 0 && (
            <Link
              to={"/address/create" + (redirect ? `?redirect=${redirect}` : "")}
              className="inline-flex items-center gap-2 rounded-xl bg-(--color-accent) px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 transition"
            >
              <Plus size={16} />
              Add New Address
            </Link>
          )}

          {isCreateRoute && addresses.length > 0 && (
            <Link
              to={"/address" + (redirect ? `?redirect=${redirect}` : "")}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition"
            >
              <ArrowLeft size={15} />
              View Saved Addresses
            </Link>
          )}
        </div>

        {/* Redirect notice banner */}
        {redirect === "/cart" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50/80 p-4 text-orange-900">
            <MapPin className="mt-0.5 shrink-0 text-orange-600" size={18} />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Required for checkout: </span>
              Please add or select a delivery address to complete your order from the cart.
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border bg-white p-12 text-center">
            <Loader2 className="animate-spin text-orange-500" size={36} />
            <p className="mt-3 text-sm text-gray-500">Loading addresses...</p>
          </div>
        ) : isFormVisible ? (
          /* =======================================================
             FULL WIDTH FORM (Takes whole container on large screens)
             ======================================================= */
          <div className="w-full">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8 md:p-10">
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      Address Information
                    </h2>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Fields marked with <span className="text-red-500">*</span> are required.
                    </p>
                  </div>
                </div>

                {!isCreateRoute && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                {/* Row 1: Recipient Full Name & Phone Number (2 columns on sm+) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      Recipient Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        errors.fullName
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle size={13} /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. 0300 1234567"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        errors.phoneNumber
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle size={13} /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Complete Street Address (Full Width) */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                    Complete Street Address / House / Flat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="completeAddress"
                    rows={3}
                    value={formData.completeAddress}
                    onChange={handleChange}
                    placeholder="House / Apartment #, Street Name, Sector, Colony, Area Landmark"
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      errors.completeAddress
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.completeAddress && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={13} /> {errors.completeAddress}
                    </p>
                  )}
                </div>

                {/* Row 3: City, State/Province, Postal Code (3 columns on md+) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Lahore"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        errors.city
                          ? "border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle size={13} /> {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Punjab"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      Postal Code / ZIP
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 54000"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </div>
                </div>

                {/* Row 4: Country & Address Type (2 columns on sm+) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm">
                      Address Type
                    </label>
                    <div className="flex gap-3">
                      {[
                        { label: "Home", icon: Home },
                        { label: "Office", icon: Briefcase },
                        { label: "Other", icon: Building },
                      ].map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, addressType: label }))
                          }
                          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                            formData.addressType === label
                              ? "border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon size={15} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 5: Set as Default Checkbox */}
                <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-medium text-gray-700 sm:text-sm">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>Make this my primary / default delivery address</span>
                  </label>
                </div>

                {/* Row 6: Submit & Cancel Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-gray-100 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-8 py-3.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving Delivery Address...
                      </>
                    ) : (
                      "Save Delivery Address"
                    )}
                  </button>

                  <Link
                    to={isCreateRoute ? "/address" : "#"}
                    onClick={(e) => {
                      if (!isCreateRoute) {
                        e.preventDefault();
                        setShowAddForm(false);
                      }
                    }}
                    className="w-full sm:w-auto rounded-xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition text-center"
                  >
                    Cancel
                  </Link>

                  <div className="mt-2 sm:mt-0 sm:ml-auto flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={16} className="text-green-600 shrink-0" />
                    Delivery addresses are encrypted & secure.
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* =======================================================
             SAVED ADDRESSES LIST (2 columns on md/lg screens)
             ======================================================= */
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                    addr.isDefault
                      ? "border-orange-500/80 ring-2 ring-orange-500/15"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-gray-900">
                          {addr.fullName || "Recipient"}
                        </span>
                        <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          {addr.addressType || "Home"}
                        </span>
                      </div>

                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <Check size={13} strokeWidth={3} />
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">
                      {addr.completeAddress}, {addr.city}
                      {addr.state ? `, ${addr.state}` : ""}
                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                      <span>Country: {addr.country || "Pakistan"}</span>
                      {addr.phoneNumber && (
                        <span className="font-medium text-gray-700">
                          Phone: {addr.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    {!addr.isDefault ? (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr._id)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-green-700">
                        Primary Address
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {redirect && (
                        <button
                          type="button"
                          onClick={() => {
                            handleSetDefault(addr._id);
                            navigate(redirect);
                          }}
                          className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100 transition"
                        >
                          Deliver Here &rarr;
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={deletingId === addr._id}
                        onClick={() => handleDelete(addr._id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete address"
                        aria-label="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
