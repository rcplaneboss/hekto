"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Search, Star, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { addToCart } from "@/app/actions/cart";

export default function ProductCardList({ product }: { product: any }) {
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  const reviewCount = product.reviews?.length || 0;
  const rating = reviewCount > 0 
    ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount 
    : 0;

  // --- Add to Cart Logic ---
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop Link navigation
    e.stopPropagation(); // Stop click bubbling

    startTransition(async () => {
      try {
        await addToCart(product.id, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        console.error("Cart update failed:", error);
      }
    });
  };

  return (
    <Link href={`/shop/${product.id}`} className="no-underline block">
      <div className="group flex flex-row items-start gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 border border-[#F6F7FB] dark:border-slate-800 rounded-sm">
        
        {/* 1. Image Container */}
        <div className="relative bg-[#F6F7FB] dark:bg-slate-800 flex items-center justify-center overflow-hidden w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-md">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={100} 
            height={100}
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* 2. Content Area */}
        <div className="flex-1 flex flex-col items-start min-w-0 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1 w-full">
            <h3 className="text-[#111C85] dark:text-white font-bold font-josefin text-sm sm:text-lg leading-tight truncate">
              {product.name}
            </h3>
            
            {/* Color Dots */}
            <div className="flex gap-1">
              {product.colors?.slice(0, 3).map((color: string, index: number) => (
                <div key={index} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-black/5" style={{ backgroundColor: color }} />
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

          {/* Description */}
          <p className="hidden sm:block text-[#9295AA] dark:text-slate-400 font-lato text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 max-w-xl">
            {product.description || "High-quality fashion item crafted for comfort and style."}
          </p>

          {/* Action Icons */}
          <div className="flex gap-2 sm:gap-3">
            <IconButton 
              onClick={handleAddToCart}
              disabled={isPending}
              active={isAdded}
              icon={
                isPending ? <Loader2 size={14} className="animate-spin" /> : 
                isAdded ? <Check size={14} /> : 
                <ShoppingCart size={14} />
              } 
            />
            <IconButton icon={<Heart size={14} />} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />
            <IconButton icon={<Search size={14} />} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function IconButton({ 
  icon, 
  onClick, 
  active = false, 
  disabled = false 
}: { 
  icon: React.ReactNode; 
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button 
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 sm:p-2 rounded-full shadow-sm transition-all border flex items-center justify-center
        ${active 
          ? "bg-green-500 text-white border-green-500" 
          : "bg-white dark:bg-slate-800 text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white border-gray-100 dark:border-slate-700"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}
      `}
    >
      {icon}
    </button>
  );
}