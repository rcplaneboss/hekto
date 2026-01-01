"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "@/app/actions/cart";

const CartContext = createContext<{
  cartCount: number;
  refreshCart: () => Promise<void>;
}>({
  cartCount: 0,
  refreshCart: async () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const cart = await getCart();
      if (cart?.items) {
        const total = cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(total);
      }
    } catch (error) {
      console.error("Cart sync error:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);