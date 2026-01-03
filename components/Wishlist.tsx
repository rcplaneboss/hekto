"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistButton({ 
  productId, 
  isInitiallyLiked 
}: { 
  productId: string; 
  isInitiallyLiked: boolean;
}) {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const { refreshWishlist } = useWishlist();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Optimistic Update
    setIsLiked(!isLiked);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error();
      
      refreshWishlist(); // Sync the Header badge
    } catch (error) {
      setIsLiked(isInitiallyLiked); // Rollback
      alert("Please login to manage your wishlist.");
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-pink-50 transition-all group"
    >
      <Heart 
        size={20} 
        fill={isLiked ? "#FB2E86" : "none"} 
        className={`transition-all duration-300 ${
          isLiked ? "text-[#FB2E86] scale-110" : "text-[#151875] group-hover:text-[#FB2E86]"
        }`} 
      />
    </button>
  );
}