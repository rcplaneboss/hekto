"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Search, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { addToCart } from "@/app/actions/cart";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: any;
  view?: string;
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const isList = view === "list";
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);
  const { refreshCart } = useCart();

  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        await addToCart(product.id, 1);
          await refreshCart();
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        console.error("Cart error:", error);
        alert("Could not add to cart. Please check your connection.");
      }
    });
  };

  return (
    <Link href={`/shop/${product.id}`} className="no-underline">
      <div className={`group transition-all duration-300 ${isList
        ? "flex flex-row items-center gap-3 p-2 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-[#F6F7FB] dark:border-slate-800 rounded-sm"
        : "flex flex-col items-center bg-white dark:bg-slate-900 w-full max-w-[200px] mx-auto"
        }`}>

        {/* Image Container */}
        <div className={`relative bg-[#F6F7FB] dark:bg-slate-800 flex items-center justify-center overflow-hidden transition-all duration-300  ${isList ? "w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-sm" : "w-full aspect-square"
          }`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={120}
            height={120}
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />

          {!isList && (
            <div className="absolute bottom-2 left-[-40px] group-hover:left-2 flex flex-col gap-1.5 transition-all duration-300 opacity-0 max-md:opacity-100 md:group-hover:opacity-100">
              <IconButton 
                icon={isPending ? <Loader2 size={13} className="animate-spin" /> : isAdded ? <Check size={13} /> : <ShoppingCart size={13} />} 
                onClick={handleAddToCart}
                active={isAdded}
                disabled={isPending}
              />
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
            {product.colors && product.colors.slice(0, 3).map((color: string, index: number) => (
              <div key={index} className="w-1.5 h-1.5 rounded-full border border-black/5" style={{ backgroundColor: color }} />
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
                {product.description || "High-quality fashion item crafted for comfort and style."}
              </p>
              <div className="flex gap-1.5">
                <IconButton 
                  icon={isPending ? <Loader2 size={13} className="animate-spin" /> : isAdded ? <Check size={13} /> : <ShoppingCart size={13} />} 
                  onClick={handleAddToCart}
                  active={isAdded}
                  disabled={isPending}
                />
                <IconButton icon={<Heart size={13} />} />
                <IconButton icon={<Search size={13} />} />
              </div>
            </>
          )}
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

  const internalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <button 
      type="button" 
      disabled={disabled}
      className={`p-1.5 rounded-full shadow-sm transition-all border flex items-center justify-center
        ${active 
          ? "bg-green-500 text-white border-green-500" 
          : "bg-white dark:bg-slate-800 text-[#151875] dark:text-white hover:bg-[#FB2E86] hover:text-white border-gray-100 dark:border-slate-700"
        }
        ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
      `} 
      onClick={internalClick}
    >
      {icon}
    </button>
  );
}