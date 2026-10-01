import { useState } from "react";
import { FieldLabel, Field, FieldError } from "./ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { validateVendor } from "@/utils/Validations";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "./ui/toast";
import { registerSeller } from "@/services/accountService";
import { useNavigate } from "react-router-dom";
const CreateVendorAccount = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    fullName: "",
    email: "",
    password: "",
    shopName: "",
    shopDescription: "",
    termsAndPrivacyAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [type, setType] = useState("text");

  const handleChange = (e) => {
    setVendor({
      ...vendor, [e.target.name] : e.target.value
    })
  };

  const handleSubmit = async () => {
    try {
      const errors = validateVendor(vendor);

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }
      const formData = new FormData();

      formData.append("fullName", vendor.fullName);
      formData.append("email", vendor.email);
      formData.append("password", vendor.password);
      formData.append("shopName" , vendor.shopName);
      formData.append("shopDescription" , vendor.shopDescription);
      // formData.append("profilePic", vendor.profilePic);
      formData.append("termsAndPrivacyAccepted", vendor.termsAndPrivacyAccepted);

      setLoading(true);
      const response = await registerSeller(formData);

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
    <div className="pt-10 flex flex-col justify-center gap-10 w-[30%]">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl text-(--color-primary) font-bold">
          Create Seller Account
        </h2>
        <p className="text-gray-500">
          Build your store and start selling today
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <Field>
          <FieldLabel>
            Owner Name<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            type={"text"}
            value={vendor.fullName}
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
            value={vendor.email}
            placeholder={"Enter the email"}
            name={"email"}
            className={"p-5"}
            onChange={(e) => handleChange(e)}
            required
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field className={""}>
          <FieldLabel>
            Password<span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup className={"py-5!"}>
            <InputGroupInput
              type={type}
              value={vendor.password}
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
        <Field>
          <FieldLabel>
            Shop Name<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            type={"text"}
            value={vendor.shopName}
            placeholder={"Enter your Shop Name"}
            name={"shopName"}
            className={"p-5"}
            onChange={(e) => handleChange(e)}
            required
          />
          {errors.shopName && <FieldError>{errors.shopName}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>
            Shop Description<span className="text-gray-400">(Optional)</span>
          </FieldLabel>
          <Textarea
            type={"text"}
            value={vendor.shopDescription}
            placeholder={"Enter Shop Description"}
            name={"shopDescription"}
            className={"p-5"}
            onChange={(e) => handleChange(e)}
            required
          />
          {errors.shopDescription && (
            <FieldError>{errors.shopDescription}</FieldError>
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
              checked={vendor.termsAndPrivacyAccepted}
              onCheckedChange={(checked) => {
                setVendor({
                  ...vendor,
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
      </div>
    </div>
  );
};

export default CreateVendorAccount;
