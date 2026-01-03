"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/app/actions/cart";
import { Trash2, ShoppingCart, HeartOff, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useTransition } from "react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { refreshCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleMoveToCart = (product: any) => {
    startTransition(async () => {
      try {
        await addToCart(product.id, 1, product.colors?.[0] || null);
        refreshCart();
        // Optional: Remove from wishlist once added to cart
        // toggleWishlist(product); 
      } catch (error) {
        console.error("Error moving to cart", error);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20 font-josefin">
      <PageHeader title="My Wishlist" />

      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-20">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b dark:border-slate-800 text-[#151875] dark:text-white font-bold text-xl">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-4 text-right">Action</div>
            </div>

            {/* Wishlist Items */}
            {wishlist.map((item) => (
              <div 
                key={item.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b dark:border-slate-800 animate-in fade-in slide-in-from-bottom-3"
              >
                {/* Product Info */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#F6F7FB] dark:bg-slate-900 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div>
                    <Link href={`/shop/${item.id}`} className="text-[#151875] dark:text-white font-bold hover:text-[#FB2E86] transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-[#A1A8C1] mt-1">Category: {item.category?.name || "General"}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center text-[#151875] dark:text-[#FB2E86] font-bold">
                  ${item.price.toFixed(2)}
                </div>

                {/* Actions */}
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center gap-2 bg-[#FB2E86] text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-pink-600 transition-all active:scale-95"
                  >
                    <ShoppingCart size={16} />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                  <button 
                    onClick={() => toggleWishlist(item)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors border dark:border-slate-800 rounded-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
              <HeartOff size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#151875] dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-[#A1A8C1] mb-8">Save items you love here to find them easily later.</p>
            <Link 
              href="/shop" 
              className="flex items-center gap-2 bg-[#FB2E86] text-white px-8 py-3 rounded-sm font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20"
            >
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}