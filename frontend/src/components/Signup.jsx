import { useState } from "react";
import { FaShop, FaTruck } from "react-icons/fa6";
import { ShieldCheck } from "lucide-react";
import ShopCover from "../assets/ShopCover.png";
import { UserTypeChoice } from "./UserTypeChoice";
import { CreateVendorAccount } from "@/Routes";
import CreateBuyerAccount from "./CreateBuyerAccount";

const Signup = () => {
  const [step, setStep] = useState(1);
  // const fileInputRef = useRef(null);
  const [userType, setUserType] = useState("buyer");


  return (
    <div className="flex items-start justify-start gap-20 h-dvh ">
      <div className="flex justify-between w-[55%] pr-4 py-10 h-screen bg-(--color-primary-light) px-10">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <h1 className="text-3xl text-(--color-primary) inline-fit">
              Join Tradehub <br /> and be a part of growing
              <br />{" "}
              <span className="text-(--color-accent) font-bold">
                marketplace community
              </span>
            </h1>
            <ul className="flex gap-4 text-sm pr-5">
              <li>Shop</li>
              <li>Sell</li>
              <li>Grow</li>
            </ul>
          </div>
          <p className="">
            Weather your'e a buyer or seller, Tradehub connects you with the
            best <br />
            products and trusted vendors -- all in one place
          </p>
          <div className="flex gap-10 pt-10">
            <div className="flex gap-4">
              <FaShop size={30} className="text-(--color-primary)" />{" "}
              <p className="text-sm">
                Multiple
                <br />
                Vendors
              </p>
            </div>
            <div className="flex gap-4">
              <ShieldCheck size={30} className="text-(--color-primary)" />{" "}
              <p className="text-sm">
                Secure
                <br />
                Transactions
              </p>
            </div>
            <div className="flex gap-4">
              <FaTruck size={30} className="text-(--color-primary)" />{" "}
              <p className="text-sm">
                Fastest & Reliable
                <br />
                Delivery
              </p>
            </div>
          </div>
          <img src={ShopCover} alt="" className="pt-5" />
        </div>
      </div>
      {step == 1 && (
        <UserTypeChoice
          setStep={setStep}
          userType={userType}
          setUserType={setUserType}
        />
      )}
      {step == 2 &&  userType == "buyer" && (<CreateBuyerAccount />)}

      {step == 3 && userType == "vendor" && (<CreateVendorAccount />)}
    </div>
  );
};

export default Signup;
