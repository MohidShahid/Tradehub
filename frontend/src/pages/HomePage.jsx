
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FlashSales from "@/components/FlashSales";

import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <Categories />
      <FlashSales />
      <FeaturedProducts />
      <WhyChooseUs />
    </div>
  )
}

export default HomePage;