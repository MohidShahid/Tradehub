import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  Home,
  ShoppingCart,
  Heart,
  User,
  Store,
  LogOut,
  Package,
  Search,
  ChevronRight,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logout, authenticateSeller } from "@/services/accountService";
import { toast } from "./ui/toast";
import Logo from "../assets/whitelogo1.png";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart?.Items || []);
  const wishlist = useSelector((state) => state.wishlist?.wishlist || []);

  const { isAuthenticated, user } = userState;

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    try {
      const response = await Logout();
      toast.add({
        type: "success",
        description: response?.data?.message || "Logged out successfully",
      });
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.response);
      toast.add({
        type: "error",
        description:
          error.response?.data?.message || error.message || "Logout failed",
      });
    }
  };

  const handleBecomeSeller = async () => {
    try {
      const response = await authenticateSeller();
      setOpen(false);
      navigate(`/shop/${response?.data?.data?.owner}`);
    } catch (error) {
      toast.add({
        type: "error",
        description: error.response?.data?.message || error.message,
      });
      setOpen(false);
      navigate("/signup");
    }
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open Navigation Menu"
              className="text-(--color-primary) hover:bg-white/10 hover:text-white p-2 "
            >
              <Menu className="size-8" />
            </Button>
          }
        />

        <SheetContent
          side="right"
          className="w-[85vw] sm:max-w-sm flex flex-col p-0 bg-white text-slate-800 border-l border-slate-200 overflow-y-auto"
        >
          {/* User Profile Card or Auth CTA */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-emerald-600/20 shadow-sm">
                  {user.profilePic ? (
                    <AvatarImage
                      src={user.profilePic}
                      alt={user.name || "User"}
                    />
                  ) : (
                    <AvatarFallback className="bg-emerald-700 text-white font-semibold">
                      {(user.name || user.email || "U")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {user.name || "TradeHub User"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Welcome to TradeHub
                  </p>
                  <p className="text-xs text-slate-500">
                    Sign in to track orders, save favorites & more
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-(--color-primary-hover) hover:bg-(--color-primary) text-white"
                    onClick={handleLinkClick}
                  >
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <LogIn size={15} /> Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-300 hover:bg-slate-100"
                    onClick={handleLinkClick}
                  >
                    <Link
                      to="/signup"
                      className="flex items-center justify-center gap-1.5"
                    >
                      <UserPlus size={15} /> Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div className="p-4 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-9 pr-4 text-xs rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </form>
          </div>

          {/* Quick Badges Row (Cart & Wishlist) */}
          <div className="grid grid-cols-2 gap-2 px-4 py-2">
            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-200 transition group"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-emerald-700" />
                <span className="text-xs font-medium text-slate-700">Cart</span>
              </div>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                {cartItems.length}
              </span>
            </Link>

            <Link
              to="/wishlist"
              onClick={handleLinkClick}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-200 transition group"
            >
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-rose-500" />
                <span className="text-xs font-medium text-slate-700">
                  Wishlist
                </span>
              </div>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                {wishlist.length}
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-3 space-y-1">
            <p className="px-2 pb-1 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              Menu
            </p>

            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition"
            >
              <span className="flex items-center gap-3">
                <Home size={18} className="text-slate-500" /> Home
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/user-profile"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition"
                >
                  <span className="flex items-center gap-3">
                    <User size={18} className="text-slate-500" /> My Profile
                  </span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Package size={18} className="text-slate-500" /> My Orders
                  </span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>

                <div className="pt-2">
                  <p className="px-2 pb-1 text-[11px] font-bold tracking-wider uppercase text-slate-400">
                    Seller Portal
                  </p>

                  <Link
                    to="/seller/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition"
                  >
                    <span className="flex items-center gap-3">
                      <LayoutDashboard size={18} className="text-slate-500" />{" "}
                      Seller Dashboard
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleBecomeSeller}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-emerald-800 hover:bg-emerald-50 transition text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Store size={18} className="text-emerald-700" /> Become a
                      Seller
                    </span>
                    <ChevronRight size={16} className="text-emerald-600" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Bottom Actions / Logout */}
          {isAuthenticated && (
            <div className="p-4 border-t border-slate-200 mt-auto bg-slate-50/50">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Sign Out
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
