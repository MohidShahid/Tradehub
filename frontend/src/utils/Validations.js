export const validateBuyer = (user) => {
  const errors = {};

  if (!user.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!user.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(user.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!user.password) {
    errors.password = "Password is required";
  } else if (user.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (user.password !== user.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!user.termsAndPrivacyAccepted) {
    errors.termsAndPrivacyAccepted =
      "You must accept the terms and privacy policy";
  }

  return errors;
};


export const validateLogin = (user)=>{
  const errors = {};

  if (!user.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(user.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!user.password) {
    errors.password = "Password is required";
  } else if (user.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;

}



export const validateVendor = (vendor)=>{
  const errors = {};

    if (!vendor.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!vendor.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(vendor.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!vendor.password) {
    errors.password = "Password is required";
  } else if (vendor.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
   
  if (!vendor.shopName.trim()) {
    errors.fullName = "Full name is required";
  }
    return errors;

}


export const validateCoupon = (form) => {
    const newErrors = {};

    if (!form.code.trim()) {
      newErrors.code = "Coupon code is required";
    }

    if (
      !form.discountValue ||
      Number(form.discountValue) <= 0
    ) {
      newErrors.discountValue = "Enter a valid discount value";
    }

    if (
      form.discountType === "percentage" &&
      Number(form.discountValue) > 100
    ) {
      newErrors.discountValue = "Percentage cannot exceed 100";
    }

    if (Number(form.totalCoupons) <= 0) {
      newErrors.totalCoupons = "Enter a valid coupon limit";
    }

    if (!form.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (
      new Date(form.expiryDate + "T23:59:59") < new Date()
    ) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    if (Number(form.minimumOrderAmount) < 0) {
      newErrors.minimumOrderAmount = "Amount cannot be negative";
    }

    return newErrors


  };




