import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { createProduct } from "@/services/productService";
import { toast } from "../../components/ui/toast";

const CreateProduct = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialProduct = {
    name: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    stock: "",
    sku: "",
    category: "",
  };
  const [product, setProduct] = useState(initialProduct);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setProduct((previousData) => ({
      ...previousData,
      category: value,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      if (images.length === 0) {
        toast.add({
          type: "error",
          description: "Please upload at least one product image",
        });
        return;
      }

      setLoading(true);
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("regularPrice", product.regularPrice);
      formData.append("salePrice", product.salePrice);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      if (product.sku) {
        formData.append("sku", product.sku);
      }

      images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      const response = await createProduct(formData);
      toast.add({
        type: "success",
        description: response?.data?.message || "Product Created Successfully",
      });
      setLoading(false);
      setProduct(initialProduct);
      setImages([]);
    } catch (error) {
      console.log("Backend error:", error.response);
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Product Create failed",
      });
    } finally {
      setProduct(initialProduct);
      setImages([]);
      setLoading(false);
    }
  };
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
            value={product.name}
            onChange={(e) => handleChange(e)}
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
            value={product.description}
            onChange={(e) => handleChange(e)}
          />{" "}
        </Field>
        <div className="flex gap-3 ">
          <Field>
            <FieldLabel>
              Regular price<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"number"}
              name="regularPrice"
              placeholder={"Enter the regular price $"}
              className={"p-5"}
              value={product.regularPrice}
              onChange={(e) => handleChange(e)}
            />{" "}
          </Field>
          <Field>
            <FieldLabel>
              Sale price<span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type={"number"}
              name="salePrice"
              placeholder={"Enter the sale price $"}
              className={"p-5"}
              value={product.salePrice}
              onChange={(e) => handleChange(e)}
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
              value={product.stock}
              onChange={(e) => handleChange(e)}
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
              value={product.sku}
              onChange={(e) => handleChange(e)}
            />
          </Field>

          <Field className="flex-1 min-w-0 justify-between">
            <FieldLabel>
              Category<span className="text-destructive">*</span>
            </FieldLabel>

            <Select
              items={categories}
              value={product?.category}
              onValueChange={handleCategoryChange}
            >
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
          <ProductImageUpload images={images} setImages={setImages} />
        </div>
        <div className="flex justify-end mt-5">
          <Button
            className={
              "py-6 bg-(--color-accent) text-xl cursor-pointer w-[50%]"
            }
            onClick={handleCreateProduct}
          >
            {!loading ? (
              <>
                <PlusCircle className="size-7" /> Add Product
              </>
            ) : (
              <>
                <Spinner /> Adding Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
