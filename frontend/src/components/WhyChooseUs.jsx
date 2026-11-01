import { ShieldCheck, Truck, Headphones, BadgeCheck } from "lucide-react";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Verified Sellers",
      description: "Shop with confidence from trusted sellers.",
    },
    {
      icon: BadgeCheck,
      title: "Quality Products",
      description: "Discover products worth your money.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your orders delivered right to your door.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "We're here whenever you need assistance.",
    },
  ];

  return (
    <section className="bg-(--color-primary-light) px-4 sm:px-6 md:px-10 py-8 md:py-10">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-start md:items-center gap-8 md:gap-10">
        {/* Introduction */}
        <div className="w-full md:w-[28%] shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-(--color-primary)">
            Why Choose TradeHub?
          </h2>

          <p className="mt-2 text-sm leading-6 text-(--color-text-secondary)">
            More than just a marketplace — we're a community of buyers, sellers,
            and creators.
          </p>
        </div>

        {/* Benefits */}
        <div className="w-full grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-xs">
                  <Icon size={22} className="text-(--color-primary)" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-(--color-text-secondary)">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
