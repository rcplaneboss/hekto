import { prisma } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import LatestProducts from "@/components/LatestProducts";
import HektoOffer from "@/components/HektoOffer";
import UniqueFeatures from "@/components/UniqueFeature";
import TrendingProducts from "@/components/TrendingProducts";
import DiscountSection from "@/components/DiscountSection";
import TopCategories from "@/components/TopCategories";
import NewsletterSection from "@/components/NewsletterSection";

export default async function Home() {
  const [allHomeProducts, activePromo, trendingPromos, topCategories, discountCategories] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { tags: { has: "featured" } },
          { tags: { has: "latest" } },
          { tags: { has: "bestseller" } },
          { tags: { has: "special" } },
          { tags: { has: "trending" } },
          { tags: { has: "mini-list" } }
        ]
      }
    }),
    prisma.promoBanner.findFirst({
      where: { isActive: true },
      include: { product: true },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.trendingPromo.findMany({
      where: { isActive: true },
      take: 2,
      orderBy: { id: 'asc' }
    }),
    // 1. Check if showOnTop is actually true in DB
    prisma.category.findMany({
      where: { showOnTop: true },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      where: { discountItem: { isNot: null } },
      include: {
        discountItem: { include: { product: true } }
      },
      orderBy: { name: 'asc' }
    })
  ]);

  // --- SERVER SIDE LOGGING ---
  console.log("---------- DATABASE CHECK ----------");
  console.log("Top Categories Count:", topCategories.length);
  if (topCategories.length > 0) {
    console.log("First Category Name:", topCategories[0].name);
    console.log("First Category Image:", topCategories[0].imageUrl);
  } else {
    console.log("WARNING: No categories found with showOnTop: true");
  }
  console.log("------------------------------------");

  const featured = allHomeProducts.filter(p => p.tags.includes("featured"));
  const latestSectionProducts = allHomeProducts.filter(p => 
    p.tags.includes("latest") || p.tags.includes("bestseller") || p.tags.includes("special")
  );
  const trendingGrid = allHomeProducts.filter(p => p.tags.includes("trending")).slice(0, 4);
  const miniList = allHomeProducts.filter(p => p.tags.includes("mini-list")).slice(0, 3);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedProducts products={featured} />
      <LatestProducts products={latestSectionProducts} />
      <HektoOffer />
      {activePromo && <UniqueFeatures promo={activePromo} />}
      <TrendingProducts 
        products={trendingGrid} 
        promos={trendingPromos} 
        miniList={miniList} 
      />
      <DiscountSection categories={discountCategories} />

      {/* Adding a 'key' here forces the component to re-render 
         completely if the data changes/arrives late.
      */}
      <TopCategories 
        key={topCategories.length} 
        categories={topCategories} 
      />

      <NewsletterSection />
    </main>
  );
}