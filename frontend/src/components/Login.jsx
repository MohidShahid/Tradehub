import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Link } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const [user , setUser] = useState({
    email : "",
    password : "",
    rememberMe : false,
  })

  const [type, setType] = useState("password");

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setUser((prevUser) => ({
    ...prevUser,
    [name]: type === "checkbox" ? checked : value,
  }));
  console.log(e.target.checked)
};

  const handleSubmit = ()=>{
    console.log(user);
  }
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="w-md h-96 flex px-6 pb-5 flex-col gap-4 border-accent">
        <span className="gap-1 flex flex-col pb-3.5">
        <h1 className="font-bold  text-3xl  text-(--color-primary)">
          Login to your account
        </h1>
        <p className="text-(--color-text-secondary) text-sm">Enter your credentials to continue</p></span>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type={"text"}
            value={user.email}
            placeholder={"Enter the email"}
            name={"email"}
            className={"p-5"}
            onChange={(e)=> handleChange(e)}
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
              onChange={(e)=> handleChange(e)}
            />
            <InputGroupAddon align="inline-end" className={"cursor-pointer"}>
            {
              type == "password" ? <EyeOffIcon onClick={()=> setType("text")} /> : <EyeIcon onClick={()=> setType("password")}  />
            }
              
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <div className="flex justify-between pb-5">
          <Field orientation="horizontal">
            <Checkbox 
            name={"rememberMe"}
            checked={user.rememberMe}
            onCheckedChange={(checked)=>{
               setUser({
                ...user, rememberMe : checked,
               })
            }}/>
            <FieldLabel>Remember me</FieldLabel>
          </Field>
          <Link className="text-sm! text-(--color-accent) w-2/4 text-right" to={"/forgot-password"}>
            Forgot Password?
          </Link>
        </div>

        <Button className={"py-6 bg-(--color-accent) text-xl cursor-pointer"} onClick={()=> handleSubmit()}>Login</Button>
        <div className="text-center text-sm">Don't have an account? <Link className="text-sm! text-(--color-accent)" to={"/Signup"}>Sign up</Link></div>
      </div>
    </div>
  );
};

export default Signup;
