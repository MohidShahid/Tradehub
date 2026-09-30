import Logo from "../assets/whitelogo1.png";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import { HeartIcon, Store, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
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

const Navbar = () => {
  const state = useSelector((state) => state.user);
  const [removeRounded, setRemoveRounded] = useState(false);
  const inputRef = useRef(null);

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

  return (
    <div className="h-24 bg-(--color-primary-hover) px-5 py-5 flex items-center justify-between">
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
      <div className="flex items-center justify-between text-sm gap-6 cursor-pointer">
        <HeartIcon color="#fff" />
        <ShoppingCart color="#fff" />
        {!state.isAuthenticated && !state.user && (
          <Link
            className="flex items-center gap-2.5 text-white"
            to={"/create-seller"}
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
                    <AvatarImage src={state.user.profilePic} alt="shadcn" />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheckIcon />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
