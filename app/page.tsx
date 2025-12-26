import { prisma } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import LatestProducts from "@/components/LatestProducts";
import HektoOffer from "@/components/HektoOffer";
import UniqueFeatures from "@/components/UniqueFeature";

export default async function Home() {
  // 1. Fetch Products and the Active Promo Banner in parallel for better performance
  const [allHomeProducts, activePromo] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { tags: { has: "featured" } },
          { tags: { has: "latest" } },
          { tags: { has: "bestseller" } },
          { tags: { has: "special" } }
        ]
      }
    }),
    prisma.promoBanner.findFirst({
      where: { isActive: true },
      include: { product: true }, // Important: include product details for the banner
      orderBy: { updatedAt: 'desc' } // Get the most recently updated active one
    })
  ]);

  // 2. Filter products locally for specific sections
  const featured = allHomeProducts.filter(p => p.tags.includes("featured"));
  const latestSectionProducts = allHomeProducts.filter(p => 
    p.tags.includes("latest") || 
    p.tags.includes("bestseller") || 
    p.tags.includes("special")
  );

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <FeaturedProducts products={featured} />
      
      <LatestProducts products={latestSectionProducts} />
      
      <HektoOffer />
      
      {/* 3. Render only if a promo exists */}
      {activePromo && <UniqueFeatures promo={activePromo} />}
    </main>
  );
}