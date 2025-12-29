"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function HeroBanner({ banners }: { banners: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const banner = banners[currentIndex];

  // 1. Mouse Follow Parallax Logic
  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth) - 0.5;
      const yPos = (clientY / innerHeight) - 0.5;

      gsap.to(lampRef.current, {
        x: xPos * 30,
        y: yPos * 10,
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(imageRef.current, {
        x: xPos * -40,
        y: yPos * -20,
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(bgRef.current, {
        x: xPos * 60,
        y: yPos * 30,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  // 2. Initial Mount Animation
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(lampRef.current, { y: -100, opacity: 0, duration: 1, ease: "power3.out" })
      .from(textRef.current?.children || [], { 
        y: 50, 
        opacity: 0, 
        filter: "blur(10px)", // Text blur
        stagger: 0.1, 
        duration: 0.8,
        ease: "back.out(1.7)" 
      }, "-=0.5")
      .from(bgRef.current, { 
        scale: 0, 
        opacity: 0, 
        filter: "blur(40px)", // Circle blur
        duration: 1, 
        ease: "elastic.out(1, 0.7)" 
      }, "-=1")
      .from(imageRef.current, { 
        x: 100, 
        opacity: 0, 
        // Image stays clear (no filter: blur added here)
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.8");

    gsap.to(imageRef.current, {
      yPercent: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  const changeSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setProgress(0);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(index);
      }
    });

    tl.to(textRef.current, {
      y: -20,
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.4,
      ease: "power2.in"
    })
    .to([imageRef.current, bgRef.current], {
      y: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in"
    }, "<");
  };

  useGSAP(() => {
    if (isAnimating) {
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      });

      tl.set([imageRef.current, bgRef.current], { y: 30, opacity: 0 })
        .set(bgRef.current, { filter: "blur(40px)" })
        .set(textRef.current, { y: 30, opacity: 0, filter: "blur(10px)" })
        .to(textRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out"
        })
        .to(bgRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(40px)", // Keep circle blurry
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.5")
        .to(imageRef.current, {
          y: 0,
          opacity: 1,
          // Image is clear (no filter blur)
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.5");
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused || isAnimating) return;
    const interval = 50;
    const step = (interval / 5000) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const next = (currentIndex + 1) % banners.length;
          changeSlide(next);
          return 0;
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex, banners.length, isAnimating, isPaused]);

  return (
    <section 
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-[#F2F0FF] dark:bg-slate-950 overflow-hidden py-10 lg:py-14 min-h-[450px] md:min-h-[580px] flex items-center transition-colors duration-300"
    >
      <div className="absolute top-0 left-[10%] w-[1px] h-20 bg-gray-300 dark:bg-slate-700 hidden xl:block" />

      <div ref={lampRef} className="absolute top-0 left-0 hidden xl:block z-10 will-change-transform">
        <Image src="/images/lamp.png" width={220} height={220} alt="lamp" className="object-contain" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div ref={textRef} className="space-y-4 xl:pl-32 text-center md:text-left will-change-transform min-h-[320px] flex flex-col justify-center">
            <p className="text-[#FB2E86] font-bold text-sm tracking-wide h-5">
              {banner.subTitle}
            </p>
            
            <div className="h-[72px] md:h-[96px] flex items-center justify-center md:justify-start">
              <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#151875] dark:text-white leading-tight tracking-tight font-josefin line-clamp-2">
                {banner.mainTitle}
              </h1>
            </div>
            
            <div className="h-[60px] md:h-[72px] flex items-start justify-center md:justify-start">
              <p className="text-[#8A8FB9] dark:text-slate-400 text-sm leading-6 max-w-sm line-clamp-3">
                {banner.description}
              </p>
            </div>
            
            <div className="pt-3">
              <Link href={banner.buttonLink || "#"} className="inline-block bg-[#FB2E86] text-white px-8 py-3 rounded-sm font-semibold hover:bg-pink-600 transition-all text-sm shadow-md">
                {banner.buttonText}
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center h-[350px] md:h-[450px]">
            {/* The circle behind the image */}
            <div ref={bgRef} className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] bg-[#ECD2FA] rounded-full blur-3xl opacity-70 -z-10 will-change-transform" />
            
            {/* The actual product image (No blur here) */}
            <div ref={imageRef} className="relative w-full h-full max-w-[300px] lg:max-w-[420px] aspect-square flex items-center justify-center will-change-transform">
              <Image 
                key={banner.imageUrl} 
                src={banner.imageUrl} 
                alt={banner.mainTitle} 
                fill 
                sizes="(max-width: 768px) 300px, 450px"
                priority 
                className="object-contain drop-shadow-lg" 
              />
              {banner.offTagText && (
                <div className="absolute top-2 right-2 sm:top-0 sm:right-0 text-white w-[70px] h-[70px] md:w-[85px] md:h-[85px] flex flex-col items-center justify-center text-center font-bold font-lato z-20">
                  <Image src='/images/discount-badge.png' fill className="w-full h-full -z-10" alt="Discount Badge" />
                  <span className="text-lg md:text-xl leading-none">{banner.offTagText}%</span>
                  <span className="text-lg md:text-xl leading-none">off</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-200 dark:bg-slate-800">
        <div className="h-full bg-[#FB2E86] transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
        <span className="text-[#151875] dark:text-white font-josefin font-bold text-xs opacity-60">0{currentIndex + 1}</span>
        <div className="flex gap-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => changeSlide(index)}
              className={`transform transition-all duration-300 rotate-45 
                ${index === currentIndex ? "w-2.5 h-2.5 bg-[#FB2E86]" : "w-2.5 h-2.5 border border-[#FB2E86] hover:bg-[#FB2E86]/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <span className="text-[#151875] dark:text-white font-josefin font-bold text-xs opacity-30">0{banners.length}</span>
      </div>
    </section>
  );
}