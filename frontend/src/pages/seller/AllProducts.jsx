import { useEffect, useState } from "react";
import { getShopProducts } from "../../services/productService";
import { toast } from "../../components/ui/toast";
import {
  Search,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const params = { page, limit };
        setLoading(true);
        const res = await getShopProducts(params);

        // Adjust these paths to match your actual API response.
        const data = res.data.data;

        setProducts(data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalProducts(data.pagination?.totalProducts || 0);
      } catch (error) {
        console.log("Backend error:", error.response);

        toast.add({
          type: "error",
          description:
            error.response?.data?.message ||
            error.message ||
            "Get Products failed",
        });
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [page]);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const getProductStatus = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            All Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor all products in your shop.
          </p>
        </div>

      </div>

      {/* Product count and search */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package size={18} />
          <span>{totalProducts} Products</span>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="min-w-[250px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <LoaderCircle className="mx-auto animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading products...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <Package className="mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">No products found</p>
                  <p className="text-sm text-muted-foreground">
                    Try another search or add a new product.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.featuredImage ||
                          product.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={product.name}
                        className="h-12 w-12 rounded-lg border object-cover"
                      />

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>{product.category || "Uncategorized"}</TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="font-medium">
                      Rs. {product.salePrice || product.regularPrice}
                    </div>
                    {product.salePrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        Rs. {product.regularPrice}
                      </p>
                    )}
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <span
                      className={
                        product.stock > 0 ? "text-green-600" : "text-red-500"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={getProductStatus(product.status)}>
                      {product.status || "Draft"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" title="Edit product">
                        <Pencil size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
