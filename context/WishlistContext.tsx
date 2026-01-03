"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  wishlist: any[];
  wishlistCount: number;
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Accept 'user' as a prop from the Server Component
export const WishlistProvider = ({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: any; 
}) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const wishlistCount = wishlist.length;


  // ... inside WishlistProvider ...

  useEffect(() => {
    const syncWishlist = async () => {
      // Only sync if we have a user AND items in localStorage
      const localData = localStorage.getItem("user-wishlist");
      const localItems = localData ? JSON.parse(localData) : [];

      if (user?.id && localItems.length > 0) {
        try {
          const res = await fetch("/api/wishlist/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              productIds: localItems.map((item: any) => item.id) 
            }),
          });

          if (res.ok) {
            const updatedWishlist = await res.json();
            setWishlist(updatedWishlist);
            // Once synced, clear local storage to prevent double-syncing
            localStorage.removeItem("user-wishlist");
          }
        } catch (error) {
          console.error("Sync failed", error);
        }
      }
    };

    syncWishlist();
  }, [user?.id]); // Fires immediately when auth() detects a user

  // 1. Initial Load
  useEffect(() => {
    const loadWishlist = async () => {
      // Use the 'user' prop passed from auth()
      if (user?.id) {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
          return;
        }
      }
      
      const saved = localStorage.getItem("user-wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    };

    loadWishlist();
  }, [user?.id]); // Re-run if user changes (login/logout)

  // 2. Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("user-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

  const toggleWishlist = async (product: any) => {
    const exists = wishlist.find((item) => item.id === product.id);
    const newWishlist = exists 
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];
    
    setWishlist(newWishlist);

    if (user?.id) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistCount, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};