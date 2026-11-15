import { useState } from "react";
import {
  X,
  MapPin,
  Plus,
  Check,
  Building,
  Home,
  Briefcase,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
} from "@/services/addressService";
import { toast } from "@/components/ui/toast";

const AddressModalDialog = ({
  onClose,
  addresses = [],
  selectedAddressId = null,
  onSelectAddress,
  onAddressCreated,
  onAddressDeleted,
  initialMode = "auto",
}) => {
  const [mode, setMode] = useState(() =>
    initialMode === "auto"
      ? addresses.length === 0
        ? "add"
        : "select"
      : initialMode
  );

  const [formData, setFormData] = useState(() => ({
    fullName: "",
    phoneNumber: "",
    completeAddress: "",
    city: "",
    state: "",
    country: "Pakistan",
    postalCode: "",
    addressType: "Home",
    isDefault: addresses.length === 0,
  }));

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await createAddress(formData);
      const newAddress = res.data?.address;

      toast.add({
        type: "success",
        description: "Delivery address added successfully",
      });

      if (onAddressCreated && newAddress) {
        onAddressCreated(newAddress);
      }
      onClose();
    } catch (err) {
      console.error("Address creation error:", err);
      toast.add({
        type: "error",
        description:
          err.response?.data?.message || "Failed to add delivery address",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.add({
        type: "success",
        description: "Address removed",
      });
      if (onAddressDeleted) {
        onAddressDeleted(id);
      }
    } catch (err) {
      console.error("Address deletion error:", err);
      toast.add({
        type: "error",
        description:
          err.response?.data?.message || "Failed to delete address",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleMakeDefault = async (id, e) => {
    e.stopPropagation();
    try {
      await apiSetDefaultAddress(id);
      toast.add({
        type: "success",
        description: "Default address updated",
      });
      const updated = addresses.find((a) => a._id === id);
      if (updated && onSelectAddress) {
        onSelectAddress({ ...updated, isDefault: true });
      }
    } catch (err) {
      console.error("Failed to update default address:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {mode === "add" ? "Add Delivery Address" : "Select Delivery Address"}
              </h3>
              <p className="text-xs text-gray-500">
                {mode === "add"
                  ? "Enter recipient & shipping location details"
                  : "Choose which address to deliver your order to"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {mode === "select" ? (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <MapPin className="mx-auto mb-2 text-gray-300" size={36} />
                  <p className="text-sm font-semibold text-gray-800">
                    No addresses saved yet
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add a delivery address to complete your order.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode("add")}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-(--color-accent) px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    <Plus size={15} />
                    Add Address Now
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => {
                            onSelectAddress(addr);
                            onClose();
                          }}
                          className={`group relative flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {addr.fullName || "Recipient"}
                                </span>
                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                  {addr.addressType || "Home"}
                                </span>
                                {addr.isDefault && (
                                  <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                                {addr.completeAddress}, {addr.city}
                                {addr.state ? `, ${addr.state}` : ""}
                                {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                              </p>

                              {addr.phoneNumber && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Phone: {addr.phoneNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pl-2">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={(e) => handleMakeDefault(addr._id, e)}
                                className="rounded px-2 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                title="Set as default address"
                              >
                                Set Default
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={deletingId === addr._id}
                              onClick={(e) => handleDelete(addr._id, e)}
                              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                              title="Delete address"
                              aria-label="Delete address"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMode("add")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                    Add Another Address
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Add Address Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMode("select")}
                  className="mb-1 text-xs font-semibold text-(--color-accent) hover:underline"
                >
                  &larr; Choose from saved addresses
                </button>
              )}

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      errors.fullName
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 0300 1234567"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Complete Address */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Street Address / House / Flat <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="completeAddress"
                  rows={2}
                  value={formData.completeAddress}
                  onChange={handleChange}
                  placeholder="House #, Street name, Sector / Area"
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition resize-none ${
                    errors.completeAddress
                      ? "border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.completeAddress && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.completeAddress}
                  </p>
                )}
              </div>

              {/* City, State, Postal Code */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Lahore"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      errors.city
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Punjab"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 54000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Address Type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Address Type
                </label>
                <div className="flex gap-2">
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
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition ${
                        formData.addressType === label
                          ? "border-orange-500 bg-orange-50 text-orange-600 ring-1 ring-orange-500"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Set as default checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Save as default delivery address</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMode("select")}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save & Use Address"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const AddressModal = (props) => {
  if (!props.isOpen) return null;
  return (
    <AddressModalDialog
      key={`${props.isOpen}-${props.initialMode}-${props.addresses?.length}`}
      {...props}
    />
  );
};

export default AddressModal;
