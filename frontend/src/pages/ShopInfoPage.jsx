
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  MapPin,
  Star,
  Heart,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShoppingBag,
  Store,

  Package,

  Clock,
  ArrowUpDown,

} from "lucide-react";

import { products } from "@/static/data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const demoShop = {
  id: "saga-cars",
  name: "Saga Store",
  tagline: "Quality products, honest prices.",
  description:
    "Welcome to our shop! We believe in offering quality products, dependable service, and a smooth shopping experience. Explore our collection and discover something you love.",
  logo: "",
  cover: "",
  address: "Main Boulevard, Gulberg",
  city: "Lahore",
  province: "Punjab",
  country: "Pakistan",
  rating: 4.8,
  reviewCount: 248,
  totalSales: 1250,
  joined: "January 2025",
  responseTime: "Usually responds within a few hours",
  verified: true,
  categories: ["All Products", "Electronics", "Fashion", "Home & Living"],
};

// Adapt these fields to match your own product and shop models.
const getProductInfo = (product) => ({
  id: product.id ?? product._id,
  name: product.name ?? product.title ?? "Product",
  image:
    product.image ??
    product.images?.[0] ??
    product.thumbnail ??
    "",
  price: Number(product.price) || 0,
  oldPrice: Number(product.originalPrice ?? product.oldPrice) || 0,
  category: product.category ?? "Other",
  rating: Number(product.rating) || 0,
  sellerId:
    product.shopId ??
    product.sellerId ??
    product.shop?._id ??
    product.seller?._id ??
    product.shop?.id ??
    product.seller?.id ??
    null,
  sellerName:
    product.shopName ??
    product.sellerName ??
    product.shop?.name ??
    (typeof product.seller === "string" ? product.seller : ""),
});

const formatPrice = (price) =>
  `Rs. ${Number(price).toLocaleString("en-PK")}`;

const ShopInfoPage = () => {
  const { shopId } = useParams();

  const [activeTab, setActiveTab] = useState("products");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState([]);

  // Replace this demo object with your actual shop data from your API.
  const shop = demoShop;

  const allProducts = useMemo(
    () => products.map(getProductInfo),
    [],
  );

  // Prefer filtering by the real shop ID. Name matching is a fallback
  // for static/demo data that doesn't yet contain shop IDs.
  const shopProducts = useMemo(() => {
    if (!shop) return [];

    const idMatches = allProducts.filter(
      (product) =>
        product.sellerId != null &&
        String(product.sellerId) === String(shopId ?? shop.id),
    );

    if (idMatches.length > 0) return idMatches;

    return allProducts.filter(
      (product) =>
        product.sellerName.trim().toLowerCase() ===
        shop.name.trim().toLowerCase(),
    );
  }, [allProducts, shop, shopId]);

  const categories = useMemo(
    () => [
      "all",
      ...new Set(shopProducts.map((product) => product.category)),
    ],
    [shopProducts],
  );

  const filteredProducts = useMemo(() => {
    let result = shopProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [shopProducts, search, category, sortBy]);

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  if (!shop) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Store className="mb-4 size-14 text-stone-300" />
        <h1 className="text-2xl font-bold text-stone-900">
          Shop not found
        </h1>
        <p className="mt-2 text-stone-500">
          This shop may no longer be available.
        </p>
        <Button asChild className="mt-5 bg-green-800 hover:bg-green-900">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 pb-16 text-stone-800">
      {/* Breadcrumb */}
      <div className="border-b border-stone-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm sm:px-6 lg:px-8">
          <Link to="/" className="text-stone-500 hover:text-green-800">
            Home
          </Link>
          <ChevronRight className="size-4 text-stone-300" />
          <span className="font-medium text-green-900">Shop</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Shop cover */}
        <section className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="relative h-40 overflow-hidden bg-gradient-to-r from-green-950 via-green-800 to-emerald-700 sm:h-56 mb-10">
            {shop.cover ? (
              <img
                src={shop.cover}
                alt={`${shop.name} cover`}
                className="size-full object-cover"
              />
            ) : (
              <>
                <div className="absolute -right-10 -top-24 size-72 rounded-full bg-white/5" />
                <div className="absolute right-36 top-16 size-36 rounded-full bg-orange-400/20 blur-2xl" />
                <div className="absolute bottom-0 left-1/3 h-20 w-64 rounded-full bg-emerald-400/10 blur-2xl" />
                <Store className="absolute bottom-4 right-8 size-24 text-white/10 sm:right-20 sm:size-36" />
                <p className="absolute bottom-5 left-5 text-sm font-medium tracking-widest text-white/70 sm:bottom-8 sm:left-10">
                  DISCOVER SOMETHING YOU LOVE
                </p>
              </>
            )}
          </div>

          {/* Shop profile */}
          <div className="px-5 pb-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="-mt-12 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-green-50 shadow-md sm:-mt-14 sm:size-28">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={`${shop.name} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  <Store className="size-11 text-green-800 sm:size-14" />
                )}
              </div>

              <div className="min-w-0 flex-1 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                    {shop.name}
                  </h1>

                  {shop.verified && (
                    <Badge className="gap-1 border-0 bg-green-100 text-green-800 hover:bg-green-100">
                      <BadgeCheck className="size-3.5" />
                      Verified Seller
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-sm text-stone-500">
                  {shop.tagline}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 fill-orange-400 text-orange-400" />
                    <strong>{shop.rating}</strong>
                    <span className="text-stone-500">
                      ({shop.reviewCount} reviews)
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5 text-stone-500">
                    <ShoppingBag className="size-4" />
                    {shop.totalSales.toLocaleString()} sales
                  </span>

                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Package className="size-4" />
                    {shopProducts.length} products
                  </span>
                </div>
              </div>

              <div className="flex gap-2 sm:pb-1">
                <Button
                  type="button"
                  className="flex-1 bg-orange-500 text-white hover:bg-orange-600 sm:flex-none"
                  onClick={() =>
                    document
                      .getElementById("shop-products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <ShoppingBag className="mr-2 size-4" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>



        {/* Main content */}
        <div className="mt-8 grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Shop sidebar */}
          <aside className="space-y-5">
            <Card className="rounded-xl border-stone-200 shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-stone-900">
                  About this shop
                </h2>

                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {shop.description}
                </p>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-green-800" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Shop Address
                      </p>
                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        {shop.address}
                        <br />
                        {shop.city}, {shop.province}
                        <br />
                        {shop.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Store className="mt-0.5 size-5 shrink-0 text-green-800" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Store Name
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {shop.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-green-800" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Response Time
                      </p>
                      <p className="mt-1 text-sm leading-5 text-stone-500">
                        {shop.responseTime}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products and shop tabs */}
          <section id="shop-products" className="min-w-0 scroll-mt-5">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-stone-200">
                <TabsList className="h-auto w-full justify-start gap-5 overflow-x-auto rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="products"
                    className="rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-green-800 data-[state=active]:bg-transparent data-[state=active]:text-green-900 data-[state=active]:shadow-none"
                  >
                    Products ({shopProducts.length})
                  </TabsTrigger>


                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-green-800 data-[state=active]:bg-transparent data-[state=active]:text-green-900 data-[state=active]:shadow-none"
                  >
                    Reviews ({shop.reviewCount})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="products" className="mt-6">
                <div className="mb-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Shop Products
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        Explore products available from this seller.
                      </p>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full bg-white sm:w-48">
                        <ArrowUpDown className="mr-2 size-4 text-stone-500" />
                        <SelectValue placeholder="Sort products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="rating">
                          Highest Rated
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={`Search products in ${shop.name}...`}
                      className="h-11 border-stone-200 bg-white pl-10 focus-visible:ring-green-800"
                    />
                  </div>

                  {/* Category filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <SlidersHorizontal className="size-4 shrink-0 text-stone-500" />

                    {categories.map((item) => {
                      const selected =
                        item === "all"
                          ? category === "all"
                          : category === item;

                      return (
                        <Button
                          key={item}
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          onClick={() => setCategory(item)}
                          className={
                            selected
                              ? "shrink-0 bg-green-800 hover:bg-green-900"
                              : "shrink-0 border-stone-200 bg-white text-stone-600 hover:bg-green-50 hover:text-green-800"
                          }
                        >
                          {item === "all" ? "All Products" : item}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {filteredProducts.map((item) => {
                      const discount =
                        item.oldPrice > item.price
                          ? Math.round(
                              ((item.oldPrice - item.price) /
                                item.oldPrice) *
                                100,
                            )
                          : 0;

                      const slug = item.name
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");

                      return (
                        <Card
                          key={item.id}
                          className="group min-w-0 overflow-hidden rounded-xl border-stone-200 bg-white shadow-none transition duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                          <CardContent className="p-0">
                            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-stone-50 p-3 sm:p-5">
                              {discount > 0 && (
                                <Badge className="absolute left-2 top-2 z-10 border-0 bg-orange-500 px-2 text-white hover:bg-orange-500 sm:left-3 sm:top-3">
                                  -{discount}%
                                </Badge>
                              )}

                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                aria-label={
                                  wishlist.includes(item.id)
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                                }
                                onClick={() => toggleWishlist(item.id)}
                                className="absolute right-2 top-2 z-10 size-8 rounded-full bg-white shadow-sm hover:bg-white sm:right-3 sm:top-3"
                              >
                                <Heart
                                  className={`size-4 ${
                                    wishlist.includes(item.id)
                                      ? "fill-orange-500 text-orange-500"
                                      : "text-stone-600"
                                  }`}
                                />
                              </Button>

                              {item.image ? (
                                <Link
                                  to={`/products/${slug}/${item.id}`}
                                  className="flex size-full items-center justify-center"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                    className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </Link>
                              ) : (
                                <Package className="size-12 text-stone-300" />
                              )}
                            </div>

                            <div className="p-3 sm:p-4">
                              <p className="text-xs text-stone-500">
                                {item.category}
                              </p>

                              <Link
                                to={`/products/${slug}/${item.id}`}
                                className="mt-1 block"
                              >
                                <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-stone-800 transition hover:text-green-800">
                                  {item.name}
                                </h3>
                              </Link>

                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="font-bold text-green-900">
                                  {formatPrice(item.price)}
                                </span>

                                {item.oldPrice > item.price && (
                                  <span className="text-xs text-stone-400 line-through">
                                    {formatPrice(item.oldPrice)}
                                  </span>
                                )}
                              </div>

                              <div className="mt-2 flex items-center gap-1 text-xs text-stone-500">
                                <Star className="size-3.5 fill-orange-400 text-orange-400" />
                                {item.rating
                                  ? item.rating.toFixed(1)
                                  : "New product"}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-14 text-center">
                    <Package className="mx-auto size-12 text-stone-300" />
                    <h3 className="mt-4 font-semibold text-stone-900">
                      No products found
                    </h3>
                    <p className="mt-2 text-sm text-stone-500">
                      Try another search term or category.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearch("");
                        setCategory("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card className="rounded-xl border-stone-200 bg-white shadow-none">
                  <CardContent className="p-5 sm:p-7">
                    <h2 className="text-xl font-bold text-stone-900">
                      About {shop.name}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      {shop.description}
                    </p>

                    <Separator className="my-6" />

                    <h3 className="font-semibold text-stone-900">
                      Shop Location
                    </h3>

                    <div className="mt-3 flex items-start gap-3 text-sm text-stone-600">
                      <MapPin className="mt-0.5 size-5 shrink-0 text-green-800" />
                      <p>
                        {shop.address}, {shop.city}, {shop.province},{" "}
                        {shop.country}
                      </p>
                    </div>

                    <p className="mt-5 text-sm text-stone-500">
                      Shop member since {shop.joined}.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="rounded-xl border-stone-200 bg-white shadow-none">
                  <CardContent className="p-5 sm:p-7">
                    <h2 className="text-xl font-bold text-stone-900">
                      Customer Reviews
                    </h2>

                    <div className="mt-5 flex flex-wrap items-center gap-5">
                      <div>
                        <p className="text-4xl font-bold text-stone-900">
                          {shop.rating}
                          <span className="text-lg font-normal text-stone-400">
                            /5
                          </span>
                        </p>

                        <div className="mt-2 flex gap-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              className={`size-4 ${
                                index < Math.round(shop.rating)
                                  ? "fill-orange-400 text-orange-400"
                                  : "text-stone-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <Separator
                        orientation="vertical"
                        className="hidden h-16 sm:block"
                      />

                      <p className="max-w-sm text-sm leading-6 text-stone-500">
                        Based on {shop.reviewCount} shop reviews. Connect your
                        reviews API to show individual buyer feedback,
                        verified purchases, and review dates.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ShopInfoPage;
