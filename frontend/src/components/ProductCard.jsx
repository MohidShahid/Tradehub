import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

const ProductCard = ({ product }) => {
  return (
    <div className="w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      
      {/* Product Image */}
      <div className="relative flex h-48 items-center justify-center rounded-xl bg-gray-50">
        <img
          src={product.image}
          alt="Nike Air Shoes"
          className="h-40 w-40 object-contain"
        />

        {/* Wishlist */}
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100 cursor-pointer"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Product Information */}
      <div className="mt-3 space-y-2">

        {/* Product Name */}
        <h2 className="truncate text-base font-semibold text-gray-900">
         {product.name}
        </h2>

        {/* Seller */}
        {/* <div className="flex items-center gap-1.5 text-sm text-(--color-text-secondary)">
          <Store size={15} />
          <span>Saga Cars</span>
        </div> */}

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            <Star
              size={16}
              className="text-yellow-400"
              fill="currentColor"
            />
            <span className="font-medium text-gray-700">{product.rating}</span>
          </div>

          <span className="text-gray-300">|</span>

          <span className="text-(--color-text-secondary)">
            {product.reviews} reviews
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-(--color-primary)">
            ${product.price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ${product.oldPrice}
          </span>

          <span className="text-xs font-semibold text-green-600">
            {Math.floor(((product.oldPrice - product.price)/ product.oldPrice ) * 100)}% OFF
          </span>
        </div>

        {/* Add to Cart */}
        <Button className="mt-1 w-full cursor-pointer bg-(--color-accent)">
          <ShoppingCart size={17} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;