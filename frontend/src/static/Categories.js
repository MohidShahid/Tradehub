import {
  Laptop,
  Shirt,
  Sofa,
  Sparkles,
  Dumbbell,
  Gamepad2,
  ShoppingBasket,
  Car,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

const CategoryArray = [
  {
    name: "Electronics",
    link: "/category/electronics",
    icon: Laptop,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Fashion",
    link: "/category/fashion",
    icon: Shirt,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Home & Living",
    link: "/category/home-living",
    icon: Sofa,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Beauty & Health",
    link: "/category/beauty-health",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Sports",
    link: "/category/sports",
    icon: Dumbbell,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Toys & Games",
    link: "/category/toys-games",
    icon: Gamepad2,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Groceries",
    link: "/category/groceries",
    icon: ShoppingBasket,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Automotive",
    link: "/category/automotive",
    icon: Car,
    color: "bg-sky-100 text-sky-600",
  },
  {
    name: "Books",
    link: "/category/books",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "More",
    link: "/categories",
    icon: MoreHorizontal,
    color: "bg-gray-100 text-gray-600",
  },
];

export { CategoryArray };