"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function TrendingProducts({ 
  products, 
  promos, 
  miniList 
}: { 
  products: any[], 
  promos: any[], 
  miniList: any[] 
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 1. Check if we have data before animating
    if (!products?.length && !promos?.length) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%", // Slightly lower start to be safe
        toggleActions: "play none none none",
        // Force a refresh when this specific trigger is reached
        onEnter: () => ScrollTrigger.refresh(),
      }
    });

    // 2. Use fromTo for absolute control over the visibility
    // This ensures they start at 0 and end at 1 without getting "stuck"
    tl.fromTo(".trending-title", 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    )
    .fromTo(".trending-card", 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }, 
      "-=0.2"
    )
    .fromTo(".promo-box, .mini-list-item", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, 
      "-=0.3"
    );

  }, { 
    scope: sectionRef, 
    dependencies: [products, promos, miniList],
    revertOnUpdate: true // This ensures animations reset correctly if data changes
  });

  return (
    <section 
      ref={sectionRef} 
      className="py-16 bg-white dark:bg-slate-950 transition-colors overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="trending-title opacity-0 text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin text-center mb-10">
          Trending Products
        </h2>

        {/* 1. Top Grid: Main Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {products?.map((product) => (
            <div key={product.id} className="trending-card opacity-0 bg-white dark:bg-slate-900 p-3 shadow-sm hover:shadow-md group transition-all">
              <div className="bg-[#F5F6F8] dark:bg-slate-800 h-[200px] flex items-center justify-center mb-4 relative rounded-sm">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  width={150} height={150} 
                  className="object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="text-center pb-2">
                <h3 className="text-[#151875] dark:text-white font-bold text-sm">{product.name}</h3>
                <div className="flex justify-center gap-2 text-xs mt-1">
                  <span className="text-[#151875] dark:text-slate-200 font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-gray-400 line-through">${(product.price * 1.3).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Bottom Row: Promos + Mini List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos?.map((promo) => (
            <div 
              key={promo.id} 
              className="promo-box opacity-0 p-6 relative h-[220px] overflow-hidden group shadow-sm rounded-sm transition-colors"
              style={{ backgroundColor: promo.bgColor }}
            >
              <div className="absolute inset-0 dark:bg-slate-900/40 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-[#151875] dark:text-white text-xl font-bold font-josefin mb-2 max-w-[160px]">
                  {promo.title}
                </h3>
                <Link href={promo.linkUrl} className="text-[#FB2E86] text-sm font-semibold border-b border-[#FB2E86] hover:text-[#151875] dark:hover:text-white transition-colors">
                  {promo.linkText}
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-36 h-36 md:w-44 md:h-44">
                <Image src={promo.imageUrl} alt="promo" fill className="object-contain" />
              </div>
            </div>
          ))}

          {/* Mini Product List */}
          <div className="flex flex-col gap-4">
            {miniList?.map((item) => (
              <div key={item.id} className="mini-list-item opacity-0 flex items-center gap-3 group cursor-pointer bg-white dark:bg-slate-900/50 p-1 rounded-sm">
                <div className="bg-[#F5F6F8] dark:bg-slate-800 w-20 h-16 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Image src={item.imageUrl} alt={item.name} width={45} height={45} className="object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-[#151875] dark:text-white font-bold font-josefin text-xs leading-tight">{item.name}</h4>
                  <p className="text-[#151875] dark:text-slate-400 text-[10px] line-through">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}