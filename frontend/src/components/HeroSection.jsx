import { Button } from "./ui/button";
import Hero from "../assets/Hero.png";


const HeroSection = () => {
  return (
    <div className="">
    <div className="bg-(--color-primary-light) h-80 flex items-center justify-between px-10">
        <div>
            <p className="uppercase font-medium text-(--color-primary-hover)">Welcome to tradehub</p>
            <h1 className="font-bold text-(--color-primary-hover) text-4xl">Shop from Multiple Sellers, <br/> All in <p className="text-(--color-accent) inline-flex">One Place</p></h1>
            <p className="text-(--color-text-secondary) pt-3.5">Discover amazing products, support independent sellers,<br/> and enjoy a seamless shopping experience</p>
            <Button className={"bg-(--color-accent) mt-6 py-5 px-3.5 cursor-pointer"}>Start Shopping</Button>
        </div>
        <img src={Hero} alt="" className="w-[60%]" />
     
    </div>
    </div>
  )
}

export default HeroSection