"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { ShoppingCart, Heart, Search } from "lucide-react";
import Image from "next/image";

const categories = ["New Arrival", "Best Seller", "Featured", "Special Offer"];

export default function LatestProducts({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState("New Arrival");

  // Map display names to your database tags
  const tagMap: Record<string, string> = {
    "New Arrival": "latest",
    "Best Seller": "bestseller",
    "Featured": "featured",
    "Special Offer": "special",
  };

  const filteredProducts = products.filter((p) => 
    p.tags.includes(tagMap[activeTab])
  ).slice(0, 6); // Showing 6 products as per standard grid layouts

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeading title="Latest Products" />

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-12 font-josefin text-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-lg transition-all duration-300 ${
                activeTab === cat
                  ? "text-[#FB2E86] border-b-2 border-[#FB2E86] font-medium"
                  : "text-[#151875] dark:text-slate-400 hover:text-[#FB2E86]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <LatestProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
function LatestProductCard({ product }: { product: any }) {
  const [isActive, setIsActive] = useState(false);
  
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount 
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  const toggleActive = () => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setIsActive(!isActive);
    }
  };

  return (
    <div 
      onClick={toggleActive}
      className="group flex flex-col items-center w-full max-w-[320px] mx-auto transition-all cursor-pointer touch-manipulation"
    >
      <div className={`relative w-full h-[250px] flex items-center justify-center overflow-hidden rounded-sm mb-3 transition-colors duration-300 ${
        isActive ? "bg-[#ebedf3] dark:bg-slate-700" : "bg-[#F7F7F7] dark:bg-slate-800 group-hover:bg-bg-slate-800"
      }`}>
        
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
             <span className="bg-[#3F509E] text-white px-3 py-0.5 rounded-sm text-[10px] -rotate-12 inline-block font-josefin shadow-md uppercase">
               -{product.discountPercentage}%
             </span>
          </div>
        )}

        {/* Action Icons Logic */}
        <div className={`absolute bottom-4 left-3 flex flex-col gap-2 transition-all duration-300 z-20 ${
          isActive 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
        }`}>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 bg-white dark:bg-slate-600 text-[#151875] dark:text-white rounded-full hover:bg-[#FB2E86] hover:text-white transition-colors shadow-sm"
          >
            <ShoppingCart size={14} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-[#151875] dark:text-white hover:text-[#FB2E86] transition-colors"
          >
            <Heart size={14} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-[#151875] dark:text-white hover:text-[#FB2E86] transition-colors"
          >
            <Search size={14} />
          </button>
        </div>

        <div className={`relative w-36 h-36 md:w-40 md:h-40 transition-transform duration-500 ${
          isActive ? "scale-105" : "group-hover:scale-105"
        }`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain"
            sizes="200px"
          />
        </div>
      </div>

      <div className="w-full flex justify-between items-center text-[13px] px-1">
        <h4 className={`font-josefin border-b-2 border-transparent transition-all truncate max-w-[60%] ${
          isActive ? "text-[#FB2E86] border-[#EEEFFB]" : "text-[#151875] dark:text-white group-hover:text-[#FB2E86] group-hover:border-[#EEEFFB]"
        }`}>
          {product.name}
        </h4>
        <div className="flex gap-2 items-center font-josefin whitespace-nowrap">
          <span className="text-[#151875] dark:text-white font-bold">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-[#FB2E86] line-through text-[11px] opacity-70">
              ${originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}