"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function TopCategories({ categories }: { categories: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      // If window width is >= 1024px (lg), we show 4 items
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 640) {
        // Tablet/Small Desktop
        setItemsPerView(2);
      } else {
        // Mobile
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  if (!categories || categories.length === 0) return null;

  // Calculate dots based on current view (e.g., if mobile, 1 item per slide)
  const totalDots = Math.ceil(categories.length / itemsPerView);

  const slideTo = (index: number) => {
    if (!sliderRef.current) return;
    setCurrentIndex(index);
    
    // We move by 100% of the view width per dot
    gsap.to(sliderRef.current, {
      xPercent: -index * 100,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin text-center mb-16">
          Top Categories
        </h2>

        <div className="overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-none"
          >
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                // w-full makes it 1 per view on mobile
                // sm:w-1/2 makes it 2 per view on tablets
                // lg:w-1/4 makes it 4 per view on desktop
                className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-4 flex flex-col items-center group cursor-pointer"
              >
                <div className="relative w-52 h-52 mb-6">
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

        {/* Indicators: Now dynamic based on itemsPerView */}
        {totalDots > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalDots }).map((_, i) => (
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