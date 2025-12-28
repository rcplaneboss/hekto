"use client";

import Image from "next/image";
import { ShoppingCart, Heart, Search } from "lucide-react";

interface ProductCardProps {
  product: any;
  view?: string; 
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const isList = view === "list";
  
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  return (
    <div className={`group transition-all duration-300 ${
      isList 
        ? "flex flex-row items-center gap-3 p-2 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-[#F6F7FB] dark:border-slate-800" 
        : "flex flex-col items-center bg-white dark:bg-slate-900 w-full max-w-[200px] mx-auto" 
    }`}>
      
      {/* Image Container */}
      <div className={`relative bg-[#F6F7FB] dark:bg-slate-800 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-[#EBF4F3] ${
        isList ? "w-28 h-28 sm:w-32 sm:h-32 shrink-0" : "w-full aspect-square"
      }`}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={100} 
          height={100}
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />

        {!isList && (
          <div className="absolute bottom-2 left-[-40px] group-hover:left-2 flex flex-col gap-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100">
            <IconButton icon={<ShoppingCart size={13} />} />
            <IconButton icon={<Heart size={13} />} />
            <IconButton icon={<Search size={13} />} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`flex flex-col min-w-0 ${isList ? "flex-1 text-left items-start px-1" : "mt-2 text-center items-center w-full"}`}>
        <h3 className="text-[#151875] dark:text-white font-bold font-josefin text-[13px] leading-tight mb-1 truncate w-full">
          {product.name}
        </h3>

        <div className={`flex gap-1 mb-1 ${isList ? "justify-start" : "justify-center"}`}>
          {product.colors.slice(0, 3).map((color: string, index: number) => (
            <div key={index} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          ))}
        </div>

        <div className={`flex items-center gap-2 font-josefin ${isList ? "mb-1.5" : "mb-0.5"}`}>
          <span className="text-[#151875] dark:text-white text-[12px] font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-[#FB2E86] text-[10px] line-through opacity-70">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {isList && (
          <>
            <p className="text-[#8A8FB9] dark:text-slate-400 font-lato text-[10px] leading-tight mb-2 line-clamp-2 max-w-xs">
              {product.description || "High-quality fashion item."}
            </p>
            <div className="flex gap-1.5">
              <IconButton icon={<ShoppingCart size={13} />} />
              <IconButton icon={<Heart size={13} />} />
              <IconButton icon={<Search size={13} />} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white transition-all border border-gray-100 dark:border-slate-700">
      {icon}
    </button>
  );
}