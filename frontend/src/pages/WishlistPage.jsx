import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WishlistSection from "@/components/Wishlist/WishlistSection";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/productService";
import { products as fallbackProducts } from "@/static/data";
import { getProductId } from "@/utils/helpers";

const WishlistPage = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    let active = true;

    const loadRecommended = async () => {
      try {
        const res = await getProducts({ page: 1, limit: 6 });
        const apiProducts = res?.data?.data;
        if (active && Array.isArray(apiProducts) && apiProducts.length > 0) {
          setRecommendedProducts(apiProducts.slice(0, 6));
          return;
        }
      } catch {
        // Fall back to curated static catalog when API is unavailable
      }

      if (active) {
        setRecommendedProducts(fallbackProducts.slice(0, 6));
      }
    };

    loadRecommended();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-[calc(100dvh-6rem)] bg-gray-50/70 px-4 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-12">
        <div>
          {/* Breadcrumb */}
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Wishlist</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Main Wishlist Manager */}
          <WishlistSection />
        </div>

        {/* Discovery Section */}
        {recommendedProducts.length > 0 && (
          <section
            aria-labelledby="wishlist-recommended-heading"
            className="border-t border-gray-200/80 pt-8"
          >
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-(--color-accent)">
                  <Sparkles size={12} aria-hidden="true" />
                  Picked For You
                </div>
                <h2
                  id="wishlist-recommended-heading"
                  className="text-xl font-bold text-gray-900 sm:text-2xl [text-wrap:balance]"
                >
                  Popular Picks You Might{" "}
                  <span className="text-(--color-accent)">Love</span>
                </h2>
              </div>

              <Link
                to="/"
                className="group inline-flex w-fit items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-(--color-primary) shadow-2xs transition hover:border-(--color-primary) hover:bg-(--color-primary) hover:text-white sm:text-sm"
              >
                <span>Browse All</span>
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
              {recommendedProducts.map((product, index) => (
                <ProductCard
                  key={getProductId(product) || index}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
