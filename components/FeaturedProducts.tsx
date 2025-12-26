import { prisma } from "@/lib/db";
import FeaturedCarouselWrapper from "./FeaturedCarouselWrapper";

export default async function FeaturedProducts() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      tags: { has: "featured" },
    },
  });

  if (!featuredProducts.length) return null;

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 md:px-24 max-w-7xl">
        <h2 className="text-[#151875] dark:text-white text-2xl md:text-3xl font-bold text-center mb-10 md:mb-16 font-josefin">
          Featured Products
        </h2>
        <FeaturedCarouselWrapper products={featuredProducts} />
      </div>
    </section>
  );
}