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
        <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-12">
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
  return (
    /* Added max-w and reduced vertical spacing */
    <div className="group flex flex-col items-center w-full max-w-[320px] mx-auto transition-all">
      <div className="relative w-full h-[250px] bg-[#F7F7F7] dark:bg-slate-800 flex items-center justify-center overflow-hidden rounded-sm mb-3">
        
        {/* 'Sale' badge - smaller text */}
        {product.tags.includes("special") && (
          <div className="absolute top-3 left-3 z-10">
             <span className="bg-[#3F509E] text-white px-3 py-0.5 rounded-sm text-[10px] -rotate-12 inline-block font-josefin shadow-sm">
               Sale
             </span>
          </div>
        )}

        {/* Icons - reduced size and spacing */}
        <div className="absolute bottom-4 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all duration-300">
          <button className="p-1.5 bg-[#EEEFFB] text-[#151875] rounded-full hover:bg-[#FB2E86] hover:text-white transition-colors shadow-sm">
            <ShoppingCart size={14} />
          </button>
          <button className="p-1.5 text-[#151875] hover:text-[#FB2E86] transition-colors">
            <Heart size={14} />
          </button>
          <button className="p-1.5 text-[#151875] hover:text-[#FB2E86] transition-colors">
            <Search size={14} />
          </button>
        </div>

        {/* Reduced image size */}
        <div className="relative w-36 h-36 md:w-40 md:h-40">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="200px"
          />
        </div>
      </div>

      {/* Info Row - Tighter layout */}
      <div className="w-full flex justify-between items-center text-[13px] px-1">
        <h4 className="text-[#151875] dark:text-white font-josefin border-b-2 border-transparent group-hover:border-[#EEEFFB] transition-all truncate max-w-[60%]">
          {product.name}
        </h4>
        <div className="flex gap-2 items-center font-josefin whitespace-nowrap">
          <span className="text-[#151875] dark:text-white font-bold">${product.price.toFixed(2)}</span>
          <span className="text-[#FB2E86] line-through text-[11px] opacity-70">
            ${(product.price * 1.3).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}