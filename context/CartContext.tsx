"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart } from "@/app/actions/cart";

interface CartContextType {
  cart: any | null;
  cartCount: number;
  subtotal: number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  cartCount: 0,
  subtotal: 0,
  refreshCart: async () => {},
  isLoading: true,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Cart sync error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Derived values
  const cartCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const subtotal = cart?.items?.reduce((acc: number, item: any) => 
    acc + (item.product.price * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, subtotal, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);