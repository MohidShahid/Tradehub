import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProducts } from "@/services/productService";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await getProducts({ page: 1, limit: 12 });
        setProducts(res?.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProducts();
  }, []);

  return (
    <section className="w-full px-5 md:px-10 py-10 md:py-14 bg-white border-b border-gray-100">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Featured <span className="text-(--color-accent)">Products</span>
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-(--color-text-secondary)">
              Explore top-rated products curated from verified independent merchants.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-(--color-primary) shadow-xs border border-gray-200/80 transition-all hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary)"
          >
            <span>View All</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* 2 per row on mobile, 3-4 on tablet, 5-6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4">
          {products.map((product, i) => (
            <ProductCard
              product={product}
              key={product._id || product.id || i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
