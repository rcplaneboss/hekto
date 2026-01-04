"use client";

import { X, ShoppingCart, Heart, Star } from "lucide-react";
import Image from "next/image";

interface QuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  onWishlist: () => void;
  isFavorited: boolean;
}

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, onWishlist, isFavorited }: QuickViewProps) {
  if (!isOpen || !product) return null;

  // --- DYNAMIC RATING CALCULATION ---
  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  
  // Calculate average rating (1-5)
  const averageRating = reviewCount > 0 
    ? Math.round(reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewCount)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-lg shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-[#FB2E86] z-10 transition-colors">
          <X size={24} />
        </button>

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 bg-[#F6F7FB] dark:bg-slate-800 flex items-center justify-center p-8">
          <div className="relative w-full aspect-square">
            <Image 
              src={product.imageUrl} 
              alt={product.name} 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#151875] dark:text-white font-josefin mb-2">
            {product.name}
          </h2>
          
          {/* UPDATED: Dynamic Rating Section */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={14} 
                  className={star <= averageRating 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300 dark:text-slate-600"
                  } 
                />
              ))}
            </div>
            <span className="text-[#151875] dark:text-slate-400 text-xs font-josefin">
              ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#151875] dark:text-white font-bold font-josefin">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[#FB2E86] line-through text-sm font-josefin">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm font-josefin mb-6 leading-relaxed">
            {product.description || "Sophisticated design meets unparalleled comfort in this collection piece."}
          </p>

          <div className="flex flex-wrap gap-4 mt-auto">
            <button 
              onClick={onAddToCart}
              className="bg-[#FB2E86] text-white px-6 py-2 rounded-sm font-josefin font-bold text-sm hover:bg-[#e02a78] transition-all flex items-center gap-2"
            >
              <ShoppingCart size={16} /> Add To Cart
            </button>
            
            <button 
              onClick={onWishlist}
              className={`p-2 border rounded-sm transition-all ${
                isFavorited 
                  ? 'border-[#FB2E86] text-[#FB2E86]' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
