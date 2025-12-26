import { prisma } from "@/lib/db";
import SectionHeading from "./SectionHeading";
import HektoOfferClient from "./HektoOfferClient";

export default async function HektoOffer() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeading title="What Hekto Offer!" />
        
        {/* Pass fetched services to the client component for animation */}
        <HektoOfferClient services={services} />
      </div>
    </section>
  );
}