"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import FeaturedProductCard from "./FeaturedProductCard";
import QuickViewModal from "./QuickViewModal";
import { gsap } from "gsap";
import { Play, Pause } from "lucide-react";
import { addToCart } from "@/app/actions/cart";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function FeaturedCarouselWrapper({ products }: { products: any[] }) {
  const { refreshCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Carousel State
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive Grid Logic
  useEffect(() => {
    const updateItems = () => {
      setItemsPerView(window.innerWidth < 1024 ? 1 : 4);
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);

  const goToSlide = useCallback((index: number) => {
    if (!containerRef.current) return;
    setActiveIndex(index);
    gsap.to(containerRef.current, {
      xPercent: -index * 100,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, []);

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalSlides;
        goToSlide(next);
        return next;
      });
    }, 5000);
  }, [totalSlides, goToSlide]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Control animation based on hover OR modal status
  useEffect(() => {
    if (!isPaused && !selectedProduct) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isPaused, selectedProduct, startAutoPlay, stopAutoPlay]);

  // Modal Actions
  const handleModalAddToCart = async () => {
    if (!selectedProduct) return;
    try {
      await addToCart(selectedProduct.id, 1);
      await refreshCart();
      setSelectedProduct(null); // Close modal on success
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const chunks = [];
  for (let i = 0; i < products.length; i += itemsPerView) {
    chunks.push(products.slice(i, i + itemsPerView));
  }

  return (
    <div className="relative w-full group/carousel">
      {/* 1. THE LIFTED MODAL (Fixed Position) */}
      <QuickViewModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleModalAddToCart}
        onWishlist={() => selectedProduct && toggleWishlist(selectedProduct)}
        isFavorited={selectedProduct ? isInWishlist(selectedProduct.id) : false}
      />

      {/* Paused Indicator */}
      <div className={`absolute top-4 right-4 z-30 transition-all duration-300 pointer-events-none
        ${isPaused || selectedProduct ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700">
          <Pause size={12} className="text-[#FB2E86] fill-[#FB2E86]" />
          <span className="text-[10px] font-bold font-josefin uppercase tracking-wider text-[#151875] dark:text-slate-300">
            {selectedProduct ? "Viewing Product" : "Paused"}
          </span>
        </div>
      </div>

      <div 
        className="overflow-hidden touch-pan-y rounded-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={containerRef} className="flex">
          {chunks.map((chunk, idx) => (
            <div key={idx} className={`grid gap-6 md:gap-8 min-w-full px-2 ${itemsPerView === 4 ? "grid-cols-4" : "grid-cols-1"}`}>
              {chunk.map((product) => (
                <div key={product.id} className="flex justify-center">
                   <FeaturedProductCard 
                      product={product} 
                      onQuickView={() => setSelectedProduct(product)} 
                   />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {chunks.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsPaused(true);
              goToSlide(i);
              setTimeout(() => setIsPaused(false), 3000);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${activeIndex === i ? "w-8 bg-[#FB2E86]" : "w-4 bg-[#FEBAD7] dark:bg-slate-700"}`}
          />
        ))}
      </div>
    </div>
  );
}