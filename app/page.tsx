import { prisma } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import LatestProducts from "@/components/LatestProducts";

export default async function Home() {
  // Fetch all products needed for the homepage in one go
  const allHomeProducts = await prisma.product.findMany({
    where: {
      OR: [
        { tags: { has: "featured" } },
        { tags: { has: "latest" } },
        { tags: { has: "bestseller" } },
        { tags: { has: "special" } }
      ]
    }
  });

  // Filter them locally for specific sections
  const featured = allHomeProducts.filter(p => p.tags.includes("featured"));
  const latestSectionProducts = allHomeProducts.filter(p => 
    p.tags.includes("latest") || 
    p.tags.includes("bestseller") || 
    p.tags.includes("special")
  );

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Passing only relevant products to each section */}
      <FeaturedProducts products={featured} />
      
      <LatestProducts products={latestSectionProducts} />
    </main>
  );
}