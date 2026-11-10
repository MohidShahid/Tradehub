import { useState } from "react";
import Logo from "../assets/whitelogo1.png";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-(--color-primary-hover) text-white border-t border-white/10">
      {/* Top Value / Trust Highlights Strip (Aligned px-5 md:px-10) */}
      <div className="w-full border-b border-white/15 px-5 md:px-10 py-6">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Nationwide Shipping</h4>
              <p className="text-[11px] text-emerald-100/80">Fast delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Buyer Protection</h4>
              <p className="text-[11px] text-emerald-100/80">Secure escrow payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Easy Returns</h4>
              <p className="text-[11px] text-emerald-100/80">7-day hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">24/7 Support</h4>
              <p className="text-[11px] text-emerald-100/80">Dedicated customer assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter (Aligned px-5 md:px-10) */}
      <div className="w-full px-5 md:px-10 py-12 md:py-16">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand Info (Left-aligned) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={Logo} alt="TradeHub" width={42} height={42} className="object-contain" />
              <div>
                <span className="flex text-2xl font-extrabold tracking-tight">
                  <span className="text-white">Trade</span>
                  <span className="text-(--color-accent)">Hub</span>
                </span>
                <p className="text-[9px] uppercase tracking-wider text-emerald-200 font-semibold">
                  Multiple Sellers • One Marketplace
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed max-w-sm">
              TradeHub connects independent sellers and verified creators with shoppers across Pakistan.
              Discover unique products, compare seller offers, and enjoy a seamless marketplace experience.
            </p>

            {/* Contact Details */}
            <div className="space-y-2 pt-1 text-xs sm:text-sm text-emerald-50/90">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-(--color-accent) shrink-0" />
                <span>Gulberg III, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-(--color-accent) shrink-0" />
                <span>+92 (300) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-(--color-accent) shrink-0" />
                <span>support@tradehub.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-2.5">
                Follow Us
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-(--color-accent) hover:scale-105"
                >
                  <FaFacebookF size={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-(--color-accent) hover:scale-105"
                >
                  <FaInstagram size={14} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-(--color-accent) hover:scale-105"
                >
                  <FaYoutube size={14} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-(--color-accent) hover:scale-105"
                >
                  <FaLinkedinIn size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Shop & Explore
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-50/90">
              <li>
                <Link to="/" className="transition-colors hover:text-(--color-accent)">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="transition-colors hover:text-(--color-accent)">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/deals" className="transition-colors hover:text-(--color-accent)">
                  Flash Sales & Deals
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition-colors hover:text-(--color-accent)">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition-colors hover:text-(--color-accent)">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/user-profile" className="transition-colors hover:text-(--color-accent)">
                  Track My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-50/90">
              <li>
                <Link to="/help" className="transition-colors hover:text-(--color-accent)">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="transition-colors hover:text-(--color-accent)">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="transition-colors hover:text-(--color-accent)">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-(--color-accent)">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-(--color-accent)">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-(--color-accent)">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sell & Newsletter */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Sell on TradeHub
              </h3>
              <p className="text-xs text-emerald-50/90">
                Reach thousands of buyers. Open your verified shop today.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-(--color-accent) px-3 py-1.5 rounded-lg hover:bg-(--color-accent-hover) transition-all shadow-xs"
              >
                <span>Register as a Seller</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Mini Newsletter Box */}
            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1.5">
                Stay in the Loop
              </h3>
              <p className="text-xs text-emerald-100/80 mb-2.5">
                Subscribe for exclusive discounts & seller deals.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 rounded-xl bg-white/20 border border-white/30 p-2.5 text-xs text-white">
                  <Check size={16} />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <div className="flex items-center rounded-xl bg-white/15 border border-white/25 focus-within:border-white p-1 transition-all">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent px-2.5 py-1 text-xs text-white placeholder-emerald-100/70 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--color-accent) text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-100/70">No spam. Unsubscribe anytime.</span>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges (Aligned px-5 md:px-10) */}
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/80">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-white font-medium">TradeHub</span>. All rights reserved. Multiple Sellers • One Marketplace.
          </p>

          {/* Payment & Trust Pills */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
              Cash on Delivery
            </span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
              Visa
            </span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
              Mastercard
            </span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
              EasyPaisa
            </span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
              JazzCash
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
