import { CategoryArray } from "@/static/Categories";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Store,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Categories = () => {
  return (
    <section className="w-full px-5 md:px-10 py-12 md:py-16 bg-gray-50/70 border-b border-gray-100">
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-(--color-primary-light) px-3 py-1 text-xs font-semibold text-(--color-primary)">
              <Sparkles size={13} className="text-(--color-accent)" />
              <span>Explore Marketplace</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Shop by <span className="text-(--color-accent)">Category</span>
            </h2>

            <p className="mt-1.5 text-sm md:text-base text-(--color-text-secondary)">
              Browse millions of products across top departments from verified
              independent sellers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/categories"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-(--color-primary) shadow-xs border border-gray-200/80 transition-all hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) hover:shadow-md"
            >
              <span>All Categories</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Amazon-style Full-Card Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {CategoryArray.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative flex aspect-3/4 sm:aspect-4/5 w-full flex-col justify-end overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-900 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              {/* Full-bleed Background Image */}
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/50" />

              {/* Hover Indicator Badge */}
              <div className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 backdrop-blur-md text-white/80 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-(--color-primary) group-hover:text-white">
                <ArrowUpRight size={14} />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-4 sm:p-5">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight transition-colors duration-200 group-hover:text-emerald-300">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-gray-200/90">
                      {category.subtitle}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-300 group-hover:bg-(--color-accent) group-hover:scale-105 group-hover:text-white">
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
