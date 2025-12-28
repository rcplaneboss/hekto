"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TopCategories({ categories }: { categories: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!categories || categories.length === 0) return null;

  const slideTo = (index: number) => {
    if (!sliderRef.current) return;
    setCurrentIndex(index);
    gsap.to(sliderRef.current, {
      xPercent: -index * 100,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin text-center mb-16">
          Top Categories
        </h2>

        {/* Layout Change: If you only have 2 categories, we don't want to hide 
           them in a slider track. We use a simple flex-wrap first.
        */}
        <div className="overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-none"
          >
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-4 flex flex-col items-center group cursor-pointer"
              >
                {/* Circular Container */}
                <div className="relative w-52 h-52 mb-6">
                  {/* Purple Hover Ring */}
                  <div className="absolute -left-2 -top-1 w-full h-full rounded-full border-l-[4px] border-[#7E33E0] opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-12 group-hover:rotate-0" />
                  
                  <div className="relative w-full h-full rounded-full bg-[#F6F7FB] dark:bg-slate-900 flex items-center justify-center shadow-md">
                    {cat.imageUrl && (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        width={150}
                        height={150}
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    )}
                    
                    <Link 
                      href={`/shop?category=${cat.slug}`}
                      className="absolute bottom-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20"
                    >
                      <button className="bg-[#08D15F] text-white text-[10px] py-2 px-4 rounded-sm font-josefin">
                        View Shop
                      </button>
                    </Link>
                  </div>
                </div>

                <h3 className="text-[#151875] dark:text-white font-josefin text-lg text-center">
                  {cat.name}
                </h3>
                <p className="text-[#151875] dark:text-slate-400 font-josefin text-sm mt-1">
                  $56.00
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Only show dots if we actually have enough items to slide */}
        {categories.length > 4 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(categories.length / 4) }).map((_, i) => (
              <button
                key={i}
                onClick={() => slideTo(i)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  currentIndex === i ? "w-4 bg-[#FB2E86]" : "w-2 bg-[#FB2E86] opacity-30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}