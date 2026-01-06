"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import confetti from "canvas-confetti";

export default function OrderCompletedPage() {
  
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      <PageHeader title="Order Completed" />

      <div className="max-w-4xl mx-auto px-4 py-20 relative">
        
        {/* Left Side Icon: Clock */}
        <div className="hidden lg:block absolute left-[-60px] top-10 z-20">
          <Image src="/images/clock.png" alt="Processing" width={80} height={80} />
        </div>

        {/* Main Content Card */}
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          {/* Center Check Icon */}
          <div className="w-20 h-20 bg-[#F6F7FB] dark:bg-slate-800 rounded-full flex items-center justify-center border-b-4 border-slate-100 dark:border-slate-700">
            <Image src="/images/completed-check.png" alt="Success" width={45} height={45} />
          </div>

          <h2 className="text-3xl font-bold font-josefin text-[#101750] dark:text-white">
            Your Order Is Completed! 
          </h2>

          <p className="text-[#8D92A7] dark:text-slate-400 max-w-lg leading-relaxed text-sm md:text-base font-lato">
            Thank you for your order! Your order is being processed and will be completed within 3-6 hours. 
            You will receive an email confirmation when your order is completed.
          </p>

          <Link 
            href="/shop" 
            className="bg-[#FB2E86] text-white px-16 py-3 rounded-sm font-josefin font-semibold hover:bg-pink-600 transition-all mt-4"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Right Side Icon: Checklist */}
        <div className="hidden lg:block absolute right-[-60px] bottom-[-20px] z-20">
          <Image src="/images/checklist.png" alt="Order Log" width={80} height={80} />
        </div>

        {/* The Dotted Decorative Line (Matches Hekto Demo Screenshot) */}
        <div className="hidden lg:block absolute left-[-20px] bottom-0 w-full h-[180px] border-l-2 border-b-2 border-dotted border-[#D2D1D1] dark:border-slate-700 -z-0 rounded-bl-[40px]" />
      </div>

      {/* Partner Logos Section */}
      <div className="max-w-5xl mx-auto py-20 px-4 flex justify-center opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
         <Image src="/images/partner-logos.png" alt="Partners" width={900} height={100} className="object-contain" />
      </div>
    </div>
  );
}