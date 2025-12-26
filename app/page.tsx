import { prisma } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import LatestProducts from "@/components/LatestProducts";
import HektoOffer from "@/components/HektoOffer";
import UniqueFeatures from "@/components/UniqueFeature";
import TrendingProducts from "@/components/TrendingProducts";

export default async function Home() {
  // 1. Fetch data in parallel
  const [allHomeProducts, activePromo, trendingPromos] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { tags: { has: "featured" } },
          { tags: { has: "latest" } },
          { tags: { has: "bestseller" } },
          { tags: { has: "special" } },
          { tags: { has: "trending" } }, // Added trending tag
          { tags: { has: "mini-list" } } // Added for the sidebar mini list
        ]
      }
    }),
    prisma.promoBanner.findFirst({
      where: { isActive: true },
      include: { product: true },
      orderBy: { updatedAt: 'desc' }
    }),
    // Fetch the two promo boxes (23% off, etc) from the new schema
    prisma.trendingPromo.findMany({
      where: { isActive: true },
      take: 2,
      orderBy: { id: 'asc' }
    })
  ]);

  // 2. Filter products locally
  const featured = allHomeProducts.filter(p => p.tags.includes("featured"));
  
  const latestSectionProducts = allHomeProducts.filter(p => 
    p.tags.includes("latest") || 
    p.tags.includes("bestseller") || 
    p.tags.includes("special")
  );

  // Trending Grid: Top 4 products
  const trendingGrid = allHomeProducts
    .filter(p => p.tags.includes("trending"))
    .slice(0, 4);

  // Sidebar Mini List: 3 products
  const miniList = allHomeProducts
    .filter(p => p.tags.includes("mini-list"))
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <FeaturedProducts products={featured} />
      
      <LatestProducts products={latestSectionProducts} />
      
      <HektoOffer />
      
      {activePromo && <UniqueFeatures promo={activePromo} />}

      {/* 3. Pass all parts to the TrendingProducts component */}
      <TrendingProducts 
        products={trendingGrid} 
        promos={trendingPromos} 
        miniList={miniList} 
      />
    </main>
  );
}