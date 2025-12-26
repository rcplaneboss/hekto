"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function HektoOfferClient({ services }: { services: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Register only inside the hook
    gsap.registerPlugin(ScrollTrigger);

    // 2. Use the scope feature of useGSAP to find cards
    // This is safer than toArray(".offer-card")
    const cards = containerRef.current?.querySelectorAll(".offer-card");

    if (!cards || cards.length === 0) return;

    // 3. Set and Animate
    gsap.fromTo(
      cards,
      { 
        opacity: 0, 
        y: 40 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", 
          toggleActions: "play none none none",
          // Removed onRefresh loop to prevent "Maximum call stack size exceeded"
        },
      }
    );

  }, { scope: containerRef, dependencies: [services] }); 

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {services.map((service) => (
        <div 
          key={service.id} 
          className="offer-card bg-white dark:bg-slate-900 p-8 flex flex-col items-center text-center shadow-[0_8px_40px_rgba(49,32,138,0.05)] dark:shadow-none border-b-2 border-transparent hover:border-[#FB2E86] transition-all group rounded-sm"
        >
          <div className="relative w-16 h-16 mb-6">
            <Image 
              src={service.iconUrl || "/default-icon.png"} 
              alt={service.title} 
              fill 
              className="object-contain"
              sizes="64px"
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
  );
}