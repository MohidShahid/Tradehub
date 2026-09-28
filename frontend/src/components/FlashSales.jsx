import { useState } from "react";
import { Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import {products } from "../static/data"
const FlashSales = () => {
  const [countDownTime, setCountDownTime] = useState({
    Days: "",
    Hours: "",
    Minutes: "",
    Seconds: "",
  });
  setInterval(() => {
    let CountDownDate = new Date("Oct 5, 2026 15:37:25").getTime();
    let now = new Date().getTime();
    let distance = CountDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    setCountDownTime({
      Days: days,
      Hours: hours,
      Minutes: minutes,
      Seconds: seconds,
    });
  }, 1000);
  return (
    <div className="px-10 py-10 bg-(--color-primary-light)">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2.5 items-center">
          <Zap className="text-white p-2 rounded-full bg-(--color-accent) " size={50} />{" "}
          <h1 className="text-3xl font-bold text-(--color-primary) ">
            Flash <span className="text-(--color-accent)">Sales</span>
          </h1>
        </div>
        <p className="text-(--color-text-secondary)">Limited time offers. Unbeatable deals. Don't miss out!</p>
        <div className="flex items-center gap-5 py-10">
          {Object.keys(countDownTime).map((i) => {
            return (
              <div className="border border-(--color-bg-secondary) bg-white p-3 rounded-xl flex items-center justify-center flex-col ">
                <h3 className="text-2xl font-bold text-(--color-primary)">
                  {countDownTime[i]}
                </h3>
                <p className="text-sm text-(--color-text-secondary)">{i}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-7 ">
      {
        products.map((product)=>{
            return(
             <ProductCard product={product} />
            )
        })
      }
      </div>
    </div>
  );
};

export default FlashSales;
