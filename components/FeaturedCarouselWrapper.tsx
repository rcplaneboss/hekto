"use client";

import { useEffect, useRef, useState } from "react";
import FeaturedProductCard from "./FeaturedProductCard";
import { gsap } from "gsap";

export default function FeaturedCarouselWrapper({ products }: { products: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update items per view based on window size
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 1024) {
        setItemsPerView(1); // Mobile/Tablet: 1 slide at a time
      } else {
        setItemsPerView(4); // Desktop: 4 slides at a time
      }
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);

  const goToSlide = (index: number) => {
    if (!containerRef.current) return;
    setActiveIndex(index);

    gsap.to(containerRef.current, {
      xPercent: -index * 100,
      duration: 0.8,
      ease: "power2.inOut",
    });
  };

  // GSAP Auto-play Logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalSlides;
        goToSlide(next);
        return next;
      });
    }, 5000); // 5 seconds

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides]);

  // Group products into chunks based on current screen size
  const chunks = [];
  for (let i = 0; i < products.length; i += itemsPerView) {
    chunks.push(products.slice(i, i + itemsPerView));
  }

  return (
    <div className="relative w-full">
      {/* Container */}
      <div className="overflow-hidden">
        <div 
          ref={containerRef}
          className="flex"
        >
          {chunks.map((chunk, idx) => (
            <div 
              key={idx} 
              className={`grid gap-6 md:gap-8 min-w-full px-2 ${
                itemsPerView === 4 ? "grid-cols-4" : "grid-cols-1"
              }`}
            >
              {chunk.map((product) => (
                <div key={product.id} className="flex justify-center">
                   <FeaturedProductCard product={product} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {chunks.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current); // Pause on manual click
              goToSlide(i);
            }}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === i 
                ? "w-6 bg-[#FB2E86]" 
                : "w-4 bg-[#FEBAD7] dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}