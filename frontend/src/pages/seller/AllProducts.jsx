import { useEffect, useState } from "react";
import {
  deleteProduct,
  getShopProducts,
  updateProduct,
} from "../../services/productService";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EditProductModal from "@/components/shop/EditProductModal";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

        const data = res.data?.data || [];
        const pagination = res.data?.pagination;

        setProducts(data);
        setTotalPages(pagination?.totalPages || 1);
        setTotalProducts(pagination?.totalProducts ?? data.length);
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
  }, [page, limit]);

  const handleUpdateProduct = async (productId, formData) => {
    try {
      setUpdating(true);
      const res = await updateProduct(productId, formData);
      const updated = res.data?.data;

      if (updated) {
        setProducts((prev) =>
          prev.map((item) => (item._id === productId ? updated : item))
        );
      }

      toast.add({
        type: "success",
        description: res.data?.message || "Product updated successfully",
      });
      setEditingProduct(null);
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to update product",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct?._id || deleting) return;

    try {
      setDeleting(true);
      const targetId = deletingProduct._id;
      const res = await deleteProduct(targetId);

      const remaining = products.filter((item) => item._id !== targetId);
      setProducts(remaining);
      setTotalProducts((prev) => Math.max(0, prev - 1));

      if (remaining.length === 0 && page > 1) {
        setPage((prev) => prev - 1);
      }

      toast.add({
        type: "success",
        description: res.data?.message || "Product deleted successfully",
      });
      setDeletingProduct(null);
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete product",
      });
    } finally {
      setDeleting(false);
    }
  };

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
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <span>SKU: {product.sku || "N/A"}</span>
                          {product.hasVariants &&
                            Array.isArray(product.variants) &&
                            product.variants.length > 0 && (
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[10px]"
                              >
                                {product.variants.length}{" "}
                                {product.variants.length === 1
                                  ? "variant"
                                  : "variants"}
                              </Badge>
                            )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>{product.category || "Uncategorized"}</TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="font-medium">
                      Rs.{" "}
                      {Number(product.salePrice) > 0
                        ? product.salePrice
                        : product.regularPrice}
                    </div>
                    {Number(product.salePrice) > 0 && (
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
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => setDeletingProduct(product)}
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          key={editingProduct._id}
          open={Boolean(editingProduct)}
          product={editingProduct}
          onOpenChange={(open) => {
            if (!open && !updating) {
              setEditingProduct(null);
            }
          }}
          onSubmit={handleUpdateProduct}
          loading={updating}
        />
      )}

      {/* Delete Product Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeletingProduct(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={!deleting}>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              This action permanently deletes this product and its uploaded
              images. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deletingProduct && (
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <img
                src={
                  deletingProduct.featuredImage ||
                  deletingProduct.images?.[0] ||
                  "https://via.placeholder.com/80"
                }
                alt={deletingProduct.name}
                className="h-12 w-12 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{deletingProduct.name}</p>
                <p className="text-xs text-muted-foreground">
                  Rs.{" "}
                  {Number(deletingProduct.salePrice) > 0
                    ? deletingProduct.salePrice
                    : deletingProduct.regularPrice}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              autoFocus
              disabled={deleting}
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? (
                <>
                  <LoaderCircle className="animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProducts;
