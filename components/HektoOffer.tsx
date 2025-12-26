// app/components/HektoOffer.tsx
import { prisma } from "@/lib/db";
import SectionHeading from "./SectionHeading";
import Image from "next/image";

export default async function HektoOffer() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeading title="What Hekto Offer!" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white dark:bg-slate-900 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl border-b-2 border-transparent hover:border-[#FF5629] transition-all group">
              <div className="relative w-16 h-16 mb-6">
                <Image 
                  src={service.iconUrl || "/default-icon.png"} 
                  alt={service.title} 
                  fill 
                  className="object-contain"
                />
              </div>
              <h3 className="text-[#151875] dark:text-white text-xl font-bold mb-4 font-josefin">
                {service.title}
              </h3>
              <p className="text-gray-400 dark:text-slate-400 font-bold text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}