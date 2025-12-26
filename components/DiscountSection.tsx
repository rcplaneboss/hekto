"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function DiscountSection({ categories }: { categories: any[] }) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const contentRef = useRef(null);

  const currentData = categories.find((cat) => cat.id === activeTab)?.discountItem;

  // Animation when switching tabs
  useGSAP(() => {
    gsap.fromTo(contentRef.current, 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  if (!currentData) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-[#151875] dark:text-white text-4xl font-bold font-josefin text-center mb-4">
          Discount Item
        </h2>

        {/* Dynamic Tab Navigation */}
        <div className="flex justify-center gap-4 md:gap-8 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-lg font-lato transition-all ${
                activeTab === cat.id
                  ? "text-[#FB2E86] border-b-2 border-[#FB2E86]"
                  : "text-[#151875] dark:text-slate-400 hover:text-[#FB2E86]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[#151875] dark:text-white text-3xl font-bold font-josefin">
              {currentData.title}
            </h3>
            <h4 className="text-[#FB2E86] font-josefin text-xl">
              {currentData.subtitle}
            </h4>
            <p className="text-[#B7BACB] dark:text-slate-400 leading-relaxed max-w-lg">
              {currentData.description}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {currentData.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[#B7BACB] dark:text-slate-400">
                  <Check size={18} className="text-[#7569B2]" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link href={`/product/${currentData.product.id}`}>
              <button className="mt-4 bg-[#FB2E86] text-white px-10 py-3 rounded-sm font-josefin font-semibold hover:bg-pink-600 transition-all w-fit">
                {currentData.buttonText}
              </button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center">
            {/* Decorative Pink Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#FCECF1] dark:bg-slate-900 rounded-full" />
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
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