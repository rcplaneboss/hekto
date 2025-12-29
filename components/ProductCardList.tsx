"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Search, Star } from "lucide-react";

export default function ProductCardList({ product }: { product: any }) {
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  // Average Rating Calculation
  const reviewCount = product.reviews?.length || 0;
  const rating = reviewCount > 0 
    ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount 
    : 0;

  return (
    <div className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-white dark:bg-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-lg border border-transparent hover:border-[#F6F7FB] dark:hover:border-slate-800">
      
      {/* 1. Image: Exactly the size from your original code */}
      <div className="relative bg-[#F6F7FB] dark:bg-slate-800 flex items-center justify-center overflow-hidden w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-md">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={100} 
          height={100}
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 flex flex-col items-start min-w-0">
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <h3 className="text-[#111C85] dark:text-white font-bold font-josefin text-lg leading-tight truncate">
            {product.name}
          </h3>
          
          {/* Color Dots */}
          <div className="flex gap-1.5">
            {product.colors.slice(0, 3).map((color: string, index: number) => (
              <div key={index} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        {/* Price & Stars Row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2 font-josefin">
            <span className="text-[#111C85] dark:text-white text-sm font-bold">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[#FB2E86] text-xs line-through opacity-70">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={12} 
                className={`${star <= rating ? "fill-[#FFC416] text-[#FFC416]" : "text-gray-200 dark:text-slate-700"}`} 
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-[#9295AA] dark:text-slate-400 font-lato text-sm leading-relaxed mb-4 line-clamp-2 max-w-xl">
          {product.description || "High-quality fashion item crafted for comfort and style."}
        </p>

        {/* Action Icons */}
        <div className="flex gap-3">
          <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white transition-all border border-gray-100 dark:border-slate-700">
            <ShoppingCart size={15} />
          </button>
          <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white transition-all border border-gray-100 dark:border-slate-700">
            <Heart size={15} />
          </button>
          <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white transition-all border border-gray-100 dark:border-slate-700">
            <Search size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}