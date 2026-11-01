import { Button } from "./ui/button";
import Hero from "../assets/Hero.png";
import Hero2 from "../assets/Hero2.png";

const HeroSection = () => {
  return (
    <div className="">
    <div className=" h-96 flex items-center justify-between md:px-10 px-5">
        <div>
            <p className=" font-medium text-(--color-primary-hover)">Welcome to tradehub</p>
            <h1 className="font-bold text-(--color-primary-hover) text-4xl">Shop from Multiple Sellers, <br/> All in <p className="text-(--color-accent) inline-flex">One Place</p></h1>
            <p className="text-(--color-text-secondary) pt-3.5">Discover amazing products, support independent sellers,<br/> and enjoy a seamless shopping experience</p>
            <Button className={"bg-(--color-accent) mt-6 py-5 px-6 rounded-3xl cursor-pointer hover:bg-transparent hover:border-(--color-accent) hover:text-(--color-accent)"}>Shop Now</Button>
        </div>
        <img src={Hero2} alt="" className="w-[55%] md:block hidden" />
     
    </div>
    </div>
  )
}

export default HeroSection