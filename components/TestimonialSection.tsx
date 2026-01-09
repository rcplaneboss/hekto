"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  imageUrl: string | null;
}

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  // Set the initial active index (usually the middle one)
  const [activeIndex, setActiveIndex] = useState(1);
  const active = testimonials[activeIndex] || testimonials[0];

  return (
    <section className="bg-[#FBFBFF] dark:bg-slate-900/50 py-24 transition-colors">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold font-josefin text-black dark:text-white mb-12">
          Our Client Say!
        </h2>

        <div className="space-y-6">
          {/* Clickable Avatars */}
          <div className="flex justify-center items-end gap-4 h-20">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative transition-all duration-300 ease-in-out ${
                  idx === activeIndex 
                    ? "w-16 h-16 -translate-y-2 scale-110" 
                    : "w-12 h-12 opacity-60 hover:opacity-100"
                }`}
              >
                {t.imageUrl ? (
                  <Image
                    src={t.imageUrl}
                    alt={t.name}
                    fill
                    className={`rounded-md object-cover border-2 shadow-md transition-colors ${
                      idx === activeIndex ? "border-[#FB2E86]" : "border-transparent"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Content with simple Fade-in Animation */}
          <div key={active.id} className="pt-4 animate-in fade-in zoom-in-95 duration-500">
            <h3 className="text-2xl font-bold font-josefin text-[#151875] dark:text-pink-500">
              {active.name}
            </h3>
            <p className="text-sm text-[#8A8FB9] dark:text-slate-400 font-lato font-semibold mb-8">
              {active.role}
            </p>

            <p className="text-[#8A8FB9] dark:text-slate-400 font-lato leading-loose font-bold italic text-lg px-6">
              "{active.content}"
            </p>
          </div>

          {/* Interactive Navigation Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 transition-all duration-300 rounded-full ${
                  idx === activeIndex ? "w-8 bg-[#FB2E86]" : "w-4 bg-[#FFB2D1] hover:bg-[#FB2E86]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}