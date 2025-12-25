
import { prisma } from "@/lib/db"; 
import HeroBanner from "./HeroBanner";

export default function HeroSection() {
  return (
    
    <HeroSectionContent />
  );
}

async function HeroSectionContent() {
  const banners = await prisma.heroBanner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 3
  });

  // If no banners exist, return nothing
  if (!banners || banners.length === 0) return null;

  // Pass the entire array to the client component
  return <HeroBanner banners={banners} />;
}