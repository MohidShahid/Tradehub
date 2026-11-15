import Logo1 from "../assets/logo.png";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheckIcon,
  CreditCardIcon,
  LogOutIcon,
  StoreIcon,
  PackageIcon,
  ClipboardListIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logout } from "@/services/accountService";
import { toast } from "./ui/toast";
import { authenticateSeller } from "@/services/accountService";
import MobileNav from "./MobileNav";
import { setShopDetails } from "../lib/features/shopSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const state = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.Items);
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const [removeRounded, setRemoveRounded] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const cartCount = cartItems.reduce(
  //   (total, item) => total + item.quantity,
  //   0
  // );

  const logout = async () => {
    try {
      const response = await Logout();
      toast.add({
        type: "success",
        description: response?.data.message,
      });
    } catch (error) {
      console.log("Backend error:", error.response);
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setRemoveRounded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const BecomeSeller = async () => {
    try {
      const response = await authenticateSeller();
      if (response?.data?.hasShop && response?.data?.data) {
        dispatch(setShopDetails(response?.data?.data));
        navigate("/seller/dashboard");
      } else {
        navigate("/seller/onboarding");
      }
    } catch {
      navigate("/seller/onboarding");
    }
  };

  return (
    <div className="h-24  px-5 py-5 flex items-center justify-between  top-0 z-40">
      <div className="flex items-center gap-2">
        <img src={Logo1} alt="" width={50} height={50} />
        <div>
          <span className="flex font-bold text-[24px]">
            <p className="text-(--color-primary)">Trade</p>
            <p className="text-(--color-accent) ">Hub</p>
          </span>
          <p className="text-[8px] text-(--color-primary)">
            Multiple Sellers . One Marketplace
          </p>
        </div>
      </div>
      <SearchBar
        removeRounded={removeRounded}
        setRemoveRounded={setRemoveRounded}
        inputRef={inputRef}
      />
      <div className="hidden items-center justify-between text-sm gap-6 md:flex">
        <Link
          to="/wishlist"
          aria-label={`Wishlist${wishlist.length > 0 ? `, ${wishlist.length} items` : ""}`}
          className="relative cursor-pointer"
        >
          <HeartIcon color="#14532d" aria-hidden="true" />
          {wishlist.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-(--color-primary)">
              {wishlist.length}
            </span>
          )}
        </Link>
        <Link to="/cart" className="relative cursor-pointer">
          <ShoppingCart color="#14532d" size={24} />

          {cartItems.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-(--color-primary)">
              {cartItems.length}
            </span>
          )}
        </Link>
        {state.isAuthenticated && (
          state.user?.isSeller ? (
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-2 text-white bg-slate-900 h-10 px-5 rounded-full text-xs font-semibold hover:bg-slate-800 transition shadow-2xs"
            >
              <StoreIcon size={16} />
              <span>Seller Panel</span>
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 text-white bg-(--color-accent-hover) h-10 px-5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-95 transition shadow-2xs"
              onClick={BecomeSeller}
            >
              <p>Become Seller</p>
            </button>
          )
        )}

        {state.isAuthenticated && state.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    {state.user.profilePic ? (
                      <AvatarImage src={state.user.profilePic} alt="shadcn" />
                    ) : (
                      <AvatarFallback>LR</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/user-profile" className="flex items-center gap-2.5 w-full">
                    <BadgeCheckIcon size={16} />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/user-profile/orders" className="flex items-center gap-2.5 w-full">
                    <PackageIcon size={16} />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/address" className="flex items-center gap-2.5 w-full">
                    <CreditCardIcon size={16} />
                    <span>Addresses</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {state.user?.isSeller && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/seller/dashboard" className="flex items-center gap-2.5 w-full">
                        <StoreIcon size={16} />
                        <span>Seller Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/seller/orders" className="flex items-center gap-2.5 w-full">
                        <ClipboardListIcon size={16} />
                        <span>Shop Orders</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // console.log("Sign out clicked");
                  logout();
                }}
              >
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link className="text-(--color-primary) font-bold" to="/login">
            Login
          </Link>
        )}
      </div>
      <MobileNav />
    </div>
  );
};

export default Navbar;
