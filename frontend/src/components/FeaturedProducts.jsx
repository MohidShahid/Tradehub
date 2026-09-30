import { products } from "@/static/data";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const FeaturedProducts = () => {
  return (
    <div className="py-20 px-10">
        <div className="flex justify-between">
      <h1 className="text-3xl font-bold  text-(--color-primary)">
        Featured{" "}
        <span className="text-(--color-primary-light-hover)">Products</span>
      </h1>
      <Link className="flex gap-1.5 items-center text-(--color-primary)">View All <ArrowRight size={18}/></Link>
      </div>
       <div className="flex items-center flex-wrap gap-3 pt-8">
        {
            products.map((product, i)=>{
                return (
                    <ProductCard product={product} key={i} />
                )
            })
        }
       </div>
    </div>
  );
};

export default FeaturedProducts;
