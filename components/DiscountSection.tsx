"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function DiscountSection({ categories }: { categories: any[] }) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentData = categories.find((cat) => cat.id === activeTab)?.discountItem;

  // 1. Initial Entrance (Scroll-triggered)
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });

    tl.fromTo(".discount-entrance", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    )
    .fromTo(".discount-content-trigger",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.4"
    );
  }, { scope: sectionRef });

  // 2. Tab Switch Animation (Triggers every time activeTab changes)
  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.fromTo(contentRef.current, 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [activeTab]);

  if (!currentData) return null;

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        
        <h2 className="discount-entrance opacity-0 text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin text-center mb-4">
          Discount Item
        </h2>

        {/* Dynamic Tab Navigation */}
        <div className="discount-entrance opacity-0 flex justify-center flex-wrap gap-4 md:gap-8 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-base md:text-lg font-lato transition-all relative pb-1 ${
                activeTab === cat.id
                  ? "text-[#FB2E86]"
                  : "text-[#151875] dark:text-slate-400 hover:text-[#FB2E86]"
              }`}
            >
              {cat.name}
              {activeTab === cat.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FB2E86]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Wrapper */}
        <div ref={contentRef} className="discount-content-trigger opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            <h3 className="text-[#151875] dark:text-white text-2xl md:text-3xl font-bold font-josefin">
              {currentData.title}
            </h3>
            <h4 className="text-[#FB2E86] font-josefin text-lg md:text-xl">
              {currentData.subtitle}
            </h4>
            <p className="text-[#B7BACB] dark:text-slate-400 leading-relaxed text-sm md:text-base max-w-lg">
              {currentData.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
              {currentData.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[#B7BACB] dark:text-slate-400">
                  <Check size={16} className="text-[#7569B2] flex-shrink-0" />
                  <span className="text-xs md:text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link href={`/product/${currentData.product.id}`}>
              <button className="mt-4 bg-[#FB2E86] text-white px-8 md:px-10 py-3 rounded-sm font-josefin font-semibold hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/30 transition-all w-fit text-sm md:text-base">
                {currentData.buttonText}
              </button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center order-1 lg:order-2">
            {/* Decorative Pink Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[400px] md:h-[400px] bg-[#FCECF1] dark:bg-slate-900/50 rounded-full transition-colors" />
            
            <div className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px]">
              <Image
                src={currentData.product.imageUrl}
                alt={currentData.subtitle}
                fill
                className="object-contain z-10"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}