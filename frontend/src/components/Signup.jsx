import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { registerAccount } from "@/services/accountService";
import { toast } from "./ui/toast";
import { Spinner } from "./ui/spinner";
import { useNavigate } from "react-router-dom";
import { validateSignup } from "@/utils/Validations";
import { FaShop, FaTruck } from "react-icons/fa6";
import { ShieldCheck } from "lucide-react";
import ShopCover from "../assets/ShopCover.png";
import { UserTypeChoice } from "./UserTypeChoice";
import { CreateVendorAccount } from "@/Routes";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndPrivacyAccepted: false,
  });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  // const fileInputRef = useRef(null);
  const [type, setType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState("buyer");
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(e.target.checked);
  };

  const handleSubmit = async () => {
    try {
      const errors = validateSignup(user);

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }
      const formData = new FormData();

      formData.append("fullName", user.fullName);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("profilePic", user.profilePic);
      formData.append("termsAndPrivacyAccepted", user.termsAndPrivacyAccepted);

      setLoading(true);
      const response = await registerAccount(formData);

      toast.add({
        type: "success",
        description: response?.data?.message,
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log("Backend error:", error.response);
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      });
      setLoading(false);
    }
  };
  return (
    <div className="flex items-start justify-start gap-20 h-dvh ">
      <div className="flex justify-between w-[55%] pr-4 py-10 h-screen bg-(--color-primary-light) px-10">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <h1 className="text-3xl text-(--color-primary) inline-fit">
              Join Tradehub <br /> and be a part of growing
              <br />{" "}
              <span className="text-(--color-accent) font-bold">
                marketplace community
              </span>
            </h1>
            <ul className="flex gap-4 text-sm pr-5">
              <li>Shop</li>
              <li>Sell</li>
              <li>Grow</li>
            </ul>
          </div>
          <p className="">
            Weather your'e a buyer or seller, Tradehub connects you with the
            best <br />
            products and trusted vendors -- all in one place
          </p>
          <div className="flex gap-10 pt-10">
            <div className="flex gap-4">
              <FaShop size={30} className="text-(--color-primary)" />{" "}
              <p className="text-sm">
                Multiple
                <br />
                Vendors
              </p>
            </div>
            <div className="flex gap-4">
              <ShieldCheck size={30} className="text-(--color-primary)" />{" "}
              <p className="text-sm">
                Secure
                <br />
                Transactions
              </p>
            </div>
            <div className="flex gap-4">
              <FaTruck size={30} className="text-(--color-primary)" />{" "}
              <p className="text-sm">
                Fastest & Reliable
                <br />
                Delivery
              </p>
            </div>
          </div>
          <img src={ShopCover} alt="" className="pt-5" />
        </div>
      </div>
      {step == 1 && (
        <UserTypeChoice
          setStep={setStep}
          userType={userType}
          setUserType={setUserType}
        />
      )}
      {step == 2 &&  userType == "buyer" && (
        <div className="w-md h-auto flex justify-center px-6 pb-5 pt-20 flex-col gap-4 border-accent">
          {/* <span className="gap-1 flex flex-col pb-3.5">
          <h1 className="font-bold  text-3xl  text-(--color-primary)">
            Create your account
          </h1>
          <p className="text-(--color-text-secondary) text-sm">
            Get started in minutes and unlock all the features of tradehub
          </p>
        </span> */}
          {/* <div className={"flex items-center justify-center flex-col gap-1.5"}>
          <div
            className="w-24 h-24 bg-[#E8F3EA] rounded-[50%] flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current.click()}
          >
            {user.profilePic ? (
              <img
                src={URL.createObjectURL(user.profilePic)}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <CameraIcon size={32} color="#14532D" />
            )}
          </div>
          <Input
            ref={fileInputRef}
            type={"file"}
            name={"profilePic"}
            className={"p-5"}
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              console.log(file);
              if (file) {
                setUser((prevUser) => ({
                  ...prevUser,
                  profilePic: file,
                }));
              }
            }}
          />

          <p className="text-sm">Add profile photo</p>
          <span className="text-sm text-(--color-text-muted)">Optional</span>
        </div> */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl text-(--color-primary) font-bold">
              Create your account
            </h1>
            <p className="text-gray-500">
              Get started in minutes and unlock all the features of tradehub
            </p>
          </div>
          <Field>
            <FieldLabel>
              Full Name<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"text"}
              value={user.fullName}
              placeholder={"Enter your full name"}
              name={"fullName"}
              className={"p-5"}
              onChange={(e) => handleChange(e)}
              required
            />
            {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>
              Email<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"text"}
              value={user.email}
              placeholder={"Enter the email"}
              name={"email"}
              className={"p-5"}
              onChange={(e) => handleChange(e)}
              required
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>

          <Field className={"pt-3"}>
            <FieldLabel>
              Password<span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup className={"py-5!"}>
              <InputGroupInput
                type={type}
                value={user.password}
                placeholder={"Enter the password"}
                name={"password"}
                className={"p-5!"}
                onChange={(e) => handleChange(e)}
              />
              <InputGroupAddon align="inline-end" className={"cursor-pointer"}>
                {type == "password" ? (
                  <EyeOffIcon onClick={() => setType("text")} />
                ) : (
                  <EyeIcon onClick={() => setType("password")} />
                )}
              </InputGroupAddon>
            </InputGroup>
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>
          <Field className={"pt-3"}>
            <FieldLabel>
              Confirm Password<span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup className={"py-5!"}>
              <InputGroupInput
                type={type}
                value={user.confirmPassword}
                placeholder={"Enter the password"}
                name={"confirmPassword"}
                className={"p-5!"}
                onChange={(e) => handleChange(e)}
                required
              />
              <InputGroupAddon align="inline-end" className={"cursor-pointer"}>
                {type == "password" ? (
                  <EyeOffIcon onClick={() => setType("text")} />
                ) : (
                  <EyeIcon onClick={() => setType("password")} />
                )}
              </InputGroupAddon>
            </InputGroup>
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword}</FieldError>
            )}
          </Field>
          <div className="flex flex-col gap-3">
            <Field orientation="horizontal">
              <Checkbox
                id="terms-checkbox-basic"
                className="
               data-checked:border-(--color-primary)
               data-checked:bg-(--color-primary)
               data-checked:text-white"
                name={"termsAndPrivacyAccepted"}
                checked={user.termsAndPrivacyAccepted}
                onCheckedChange={(checked) => {
                  setUser({
                    ...user,
                    termsAndPrivacyAccepted: checked,
                  });
                }}
              />
              <FieldLabel
                htmlFor="terms-checkbox-basic"
                className="block text-(--color-text-secondary) font-medium!"
              >
                I agree to the{" "}
                <Link className="text-(--color-primary-hover)">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link className="text-(--color-primary-hover)">
                  Privacy Policy
                </Link>
              </FieldLabel>
            </Field>
            {errors.termsAndPrivacyAccepted && (
              <FieldError>{errors.termsAndPrivacyAccepted}</FieldError>
            )}
          </div>
          <Button
            className={"py-6 bg-(--color-accent) text-xl cursor-pointer"}
            disabled={loading}
            onClick={() => handleSubmit()}
          >
            {loading && <Spinner />} Create Account
          </Button>
          <div className="text-center text-sm">
            Aleady have an account?{" "}
            <Link className="text-sm! text-(--color-accent)" to={"/login"}>
              Login{" "}
            </Link>
          </div>
        </div>
      )}

      {step == 3 && userType == "vendor" && (<CreateVendorAccount />)}
    </div>
  );
};

export default Signup;
