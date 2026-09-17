import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";

const Login = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndPrivacyAccepted: false,
  });

  const [type, setType] = useState("password");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(e.target.checked);
  };

  const handleSubmit = () => {
    console.log(user);
  };
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="w-md h-auto flex px-6 pb-5 flex-col gap-4 border-accent">
        <span className="gap-1 flex flex-col pb-3.5">
          <h1 className="font-bold  text-3xl  text-(--color-primary)">
            Create your account
          </h1>
          <p className="text-(--color-text-secondary) text-sm">
            Get started in minutes and unlock all the features of tradehub
          </p>
        </span>
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input
            type={"text"}
            value={user.name}
            placeholder={"Enter your full name"}
            name={"name"}
            className={"p-5"}
            onChange={(e) => handleChange(e)}
            required
          />
          {/* <FieldError>Enter a valid email address.</FieldError> */}
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type={"text"}
            value={user.email}
            placeholder={"Enter the email"}
            name={"email"}
            className={"p-5"}
            onChange={(e) => handleChange(e)}
            required
          />
          {/* <FieldError>Enter a valid email address.</FieldError> */}
        </Field>

        <Field className={"pt-3"}>
          <FieldLabel>Password</FieldLabel>
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
        </Field>
        <Field className={"pt-3"}>
          <FieldLabel>Confirm Password</FieldLabel>
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
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="terms-checkbox-basic"
            className="
data-checked:border-(--color-primary)
data-checked:bg-(--color-primary)
data-checked:text-white
  "
  name={"termsAndPrivacyAccepted"}
              checked={user.termsAndPrivacyAccepted}
            onCheckedChange={(checked)=>{
               setUser({
                ...user, termsAndPrivacyAccepted : checked,
               })
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
            <Link className="text-(--color-primary-hover)">Privacy Policy</Link>
          </FieldLabel>
        </Field>

        <Button
          className={"py-6 bg-(--color-accent) text-xl cursor-pointer"}
          onClick={() => handleSubmit()}
        >
          Create Account
        </Button>
        <div className="text-center text-sm">
          Aleady have an account?{" "}
          <Link className="text-sm! text-(--color-accent)" to={"/login"}>
            Login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
