"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Search, Star } from "lucide-react";

export default function ProductCardList({ product }: { product: any }) {
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  const reviewCount = product.reviews?.length || 0;
  const rating = reviewCount > 0 
    ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount 
    : 0;

  return (
    <div className="group flex flex-row items-start gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border border-[#F6F7FB] dark:border-slate-800">
      
      {/* 1. Fixed Image Container for Mobile Row */}
      <div className="relative bg-[#F6F7FB] dark:bg-slate-800 flex items-center justify-center overflow-hidden w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-md">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={80} 
          height={80}
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110 sm:w-[100px] sm:h-[100px]"
        />
      </div>

      {/* 2. Content Area - Always Aligned Left */}
      <div className="flex-1 flex flex-col items-start min-w-0 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
          <h3 className="text-[#111C85] dark:text-white font-bold font-josefin text-sm sm:text-lg leading-tight truncate">
            {product.name}
          </h3>
          
          {/* Color Dots */}
          <div className="flex gap-1">
            {product.colors?.slice(0, 3).map((color: string, index: number) => (
              <div key={index} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        {/* Price & Stars Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
          <div className="flex items-center gap-2 font-josefin">
            <span className="text-[#111C85] dark:text-white text-xs sm:text-sm font-bold">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[#FB2E86] text-[10px] sm:text-xs line-through opacity-70">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={10} 
                className={`${star <= rating ? "fill-[#FFC416] text-[#FFC416]" : "text-gray-200 dark:text-slate-700"}`} 
              />
            ))}
          </div>
        </div>

        {/* Description - Hidden on very small screens, shown from sm up */}
        <p className="hidden sm:block text-[#9295AA] dark:text-slate-400 font-lato text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 max-w-xl">
          {product.description || "High-quality fashion item crafted for comfort and style."}
        </p>

        {/* Action Icons - Smaller for mobile */}
        <div className="flex gap-2 sm:gap-3">
          <IconButton icon={<ShoppingCart size={14} />} />
          <IconButton icon={<Heart size={14} />} />
          <IconButton icon={<Search size={14} />} />
        </div>
      </div>
    </div>
  );
}

// Small helper to keep code clean
function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white transition-all border border-gray-100 dark:border-slate-700">
      {icon}
    </button>
  );
}