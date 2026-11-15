import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ShoppingCart,
  Calendar,
  MapPin,
  CreditCard,
  Banknote,
  Package,
  Loader2,
  CheckCircle,
  Truck,
  Clock,
  Eye,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSellerOrders, updateOrderStatus } from "@/services/orderService";
import { toast } from "@/components/ui/toast";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  // Selected order for detailed modal view
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSellerOrders();
      setOrders(res.data?.orders || []);
      setShop(res.data?.shop || null);
    } catch (err) {
      console.error("Failed to load seller orders:", err);
      toast.add({
        type: "error",
        description: err.response?.data?.message || "Failed to load shop orders",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await getSellerOrders();
        if (!isMounted) return;
        setOrders(res.data?.orders || []);
        setShop(res.data?.shop || null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load seller orders:", err);
        toast.add({
          type: "error",
          description: err.response?.data?.message || "Failed to load shop orders",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      toast.add({
        type: "success",
        description: `Order status updated to ${newStatus}`,
      });
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                orderStatus: newStatus,
                ...(newStatus === "Delivered" && {
                  paymentStatus: "Paid",
                  deliveredAt: new Date(),
                }),
              }
            : o
        )
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: newStatus,
          ...(newStatus === "Delivered" && {
            paymentStatus: "Paid",
            deliveredAt: new Date(),
          }),
        }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.add({
        type: "error",
        description:
          err.response?.data?.message || "Failed to update order status",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders by search and status tab
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order._id?.toLowerCase().includes(query) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(query) ||
      order.shippingAddress?.phoneNumber?.includes(query) ||
      order.orderItems?.some((item) =>
        item.name?.toLowerCase().includes(query)
      );

    return matchesStatus && matchesSearch;
  });

  // Calculate seller revenue and metrics
  const totalOrdersCount = orders.length;
  const processingCount = orders.filter(
    (o) => o.orderStatus === "Processing"
  ).length;
  const shippedCount = orders.filter((o) => o.orderStatus === "Shipped").length;
  const deliveredCount = orders.filter(
    (o) => o.orderStatus === "Delivered"
  ).length;
  const totalShopRevenue = orders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((acc, order) => {
      // Calculate sum of items belonging to this shop
      const shopItemsTotal = (order.orderItems || [])
        .filter((item) => String(item.shopId) === String(shop?._id))
        .reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
      return acc + (shopItemsTotal || order.totalPrice || 0);
    }, 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/dashboard">Seller</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/seller/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Shop <span className="text-(--color-accent)">Orders</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Track customer orders, manage fulfilment, and update delivery statuses.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchOrders}
          className="self-start sm:self-auto"
        >
          Refresh Orders
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Orders
          </p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            {totalOrdersCount}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Clock size={13} /> Processing
          </p>
          <p className="mt-1 text-2xl font-extrabold text-amber-900">
            {processingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <Truck size={13} /> Shipped
          </p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {shippedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50/40 p-4 shadow-xs">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle size={13} /> Delivered
          </p>
          <p className="mt-1 text-2xl font-extrabold text-green-900">
            {deliveredCount}
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-orange-200 bg-orange-50/40 p-4 shadow-xs">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            Shop Revenue
          </p>
          <p className="mt-1 text-xl sm:text-2xl font-extrabold text-orange-950 truncate">
            {formatPrice(totalShopRevenue)}
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Orders" },
            { id: "processing", label: "Processing" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatusFilter(id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === id
                  ? "bg-(--color-accent) text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by ID, customer, item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-12 text-center">
            <Loader2 size={36} className="animate-spin text-orange-500 mb-2" />
            <p className="text-sm text-gray-500">Loading shop orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center p-10 text-center">
            <ShoppingCart size={44} className="text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">No orders found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              {search || statusFilter !== "all"
                ? "Try clearing your search or status filter to see other orders."
                : "When customers order products from your shop, they will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                  <TableHead className="font-bold text-gray-900">Order ID</TableHead>
                  <TableHead className="font-bold text-gray-900">Customer</TableHead>
                  <TableHead className="font-bold text-gray-900">Items Ordered</TableHead>
                  <TableHead className="font-bold text-gray-900">Total</TableHead>
                  <TableHead className="font-bold text-gray-900">Payment</TableHead>
                  <TableHead className="font-bold text-gray-900">Order Status</TableHead>
                  <TableHead className="font-bold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  );

                  return (
                    <TableRow key={order._id} className="hover:bg-gray-50/60 transition">
                      {/* Order ID & Date */}
                      <TableCell className="align-top py-4">
                        <span className="font-mono text-xs font-bold text-gray-900 block">
                          #{order._id.slice(-8)}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={11} /> {dateStr}
                        </span>
                      </TableCell>

                      {/* Customer Info */}
                      <TableCell className="align-top py-4">
                        <span className="font-semibold text-xs text-gray-900 block">
                          {order.shippingAddress?.fullName || order.user?.fullName || "Customer"}
                        </span>
                        <span className="text-[11px] text-gray-500 block mt-0.5">
                          {order.shippingAddress?.city}
                        </span>
                        {order.shippingAddress?.phoneNumber && (
                          <span className="text-[11px] text-gray-400 block">
                            {order.shippingAddress.phoneNumber}
                          </span>
                        )}
                      </TableCell>

                      {/* Items */}
                      <TableCell className="align-top py-4 max-w-xs">
                        <div className="space-y-1.5">
                          {order.orderItems?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded bg-gray-50 border shrink-0 flex items-center justify-center overflow-hidden">
                                {it.image ? (
                                  <img src={it.image} alt="" className="h-full w-full object-contain" />
                                ) : (
                                  <Package size={12} className="text-gray-300" />
                                )}
                              </div>
                              <span className="text-xs text-gray-700 truncate">
                                {it.name} <span className="text-gray-400">&times; {it.quantity}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      {/* Total */}
                      <TableCell className="align-top py-4 font-bold text-xs text-gray-900">
                        {formatPrice(order.totalPrice)}
                      </TableCell>

                      {/* Payment */}
                      <TableCell className="align-top py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-xs font-medium text-gray-800 flex items-center gap-1">
                            {order.paymentMethod === "Stripe" ? (
                              <CreditCard size={13} className="text-blue-600" />
                            ) : (
                              <Banknote size={13} className="text-green-600" />
                            )}
                            {order.paymentMethod === "Stripe" ? "Card" : "COD"}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              order.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </TableCell>

                      {/* Order Status Select / Dropdown */}
                      <TableCell className="align-top py-4">
                        <select
                          disabled={updatingId === order._id}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none transition cursor-pointer ${
                            order.orderStatus === "Processing"
                              ? "border-amber-300 bg-amber-50 text-amber-800"
                              : order.orderStatus === "Shipped"
                              ? "border-blue-300 bg-blue-50 text-blue-800"
                              : order.orderStatus === "Delivered"
                              ? "border-green-300 bg-green-50 text-green-800"
                              : "border-red-300 bg-red-50 text-red-800"
                          }`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="align-top py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 gap-1 px-2.5 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <Eye size={14} />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base sm:text-lg font-bold text-gray-900">
                    Order #{selectedOrder._id}
                  </DialogTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <Badge
                  className={
                    selectedOrder.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : selectedOrder.orderStatus === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }
                >
                  {selectedOrder.orderStatus}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-3">
              {/* Shipping Address & Customer Contact */}
              <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50/80 p-4 sm:grid-cols-2 text-xs">
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-1.5 mb-1.5">
                    <User size={14} className="text-(--color-accent)" /> Customer
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className="text-gray-500 mt-0.5 flex items-center gap-1">
                    <Phone size={11} /> {selectedOrder.shippingAddress?.phoneNumber || "N/A"}
                  </p>
                  {selectedOrder.user?.email && (
                    <p className="text-gray-500">{selectedOrder.user.email}</p>
                  )}
                </div>

                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-1.5 mb-1.5">
                    <MapPin size={14} className="text-(--color-accent)" /> Shipping Address
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedOrder.shippingAddress?.completeAddress}
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country || "Pakistan"}
                  </p>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.orderNotes && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
                  <span className="font-bold flex items-center gap-1 mb-0.5">
                    <AlertCircle size={13} /> Customer Delivery Note:
                  </span>
                  {selectedOrder.orderNotes}
                </div>
              )}

              {/* Items List */}
              <div>
                <h4 className="font-bold text-xs text-gray-900 mb-2">Order Items</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {selectedOrder.orderItems?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 border p-1 flex items-center justify-center shrink-0">
                          {it.image ? (
                            <img src={it.image} alt="" className="h-full w-full object-contain" />
                          ) : (
                            <Package size={16} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{it.name}</p>
                          <p className="text-gray-500 text-[11px]">
                            Qty: {it.quantity} &times; {formatPrice(it.price)}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-gray-900">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Update Order Status:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedOrder.orderStatus === st ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedOrder._id, st)}
                      disabled={updatingId === selectedOrder._id}
                      className="text-xs"
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SellerOrders;
