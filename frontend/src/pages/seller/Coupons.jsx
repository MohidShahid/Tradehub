
import { useEffect, useState } from "react";
import {
  Plus,
  TicketPercent,
  Tag,
  TrendingUp,
  Clock,
  Search,
  MoreHorizontal,
  Copy,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import CreateCouponModal from "../../components/shop/CreateCouponModal";
import { createCoupon, getShopCoupons} from "@/services/sellerService";
import { toast } from "@/components/ui/toast";



const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading , setLoading] = useState(false);

  const activeCoupons = coupons.filter(
    (coupon) =>
      coupon.isActive &&
      new Date(coupon.expiryDate) >= new Date() &&
      coupon.alreadyUsed < coupon.totalCoupons
  ).length;

  const totalRedemptions = coupons.reduce(
    (total, coupon) => total + coupon.alreadyUsed,
    0
  );

  const handleCreateCoupon = async(newCoupon) => {
    try {
      setLoading(true)
       setCoupons((prev) => [
      { ...newCoupon, _id: crypto.randomUUID() },
      ...prev,
    ]);
    const res = await createCoupon(newCoupon);
    toast.add({
      type : "success",
      description : res.data?.message
    })

    } catch (error) {
      console.log(error.message);
      toast.add({
        type : "error",
        description : error.message,
      })
    }finally{
          setIsModalOpen(false);
          setLoading(false);
    }

  };

  const handleDeleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
  };

  const handleCopyCode = async (code) => {
    await navigator.clipboard.writeText(code);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (coupon) => {
    if (!coupon.isActive) return "Inactive";
    if (new Date(coupon.expiryDate) < new Date()) return "Expired";
    if (coupon.alreadyUsed >= coupon.totalCoupons) return "Limit reached";
    return "Active";
  };

  const stats = [
    {
      title: "Total Coupons",
      value: coupons.length,
      icon: TicketPercent,
      description: "All created coupons",
    },
    {
      title: "Active Coupons",
      value: activeCoupons,
      icon: Tag,
      description: "Currently available",
    },
    {
      title: "Total Redemptions",
      value: totalRedemptions,
      icon: TrendingUp,
      description: "Coupons redeemed",
    },
    {
      title: "Expired Coupons",
      value: coupons.filter(
        (c) => new Date(c.expiryDate) < new Date()
      ).length,
      icon: Clock,
      description: "Past their expiry date",
    },
  ];


  useEffect(()=>{
    const getCoupons = async()=>{
       try {
        const res = await getShopCoupons();
        setCoupons(res.data?.data)
       } catch (error) {
         console.log(error.message);
         toast.add({
          type : error, 
          description : error?.response?.data?.message
         })
       }
    }

    getCoupons();
  },[])

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Coupons
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage discount coupons for your customers.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 hover:bg-green-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <div className="rounded-lg bg-green-50 p-2">
                  <Icon className="h-5 w-5 text-green-700" />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Coupon Listing */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">
              All Coupons
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your store discount campaigns.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon code..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Coupon</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Applies To</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.map((coupon) => {
                const status = getStatus(coupon);

                return (
                  <tr key={coupon._id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-50 p-2">
                          <TicketPercent className="h-5 w-5 text-orange-600" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {coupon.code}
                          </p>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-green-700"
                          >
                            <Copy size={12} />
                            Copy code
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-gray-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : `Rs. ${coupon.discountValue} OFF`}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {coupon.applicableProducts.length === 0
                        ? "All products"
                        : `${coupon.applicableProducts.length} products`}
                    </td>

                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-gray-600">
                            {coupon.alreadyUsed}/{coupon.totalCoupons}
                          </span>
                          <span className="text-gray-400">
                            {coupon.totalCoupons
                              ? Math.round(
                                  (coupon.alreadyUsed /
                                    coupon.totalCoupons) *
                                    100
                                )
                              : 0}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-green-600"
                            style={{
                              width: `${
                                coupon.totalCoupons
                                  ? Math.min(
                                      (coupon.alreadyUsed /
                                        coupon.totalCoupons) *
                                        100,
                                      100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {formatDate(coupon.expiryDate)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          status === "Active"
                            ? "bg-green-50 text-green-700"
                            : status === "Expired"
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCoupon(coupon)}
                          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          title="View coupon"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCoupons.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <CreateCouponModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateCoupon}
        loading={loading}
      />

      {/* Coupon Details Modal */}
      <Dialog
        open={!!selectedCoupon}
        onOpenChange={(open) => !open && setSelectedCoupon(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coupon Details</DialogTitle>
          </DialogHeader>

          {selectedCoupon && (
            <div className="space-y-3 text-sm">
              <p><strong>Code:</strong> {selectedCoupon.code}</p>
              <p><strong>Discount:</strong> {selectedCoupon.discountValue}{selectedCoupon.discountType === "percentage" ? "%" : " Rs."}</p>
              <p><strong>Minimum order:</strong> Rs. {selectedCoupon.minimumOrderAmount}</p>
              <p><strong>Usage:</strong> {selectedCoupon.alreadyUsed}/{selectedCoupon.totalCoupons}</p>
              <p><strong>Expiry:</strong> {formatDate(selectedCoupon.expiryDate)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
