"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function HeroBanner({ banners }: { banners: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const banner = banners[currentIndex];

  // 1. Initial Mount Animation
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(lampRef.current, { y: -100, opacity: 0, duration: 1, ease: "power3.out" })
      .from(textRef.current?.children || [], {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5")
      .from(bgRef.current, { scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1, 0.7)" }, "-=1")
      .from(imageRef.current, { x: 100, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");
  }, { scope: containerRef });

  // 2. Infinite Change Slide Logic
  const changeSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(index);
      }
    });

    tl.to([textRef.current, imageRef.current, bgRef.current], {
      y: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in"
    });
  };

  // 3. Re-animate IN on Index Change
  useGSAP(() => {
    if (isAnimating) {
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      });

      tl.set([textRef.current, imageRef.current, bgRef.current], { y: 30, opacity: 0 })
        .to([textRef.current, imageRef.current, bgRef.current], {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        });
    }
  }, [currentIndex]);

  // 4. Infinite Auto-Play Timer
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculates next index and loops back to 0 automatically
      const next = (currentIndex + 1) % banners.length;
      changeSlide(next);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, banners.length, isAnimating]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#F2F0FF] dark:bg-slate-950 overflow-hidden py-10 lg:py-14 min-h-[450px] flex items-center transition-colors duration-300"
    >
      <div ref={lampRef} className="absolute top-0 left-0 hidden xl:block z-10">
        <Image
          src="/images/lamp.png"
          width={220}
          height={220}
          alt="decorative lamp"
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <div ref={textRef} className="space-y-4 xl:pl-32 text-center md:text-left will-change-transform">
            <p className="text-[#FB2E86] font-bold text-sm tracking-wide">
              {banner.subTitle}
            </p>

            <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#151875] dark:text-white leading-tight tracking-tight font-josefin">
              {banner.mainTitle}
            </h1>

            <p className="text-[#8A8FB9] dark:text-slate-400 text-sm leading-6 max-w-sm mx-auto md:mx-0">
              {banner.description}
            </p>

            <div className="pt-3">
              <Link href={banner.buttonLink || "#"}
                className="inline-block bg-[#FB2E86] text-white px-8 py-3 rounded-sm font-semibold hover:bg-pink-600 transition-all text-sm shadow-md">
                {banner.buttonText}
              </Link>
            </div>
          </div>

         
          <div className="relative flex justify-center items-center h-[300px] md:h-[450px]">
            {/* The Pink Blur Background */}
            <div ref={bgRef} className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] bg-[#ECD2FA] rounded-full blur-3xl opacity-70 -z-10" />

            <div
              ref={imageRef}
              className="relative w-full max-w-[300px] lg:max-w-[420px] aspect-square flex items-center justify-center will-change-transform"
            >
              <Image
                key={banner.imageUrl}
                src={banner.imageUrl}
                alt={banner.mainTitle}
                fill 
                priority
                className="object-contain drop-shadow-lg"
              />

              {banner.offTagText && (
                <div className="absolute top-2 right-2 sm:top-0 sm:right-0 text-white w-[70px] h-[70px] md:w-[85px] md:h-[85px] flex flex-col items-center justify-center text-center font-bold font-lato z-10">
                  <Image src='/images/discount-badge.png' className="absolute inset-0 w-full h-full" alt="Discount Badge" width={85} height={85} />
                  <div className="relative z-20 flex flex-col items-center">
                    <span className="text-lg md:text-xl leading-none">{banner.offTagText}%</span>
                    <span className="text-lg md:text-xl leading-none">off</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`transform transition-all duration-300 rotate-45 
              ${index === currentIndex
                ? "w-2.5 h-2.5 bg-[#FB2E86]"
                : "w-2.5 h-2.5 border border-[#FB2E86] hover:bg-[#FB2E86]/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}