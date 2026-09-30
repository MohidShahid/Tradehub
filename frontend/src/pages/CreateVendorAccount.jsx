import { useState } from "react";
import { FieldLabel, Field, FieldError } from "../components/ui/field";
import { Input } from "@/components/ui/input";

const CreateVendorAccount = () => {
      const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAndPrivacyAccepted: false,
      });

      const handleChange = ()=>{
        
      }
  return (
    <div>

        <div>
        <h2>Create Seller Account</h2>
        <p>Build your store and start selling today</p>
        </div>
         <div>
        <Field>
          <FieldLabel>Full Name<span className="text-destructive">*</span></FieldLabel>
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
          <FieldLabel>Email<span className="text-destructive">*</span></FieldLabel>
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
        </div>
    </div>
  )
}

export default CreateVendorAccount