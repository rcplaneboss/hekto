"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Search } from "lucide-react";

export default function FeaturedProductCard({ product }: { product: any }) {
  return (
    /* Added 'active:shadow-xl' and 'group' focus logic */
    <div className="group relative flex flex-col w-full max-w-[270px] mx-auto h-[360px] bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-800 touch-manipulation">
      
      {/* 1. TOP SECTION */}
      <div className="relative h-[230px] w-full bg-[#F6F7FB] dark:bg-slate-800 flex justify-center items-center 
        group-hover:bg-[#ebedf3] group-active:bg-[#ebedf3] dark:group-hover:bg-slate-700 dark:group-active:bg-slate-700 transition-colors duration-300">
        
        {/* Action Icons: Added group-active:opacity-100 and group-active:translate-x-0 */}
        <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 -translate-x-2 
          group-hover:opacity-100 group-hover:translate-x-0 
          group-active:opacity-100 group-active:translate-x-0 transition-all duration-300 z-20">
          <button className="p-1.5 bg-white dark:bg-slate-700 text-[#1389FF] rounded-full hover:bg-[#2F1AC4] hover:text-white transition-colors shadow-sm">
            <ShoppingCart size={14} />
          </button>
          <button className="p-1.5 text-[#1389FF] hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors">
            <Heart size={14} />
          </button>
          <button className="p-1.5 text-[#1389FF] hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors">
            <Search size={14} />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 transition-transform duration-500 group-hover:scale-105 group-active:scale-105">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            fill
            className="object-contain"
            sizes="250px"
          />
        </div>
        
        {/* View Details Button: Added group-active utilities */}
        <button className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 
          group-hover:opacity-100 group-hover:translate-y-0 
          group-active:opacity-100 group-active:translate-y-0 
          bg-[#08D15F] text-white px-3 py-1.5 text-[10px] font-bold rounded-sm transition-all duration-300 hover:bg-green-600 shadow-md uppercase tracking-tighter font-josefin">
          View Details
        </button>
      </div>

      {/* 2. BOTTOM SECTION: Added group-active:bg-[#2F1AC4] */}
      <div className="flex-grow flex flex-col justify-center p-3 text-center 
        group-hover:bg-[#2F1AC4] group-active:bg-[#2F1AC4] transition-colors duration-300">
        
        <h3 className="text-[#FB2E86] group-hover:text-white group-active:text-white font-bold text-sm mb-1 truncate transition-colors font-josefin">
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
          <p className="text-[#151875] dark:text-slate-300 group-hover:text-white group-active:text-white text-[10px] font-bold transition-colors tracking-widest font-josefin">
            Code - <span className="font-josefin uppercase text-xs">{product.code}</span>
          </p>
          <p className="text-[#151875] dark:text-white group-hover:text-white group-active:text-white text-sm font-bold transition-colors">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}