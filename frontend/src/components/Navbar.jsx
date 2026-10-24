import Logo from "../assets/whitelogo1.png";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  StoreIcon,
  Store
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

const Navbar = () => {
  const state = useSelector((state) => state.user);
  const cartItems = useSelector((state)=> state.cart.Items)
  const wishlist = useSelector((state)=> state.wishlist.wishlist)

  const [removeRounded, setRemoveRounded] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
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

  const BecomeSeller = async ()=>{
    try {
      const response = await authenticateSeller();
      console.log(response.data);
      navigate(`/shop/${response?.data?.data.owner}`);

    } catch (error) {
      toast.add({
        type : "error",
        description : error.response?.data?.message ||
          error.message,
      })
      navigate("/signup")
    }
  }

  return (
    <div className="h-24 bg-(--color-primary-hover) px-5 py-5 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <img src={Logo} alt="" width={50} height={50} />
        <div>
          <span className="flex font-bold text-[24px]">
            <p className="text-white">Trade</p>
            <p className="text-(--color-accent) ">Hub</p>
          </span>
          <p className="text-[8px] text-(--color-text-muted)">
            Multiple Sellers . One Marketplace
          </p>
        </div>
      </div>
      <SearchBar
        removeRounded={removeRounded}
        setRemoveRounded={setRemoveRounded}
        inputRef={inputRef}
      />
      <div className="flex items-center justify-between text-sm gap-6 ">
        <Link to="/wishlist" className="relative cursor-pointer hover">
          <HeartIcon color="#fff" />
            {wishlist.length > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
      {wishlist.length}
    </span>
  )}
        </Link>
<Link to="/cart" className="relative cursor-pointer">
  <ShoppingCart color="#fff" size={24} />

  {cartItems.length > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
      {cartItems.length}
    </span>
  )}
</Link>
        {state.isAuthenticated && (
          <Link
            className="flex items-center gap-2.5 text-white"
            onClick={BecomeSeller}
          >
            <Store />
            <p>Become Seller</p>
          </Link>
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
            <DropdownMenuContent align="end" className={"w-52"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheckIcon />
                  <Link to={"/user-profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  <Link to={""}>Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <StoreIcon />
                  <Link to={"/seller/dashboard"}>Seller Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log("Sign out clicked");
                  logout();
                }}
              >
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link className="text-white" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
