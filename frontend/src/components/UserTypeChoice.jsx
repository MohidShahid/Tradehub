import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Button } from "./ui/button"

export function UserTypeChoice({ setStep, userType, setUserType }) {
  return (
    <div className="flex h-screen flex-col gap-5 pt-20">
      <h1 className="text-3xl font-bold text-(--color-text)">
        Which account would you
        <br />
        like to create?
      </h1>

      <RadioGroup
        value={userType}
        onValueChange={setUserType}
        className="max-w-sm"
      >
        {/* Vendor */}
        <FieldLabel htmlFor="vendor">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Vendor</FieldTitle>
              <FieldDescription>
                Sell your products on TradeHub
              </FieldDescription>
            </FieldContent>

            <RadioGroupItem value="vendor" id="vendor"  />
          </Field>
        </FieldLabel>

        {/* Buyer */}
        <FieldLabel htmlFor="buyer">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Buyer</FieldTitle>
              <FieldDescription>
                Browse and buy from multiple sellers
              </FieldDescription>
            </FieldContent>

            <RadioGroupItem value="buyer" id="buyer" />
          </Field>
        </FieldLabel>
      </RadioGroup>

      <Button
        className="cursor-pointer bg-(--color-accent) py-6 text-xl"
        onClick={() => {
            if(userType == "vendor"){
                setStep(3)
            }else{
                setStep(2)
            }
        }}
      >
        Continue
      </Button>
    </div>
  )
}