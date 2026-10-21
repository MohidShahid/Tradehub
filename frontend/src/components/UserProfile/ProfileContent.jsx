import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CameraIcon, RotateCcw, X, Upload } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { updateUserProfile } from "@/services/accountService";
import { updateUserSuccess } from "@/lib/features/userSlice";

const ProfileContent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Original stored values for comparison
  const originalValues = {
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || (user?.phone ? String(user?.phone) : ""),
    email: user?.email || "",
  };

  // Form values state initialized from Redux user
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phoneNumber:
      user?.phoneNumber || (user?.phone ? String(user?.phone) : ""),
    email: user?.email || "",
  });

  // Track previous user to sync when Redux user is loaded/updated
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setFormData({
      fullName: user?.fullName || "",
      phoneNumber:
        user?.phoneNumber || (user?.phone ? String(user?.phone) : ""),
      email: user?.email || "",
    });
  }

  // Track file and preview
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Status and validation states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  // Clean up object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Identify ONLY the fields that have been modified compared to the current user
  const getChangedFields = () => {
    const changed = {};

    if (formData.fullName.trim() !== originalValues.fullName.trim()) {
      changed.fullName = formData.fullName.trim();
    }

    if (formData.phoneNumber.trim() !== originalValues.phoneNumber.trim()) {
      changed.phoneNumber = formData.phoneNumber.trim();
    }

    if (formData.email.trim() !== originalValues.email.trim()) {
      changed.email = formData.email.trim();
    }

    if (profilePicFile) {
      changed.profilePic = profilePicFile;
    }

    return changed;
  };

  const changedFields = getChangedFields();
  const changedFieldKeys = Object.keys(changedFields);
  const hasChanges = changedFieldKeys.length > 0;

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle image file selection with validation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Selected file must be an image (PNG, JPG, WEBP, etc.)";
      setErrors((prev) => ({
        ...prev,
        profilePic: errorMsg,
      }));
      toast.add({
        type: "error",
        description: errorMsg,
      });
      return;
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const errorMsg = "Image size cannot exceed 5MB";
      setErrors((prev) => ({
        ...prev,
        profilePic: errorMsg,
      }));
      toast.add({
        type: "error",
        description: errorMsg,
      });
      return;
    }

    // Clear profile picture errors
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.profilePic;
      return updated;
    });

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setProfilePicFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Remove newly selected photo before submitting
  const handleRemoveSelectedPhoto = (e) => {
    e.stopPropagation();
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setProfilePicFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.profilePic;
      return updated;
    });
  };

  // Revert all form changes to currently saved user values
  const handleReset = () => {
    setFormData({
      fullName: originalValues.fullName,
      phoneNumber: originalValues.phoneNumber,
      email: originalValues.email,
    });
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setProfilePicFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors({});
  };

  // Client-side validation: validates ONLY the modified fields
  const validateModifiedFields = (changed) => {
    const newErrors = {};

    // Validate fullName only if modified
    if ("fullName" in changed) {
      if (!changed.fullName || changed.fullName.length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters.";
      }
    }

    // Validate phoneNumber only if modified
    if ("phoneNumber" in changed && changed.phoneNumber) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(changed.phoneNumber)) {
        newErrors.phoneNumber =
          "Please enter a valid phone number (7-15 digits, optional + prefix).";
      }
    }

    // Validate email only if modified
    if ("email" in changed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!changed.email || !emailRegex.test(changed.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    // Validate profilePic only if modified
    if ("profilePic" in changed && changed.profilePic) {
      if (!changed.profilePic.type.startsWith("image/")) {
        newErrors.profilePic = "File must be an image.";
      } else if (changed.profilePic.size > 5 * 1024 * 1024) {
        newErrors.profilePic = "Image size cannot exceed 5MB.";
      }
    }

    return newErrors;
  };

  // Submit handler: package and send ONLY the changed fields
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const changed = getChangedFields();
    const changedKeys = Object.keys(changed);

    // If nothing has been changed, notify via toast
    if (changedKeys.length === 0) {
      toast.add({
        type: "info",
        description: "No changes detected to update.",
      });
      return;
    }

    // Validate only modified fields
    const validationErrors = validateModifiedFields(changed);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Build FormData containing ONLY the changed fields
      const payload = new FormData();
      changedKeys.forEach((key) => {
        payload.append(key, changed[key]);
      });

      // Visual log in console for debugging/verification
      console.log(
        "%c[Profile Update] Sending ONLY modified fields:",
        "color: #15803d; font-weight: bold;",
        changedKeys.reduce((acc, key) => {
          acc[key] = key === "profilePic" ? changed[key].name : changed[key];
          return acc;
        }, {}),
      );

      const response = await updateUserProfile(payload);

      if (response?.data?.success) {
        const updatedUser = response.data.user;

        // Update Redux state with latest user details
        dispatch(updateUserSuccess(updatedUser));

        toast.add({
          type: "success",
          description: response.data.message || "Profile updated successfully!",
        });

        // Reset local transient states
        setProfilePicFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile. Please try again.";
      toast.add({
        type: "error",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine current avatar image to render
  const avatarImageSrc = previewUrl || user?.profilePic || null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Profile Details</h2>
        <p className="text-sm text-slate-500">
          Manage your personal information and contact details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-slate-200 rounded-xl p-6 bg-white space-y-6 shadow-xs flex flex-col"
      >
        {/* Profile Picture Uploader Section */}
        <div className="flex items-center justify-center flex-col gap-2 pb-2">
          <div className="relative group">
            <div
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 cursor-pointer transition-all duration-200 overflow-hidden relative ${
                profilePicFile
                  ? "border-emerald-500 shadow-md ring-4 ring-emerald-100"
                  : "border-slate-200 hover:border-slate-400 bg-slate-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              title="Click to change profile picture"
            >
              {avatarImageSrc ? (
                <img
                  src={avatarImageSrc}
                  alt={formData.fullName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <CameraIcon className="size-8 mb-1" />
                  <span className="text-[11px] font-medium text-slate-500">
                    Upload
                  </span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium">
                <CameraIcon className="size-5 mb-1" />
                <span>Change</span>
              </div>
            </div>

            {/* Quick Remove Button for unsaved image */}
            {profilePicFile && (
              <button
                type="button"
                onClick={handleRemoveSelectedPhoto}
                className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-sm transition-colors cursor-pointer"
                title="Discard selected image"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs h-8 cursor-pointer gap-1.5 text-slate-700"
            >
              <Upload className="size-3.5" />
              {avatarImageSrc ? "Change Photo" : "Upload Photo"}
            </Button>
            {profilePicFile && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                New photo selected
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="profilePic"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {errors.profilePic && (
            <p className="text-xs font-medium text-rose-600 mt-1">
              {errors.profilePic}
            </p>
          )}
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-5">
          {/* Full Name Field */}
          <Field data-invalid={!!errors.fullName}>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-sm font-semibold text-slate-700">
                Full Name
              </FieldLabel>
              {formData.fullName.trim() !== originalValues.fullName.trim() && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 animate-in fade-in">
                  Modified
                </span>
              )}
            </div>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="p-3 text-sm focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
          </Field>

          {/* Phone Number Field */}
          <Field data-invalid={!!errors.phoneNumber}>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-sm font-semibold text-slate-700">
                Phone Number
              </FieldLabel>
              {formData.phoneNumber.trim() !==
                originalValues.phoneNumber.trim() && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 animate-in fade-in">
                  Modified
                </span>
              )}
            </div>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. +1 555 123 4567"
              className="p-3 text-sm focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              aria-invalid={!!errors.phoneNumber}
            />
            {errors.phoneNumber && (
              <FieldError>{errors.phoneNumber}</FieldError>
            )}
          </Field>

          {/* Email Field */}
          <Field data-invalid={!!errors.email}>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-sm font-semibold text-slate-700">
                Email Address
              </FieldLabel>
              {formData.email.trim() !== originalValues.email.trim() && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 animate-in fade-in">
                  Modified
                </span>
              )}
            </div>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="p-3 text-sm focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            className="flex-1 py-5 bg-(--color-accent) hover:bg-emerald-600 text-white font-medium text-sm cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <>
                <Spinner className="size-4 mr-2" /> Updating Account...
              </>
            ) : (
              "Update Account"
            )}
          </Button>

          {hasChanges && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="py-5 px-4 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 text-sm"
              title="Discard unsaved changes"
            >
              <RotateCcw className="size-3.5" />
              Discard
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileContent;
