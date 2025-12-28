"use client";

import Link from "next/link";

export default function NewsletterSection() {
  return (
    <section 
      className="relative h-[400px] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('/images/newsletter-bg.png')", 
      }}
    >
      {/* Optional: Add a subtle white tint overlay if your image is too dark/busy */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
        <h2 className="text-[#151875] text-3xl md:text-4xl font-bold font-josefin leading-tight mb-10">
          Get Latest Update By Subscribe <br className="hidden md:block" /> Our Newsletter
        </h2>
        
        <Link href="/shop">
          <button className="bg-[#FB2E86] hover:bg-[#e02674] text-white font-josefin px-12 py-4 rounded-sm transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95">
            Subscribe Now
          </button>
        </Link>
      </div>
    </section>
  );
}