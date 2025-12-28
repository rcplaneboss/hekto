"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function TopCategories({ categories }: { categories: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Swipe Tracking Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalDots = Math.ceil(categories.length / itemsPerView);

  const slideTo = (index: number) => {
    if (!sliderRef.current) return;
    // Clamp index
    const target = Math.max(0, Math.min(index, totalDots - 1));
    setCurrentIndex(target);
    gsap.to(sliderRef.current, {
      xPercent: -target * 100,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  // --- SWIPE LOGIC ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSignificantSwipe = Math.abs(distance) > 50;

    if (isSignificantSwipe) {
      if (distance > 0) slideTo(currentIndex + 1); // Swipe Left
      else slideTo(currentIndex - 1); // Swipe Right
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // --- CLICK TOGGLE LOGIC ---
  const handleCardClick = (id: string) => {
    setActiveCategoryId(prev => prev === id ? null : id);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin text-center mb-16">
          Top Categories
        </h2>

        <div 
          className="overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={sliderRef} className="flex transition-none">
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              
              return (
                <div 
                  key={cat.id} 
                  onClick={() => handleCardClick(cat.id)}
                  className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-4 flex flex-col items-center group cursor-pointer"
                >
                  <div className="relative w-52 h-52 mb-6">
                    {/* Purple Ring: Active if clicked (mobile) OR hovered (desktop) */}
                    <div className={`absolute -left-2 -top-1 w-full h-full rounded-full border-l-[4px] border-[#7E33E0] transition-all duration-300 -rotate-12 group-hover:rotate-0 group-hover:opacity-100 ${isActive ? 'opacity-100 rotate-0' : 'opacity-0'}`} />
                    
                    <div className="relative w-full h-full rounded-full bg-[#F6F7FB] dark:bg-slate-900 flex items-center justify-center shadow-md overflow-hidden">
                      {cat.imageUrl && (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={150}
                          height={150}
                          className={`object-contain p-6 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'scale-110' : 'scale-100'}`}
                          unoptimized
                        />
                      )}
                      
                      {/* Shop Button: Active if clicked OR hovered */}
                      <Link 
                        href={`/shop?category=${cat.slug}`}
                        onClick={(e) => e.stopPropagation()} // Prevent card toggle when clicking button
                        className={`absolute bottom-6 transition-all duration-300 z-20 group-hover:opacity-100 group-hover:translate-y-0 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                      >
                        <button className="bg-[#08D15F] text-white text-[10px] py-2 px-4 rounded-sm font-josefin">
                          View Shop
                        </button>
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-[#151875] dark:text-white font-josefin text-lg text-center">{cat.name}</h3>
                  <p className="text-[#151875] dark:text-slate-400 font-josefin text-sm mt-1">$56.00</p>
                </div>
              );
            })}
          </div>
        </div>

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