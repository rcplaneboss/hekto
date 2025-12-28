"use client";

import Image from "next/image";

export default function BrandLogos({ brands }: { brands: any[] }) {
  const displayBrands = brands?.length > 0 ? brands : [
    { id: 1, imageUrl: "/images/brand-1.png" },
    { id: 2, imageUrl: "/images/brand-2.png" },
    { id: 3, imageUrl: "/images/brand-3.png" },
    { id: 4, imageUrl: "/images/brand-4.png" },
    { id: 5, imageUrl: "/images/brand-5.png" },
  ];

  return (
    <div className="container mx-auto py-16 px-6 dark:bg-slate-950">
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
        {displayBrands.map((brand, idx) => (
          <div 
            key={brand.id || idx} 
            className="relative w-32 h-12 opacity-60 grayscale hover:grayscale-0 dark:brightness-200 dark:invert transition-all duration-500"
          >
            <Image
              src={brand.imageUrl}
              alt={brand.name || "Brand Logo"}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}