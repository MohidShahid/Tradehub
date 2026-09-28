export const validateSignup = (user) => {
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


