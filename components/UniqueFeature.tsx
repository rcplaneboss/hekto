"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link"; // Added Link
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function UniqueFeatures({ promo }: { promo: any }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const listItemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    if (!promo) return;

    const ctx = gsap.context(() => {
      // Image Slide in from Left
      gsap.from(imageRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      // Title and Button Fade up
      gsap.from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      // Staggered List Items
      gsap.from(listItemsRef.current, {
        x: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [promo]);

  if (!promo) return null;

  const bulletColors = ["bg-[#FB2E86]", "bg-[#37DAAE]", "bg-[#2F1AC4]"];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#F1F0FF] dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Decorative Image Side */}
          <div ref={imageRef} className="relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#F5E1FC] dark:bg-slate-800 rounded-full" />
            <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] z-10">
              <Image 
                src={promo.customImage || promo.product.imageUrl} 
                alt={promo.product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Content Side */}
          <div ref={contentRef} className="flex flex-col gap-6 lg:max-w-xl">
            <h2 className="text-[#151875] dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold font-josefin leading-tight">
              {promo.title}
            </h2>

            <ul className="space-y-4">
              {promo.features.map((feature: string, index: number) => (
                <li 
                  key={index} 
                  ref={(el) => { if (el) listItemsRef.current[index] = el; }}
                  className="flex items-start gap-4"
                >
                  <span className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${bulletColors[index % 3]}`} />
                  <p className="text-[#ACABC3] dark:text-slate-400 font-medium text-xs md:text-base leading-relaxed font-lato">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-5 mt-4">
              {/* Updated Link to query both featured and trending tags */}
              <Link href="/shop?query=featured%20trending">
                <button className="bg-[#FB2E86] text-white px-8 py-3 font-josefin font-semibold hover:scale-105 transition-all rounded-sm shadow-md active:bg-pink-700">
                  View Trending
                </button>
              </Link>
              
              <div className="flex flex-col font-josefin">
                <span className="text-[#151875] dark:text-white font-bold text-sm">{promo.product.name}</span>
                <span className="text-[#151875] dark:text-slate-300 text-sm">${promo.product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}