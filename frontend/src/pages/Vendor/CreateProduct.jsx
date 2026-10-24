import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/static/data";
import {
  SelectGroup,
  SelectContent,
  SelectTrigger,
  Select,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PlusCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductImageUpload from "@/components/shop/ProductImageUpload";

const CreateProduct = () => {
  return (
    <div className="px-10 py-5 md:w-[70%]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl pt-5">Create Product</h1>
        <p className="text-gray-400">
          Add a product to your shop and make it available to customers online
        </p>
      </div>
      <div className="flex flex-col gap-7 pt-7">
        <Field>
          <FieldLabel>
            Product name<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            type={"text"}
            name="name"
            placeholder={"Enter the product name"}
            className={"p-5"}
          />
        </Field>
        <Field>
          <FieldLabel>
            Product description<span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            type={"text"}
            name="description"
            placeholder={"Enter the product description"}
            className={"p-5 h-32"}
          />{" "}
        </Field>
        <div className="flex gap-3 ">
          <Field>
            <FieldLabel>
              Regular price<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"number"}
              name="regular_price"
              placeholder={"Enter the regular price $"}
              className={"p-5"}
            />{" "}
          </Field>
          <Field>
            <FieldLabel>
              Sale price<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"number"}
              name="sale_price"
              placeholder={"Enter the sale price $"}
              className={"p-5"}
            />
          </Field>
          <Field>
            <FieldLabel>
              Stock<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"number"}
              name="stock"
              placeholder={"Enter the stock"}
              className={"p-5"}
            />{" "}
          </Field>
        </div>
        <div className="flex w-full gap-3">
          <Field className="flex-1 min-w-0">
            <FieldLabel>SKU (Optional)</FieldLabel>
            <Input
              type="text"
              name="sku"
              placeholder="Enter the SKU"
              className="h-12 w-full"
            />
          </Field>

          <Field className="flex-1 min-w-0 justify-between">
            <FieldLabel>
              Category<span className="text-destructive">*</span>
            </FieldLabel>

            <Select items={categories} >
              <SelectTrigger className="w-full p-6 justify-between">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div>
         
        <ProductImageUpload />
        </div>
        <div className="flex justify-end mt-5">
          <Button
            className={
              "py-6 bg-(--color-accent) text-xl cursor-pointer w-[50%]"
            }
          >
            <PlusCircle className="size-7" /> Add Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
