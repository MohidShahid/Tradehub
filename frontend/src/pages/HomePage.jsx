import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FlashSales from "@/components/FlashSales";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Categories />
      <FlashSales />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}

export default HomePage;