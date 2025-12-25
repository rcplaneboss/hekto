import { prisma } from "@/lib/db";
import FeaturedProductCard from "./FeaturedProductCard";

export default async function FeaturedProducts() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      tags: { has: "featured" },
    },
    take: 5,
  });

  if (!featuredProducts.length) return null;

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors duration-300 ">
      <div className="container mx-auto px-24 max-md:px-4 max-w-7xl">
        <h2 className="text-[#151875] dark:text-white text-2xl md:text-3xl font-bold text-center mb-10 md:mb-16 font-josefin">
          Featured Products
        </h2>
        
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                i === 0 ? "w-6 bg-[#FB2E86]" : "w-4 bg-[#FEBAD7] dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}