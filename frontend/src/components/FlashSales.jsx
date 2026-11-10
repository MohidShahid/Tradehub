import { useState, useEffect } from "react";
import { Zap, Timer, ArrowRight, Flame } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "../static/data";
import { Link } from "react-router-dom";

const FlashSales = () => {
  const [countDownTime, setCountDownTime] = useState({
    Days: "01",
    Hours: "14",
    Minutes: "36",
    Seconds: "45",
  });

  useEffect(() => {
    // Dynamic rolling countdown ending at midnight
    const getTargetTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      return target.getTime();
    };

    let targetTime = getTargetTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      let distance = targetTime - now;

      if (distance <= 0) {
        targetTime = getTargetTime();
        distance = targetTime - now;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountDownTime({
        Days: String(Math.max(0, days)).padStart(2, "0"),
        Hours: String(Math.max(0, hours)).padStart(2, "0"),
        Minutes: String(Math.max(0, minutes)).padStart(2, "0"),
        Seconds: String(Math.max(0, seconds)).padStart(2, "0"),
      });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <section className="w-full px-5 md:px-10 py-10 md:py-14 bg-linear-to-b from-orange-50/60 via-amber-50/20 to-white border-b border-gray-100">
      <div className="w-full">
        {/* Flash Sale Header Bar */}
        <div className="mb-6 md:mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          {/* Title & Description */}
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-orange-100/90 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-200">
              <Flame size={13} className="text-orange-600 fill-orange-500 animate-pulse" />
              <span>Limited Time Offers</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-(--color-accent) text-white shadow-md shadow-orange-500/20">
                <Zap size={24} fill="currentColor" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Flash <span className="text-(--color-accent)">Sales</span>
              </h2>
            </div>

            <p className="mt-2 text-xs sm:text-sm md:text-base text-(--color-text-secondary) max-w-xl">
              Limited-time deals with steep discounts from top verified sellers. Grab yours before stock runs out!
            </p>
          </div>

          {/* Countdown Clock & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
            {/* Clear, Bold Countdown Unit */}
            <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-orange-200/90 bg-white p-2.5 sm:p-3 shadow-xs">
              <div className="flex flex-col justify-center px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                  <Timer size={13} className="animate-pulse" />
                  Ends In
                </span>
                <span className="text-[11px] font-medium text-gray-400">Daily Deals</span>
              </div>

              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gray-900 font-mono text-base sm:text-lg font-bold text-white shadow-xs">
                  {countDownTime.Days}
                </div>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Days
                </span>
              </div>

              <span className="pb-4 text-base font-bold text-gray-300">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gray-900 font-mono text-base sm:text-lg font-bold text-white shadow-xs">
                  {countDownTime.Hours}
                </div>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Hours
                </span>
              </div>

              <span className="pb-4 text-base font-bold text-gray-300">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gray-900 font-mono text-base sm:text-lg font-bold text-white shadow-xs">
                  {countDownTime.Minutes}
                </div>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Mins
                </span>
              </div>

              <span className="pb-4 text-base font-bold text-gray-300">:</span>

              {/* Seconds (Highlighted in Accent Orange) */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-(--color-accent) font-mono text-base sm:text-lg font-bold text-white shadow-xs shadow-orange-500/20">
                  {countDownTime.Seconds}
                </div>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-orange-600">
                  Secs
                </span>
              </div>
            </div>

            {/* View All Deals Button */}
            <Link
              to="/deals"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-(--color-primary) shadow-xs border border-gray-200/80 transition-all hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) hover:shadow-md"
            >
              <span>View All</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* 2 per row on mobile, 3-4 on tablet, 5-6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSales;
