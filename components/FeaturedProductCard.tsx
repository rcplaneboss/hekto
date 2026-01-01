"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Search, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { addToCart } from "@/app/actions/cart"; 
import { useCart } from "@/context/CartContext";


export default function FeaturedProductCard({ product }: { product: any }) {
  const { refreshCart } = useCart();
  const [isActive, setIsActive] = useState(false);
  const [isPending, startTransition] = useTransition(); 
  const [isAdded, setIsAdded] = useState(false); 

  const toggleActive = () => {
   
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setIsActive(!isActive);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the card from flipping/navigating
    
    startTransition(async () => {
      try {
        // Defaulting to 1 quantity. 
        // Note: For cards, we usually add the base product. 
        // Specific colors/sizes are usually selected on the details page.
        await addToCart(product.id, 1);
        await refreshCart();
        // Show success state
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
      } catch (error) {
        console.error("Failed to add to cart", error);
        alert("Please login to add items to cart.");
      }
    });
  };

  return (
    <div 
      onClick={toggleActive}
      className={`group relative flex flex-col w-full max-w-[270px] mx-auto h-[360px] bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 overflow-hidden rounded-sm border border-transparent 
      ${isActive ? "shadow-xl border-gray-100 dark:border-slate-800" : "hover:shadow-xl hover:border-gray-100 dark:hover:border-slate-800"} 
      touch-manipulation cursor-pointer`}
    >
      
      {/* 1. TOP SECTION */}
      <div className={`relative h-[230px] w-full flex justify-center items-center transition-colors duration-300
        ${isActive ? "bg-[#ebedf3] dark:bg-slate-700" : "bg-[#F6F7FB] dark:bg-slate-800 group-hover:bg-[#ebedf3] dark:group-hover:bg-slate-700"}`}>
        
        {/* Action Icons */}
        <div className={`absolute top-2 left-2 flex gap-1.5 transition-all duration-300 z-20
          ${isActive 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}>
          
          {/* --- ADD TO CART BUTTON --- */}
          <button 
            onClick={handleAddToCart}
            disabled={isPending}
            className={`p-1.5 rounded-full transition-colors shadow-sm flex items-center justify-center w-8 h-8
              ${isAdded 
                ? "bg-green-500 text-white hover:bg-green-600" 
                : "bg-white dark:bg-slate-700 text-[#1389FF] hover:bg-[#2F1AC4] hover:text-white"
              }
            `}
            title="Add to Cart"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isAdded ? (
              <Check size={14} />
            ) : (
              <ShoppingCart size={14} />
            )}
          </button>

          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-[#1389FF] hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors w-8 h-8 flex items-center justify-center"
          >
            <Heart size={14} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-[#1389FF] hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors w-8 h-8 flex items-center justify-center"
          >
            <Search size={14} />
          </button>
        </div>

        {/* Product Image */}
        <div className={`relative w-28 h-28 md:w-32 md:h-32 transition-transform duration-500 
          ${isActive ? "scale-105" : "group-hover:scale-105"}`}>
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            fill
            className="object-contain"
            sizes="250px"
          />
        </div>
        
        {/* View Details Button */}
        <div 
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300
          ${isActive 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}
        >
          <Link 
            href={`/shop/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#08D15F] text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-green-600 shadow-md uppercase tracking-tighter font-josefin block"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* 2. BOTTOM SECTION */}
      <div className={`flex-grow flex flex-col justify-center p-3 text-center transition-colors duration-300
        ${isActive ? "bg-[#2F1AC4]" : "group-hover:bg-[#2F1AC4]"}`}>
        
        <h3 className={`font-bold text-sm mb-1 truncate transition-colors font-josefin
          ${isActive ? "text-white" : "text-[#FB2E86] group-hover:text-white"}`}>
          {product.name}
        </h3>
        
        {/* Color Dots */}
        <div className="flex justify-center gap-1 mb-2">
          {product.colors && product.colors.length > 0 ? (
            product.colors.map((color: string, index: number) => (
              <span 
                key={index} 
                className="w-3 h-1 rounded-full border border-black/5" 
                style={{ backgroundColor: color }}
              />
            ))
          ) : (
            <span className="w-3 h-1 rounded-full bg-gray-300 dark:bg-slate-600" />
          )}
        </div>

        <div className="space-y-0.5">
          <p className={`text-[10px] font-bold transition-colors tracking-widest font-josefin
            ${isActive ? "text-white" : "text-[#151875] dark:text-slate-300 group-hover:text-white"}`}>
            Code - <span className="font-josefin uppercase text-xs">{product.code}</span>
          </p>
          <p className={`text-sm font-bold transition-colors
            ${isActive ? "text-white" : "text-[#151875] dark:text-white group-hover:text-white"}`}>
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}