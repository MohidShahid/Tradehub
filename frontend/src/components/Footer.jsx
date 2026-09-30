import Logo from "../assets/whitelogo1.png";
import { Copyright } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
const Footer = () => {
  return (
    <div className="bg-(--color-primary-hover) px-10 py-10 flex flex-col gap-10">
      <div className="flex flex-wrap items-start justify-start gap-20">
        <div className="flex items-center gap-3 px-5">
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
        <div className="flex flex-col gap-3 px-5">
          <h1 className="text-xl text-white font-bold">Quick Links</h1>
          <ul className="list-none text-white text-md ">
            <li>Home</li>
            <li>About Us</li>
            <li>Help and Support</li>
            <li>Terms and Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 px-5">
          <h1 className="text-xl text-white font-bold">Customer Support</h1>
          <ul className="list-none text-white text-md ">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Shopping Info</li>
            <li>Returns and Refunds</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 px-5">
          <h1 className="text-xl text-white font-bold">Follow Us</h1>
          <div className="flex gap-5 text-white">
            <FaFacebook />
            <FaInstagram />
            <FaYoutube />
            <FaLinkedin />
          </div>
        </div>
      </div>
      <div className="flex text-white border-t border-gray-400 py-5 gap-2">
       <Copyright />Tradehub All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
