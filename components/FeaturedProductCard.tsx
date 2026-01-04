"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Search, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { addToCart } from "@/app/actions/cart"; 
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// Define the interface for props to include the new trigger function
interface FeaturedProductCardProps {
  product: any;
  onQuickView: () => void; // Function passed from FeaturedCarouselWrapper
}

export default function FeaturedProductCard({ product, onQuickView }: FeaturedProductCardProps) {
  const { refreshCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [isActive, setIsActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'cart' | 'wish' } | null>(null);

  const isFavorited = isInWishlist(product.id);

  const triggerToast = (message: string, type: 'cart' | 'wish') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const toggleActive = () => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setIsActive(!isActive);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      try {
        await addToCart(product.id, 1);
        await refreshCart();
        triggerToast("Added to Cart!", "cart");
      } catch (error) {
        console.error("Failed to add to cart", error);
      }
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorited) {
      triggerToast("Saved to Wishlist!", "wish");
    }
  };

  // Trigger the parent's Quick View logic
  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView();
  };

  return (
    <div 
      onClick={toggleActive}
      className={`group relative flex flex-col w-full max-w-[270px] mx-auto h-[360px] bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 overflow-hidden rounded-sm border border-transparent 
      ${isActive ? "shadow-xl border-gray-100 dark:border-slate-800" : "hover:shadow-xl hover:border-gray-100 dark:hover:border-slate-800"} 
      touch-manipulation cursor-pointer`}
    >
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="absolute top-12 left-0 right-0 z-[60] px-4 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-full shadow-lg text-white text-[10px] font-bold uppercase tracking-widest font-josefin
            ${toast.type === 'cart' ? 'bg-[#08D15F]' : 'bg-[#FB2E86]'}`}>
            {toast.type === 'cart' ? <Check size={12} /> : <Heart size={12} fill="white" />}
            {toast.message}
          </div>
        </div>
      )}
      
      {/* 1. TOP SECTION */}
      <div className={`relative h-[230px] w-full flex justify-center items-center transition-colors duration-300
        ${isActive ? "bg-[#ebedf3] dark:bg-slate-700" : "bg-[#F6F7FB] dark:bg-slate-800 group-hover:bg-[#ebedf3] dark:group-hover:bg-slate-700"}`}>
        
        {/* Action Icons */}
        <div className={`absolute top-2 left-2 flex gap-1.5 transition-all duration-300 z-20
          ${isActive 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}>
          
          <button 
            onClick={handleAddToCart}
            disabled={isPending}
            className={`p-1.5 rounded-full transition-all shadow-sm flex items-center justify-center w-8 h-8
              ${isPending ? "bg-gray-100 text-gray-400" : "bg-white dark:bg-slate-700 text-[#1389FF] hover:bg-[#2F1AC4] hover:text-white"}`}
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
          </button>

          <button 
            onClick={handleWishlistToggle}
            className={`p-1.5 rounded-full transition-all shadow-sm flex items-center justify-center w-8 h-8
              ${isFavorited 
                ? "bg-[#FB2E86] text-white" 
                : "bg-white dark:bg-slate-700 text-[#1389FF] hover:bg-[#FB2E86] hover:text-white"}`}
          >
            <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
          </button>

          <button 
            onClick={handleQuickViewClick} // Updated to call the parent handler
            className="p-1.5 text-[#1389FF] bg-white dark:bg-slate-700 hover:bg-[#1389FF] hover:text-white rounded-full shadow-sm transition-colors w-8 h-8 flex items-center justify-center"
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
        
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300
          ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}>
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