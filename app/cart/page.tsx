"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, CheckCircle, X } from "lucide-react";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/app/actions/cart";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/context/CartContext";

type CartData = {
  id: string;
  items: {
    id: string;
    quantity: number;
    color: string | null;
    size: string | null;
    product: {
      name: string;
      price: number;
      imageUrl: string;
    };
  }[];
} | null;

export default function CartPage() {
  const [cart, setCart] = useState<CartData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [shippingInfo, setShippingInfo] = useState({ country: "", city: "", postal: "" });
  
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = (itemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    setCart((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        ),
      };
    });

    startTransition(async () => {
      await updateCartItem(itemId, newQty);
      refreshCart(); 
    });
  };

  const handleRemove = async (itemId: string) => {
    setCart((prev) => {
      if (!prev) return null;
      return { ...prev, items: prev.items.filter((i) => i.id !== itemId) };
    });
    startTransition(async () => {
      await removeCartItem(itemId);
      refreshCart();
    });
  };

  const handleClearCart = () => {
    if (!cart) return;
    setCart({ ...cart, items: [] });
    startTransition(async () => {
      await clearCart(cart.id);
      refreshCart();
    });
  };

  const subtotal = cart?.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;
  const shippingCost = subtotal > 0 ? 50.00 : 0; 
  const grandTotal = subtotal + shippingCost;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <PageHeader title="Shopping Cart" />
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-[#FB2E86] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-josefin text-xl text-[#151875] dark:text-white font-bold">Loading Cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <PageHeader title="Shopping Cart" />
        <div className="container mx-auto px-4 py-20 text-center font-josefin">
          <div className="mb-6 flex justify-center">
             <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300 dark:text-slate-600">
                <Trash2 size={48} />
             </div>
          </div>
          <h2 className="text-3xl font-bold text-[#151875] dark:text-white mb-4">Your Cart Is Empty</h2>
          <p className="text-gray-400 mb-8 dark:text-gray-400">Looks like you haven't made your choice yet...</p>
          <Link href="/shop" className="inline-block bg-[#FB2E86] text-white px-8 py-3 rounded-sm font-bold hover:bg-pink-600 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
            Back To Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-20 font-josefin transition-colors duration-300">
      <PageHeader title="Shopping Cart" />
      
      <div className="container mx-auto px-4 py-8 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900">
              
              {/* --- DESKTOP TABLE (Hidden on Mobile) --- */}
              <div className="hidden overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[#1D3178] dark:text-[#FB2E86] text-lg font-bold text-left">
                      <th className="pb-6 w-[40%]">Product</th>
                      <th className="pb-6 w-[20%]">Price</th>
                      <th className="pb-6 w-[20%]">Quantity</th>
                      <th className="pb-6 w-[20%] text-right pr-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {cart.items.map((item) => (
                      <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-6 pr-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 border border-gray-100 dark:border-slate-700">
                              <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                              <button onClick={() => handleRemove(item.id)} className="absolute top-0 right-0 p-1 bg-black/70 hover:bg-[#FB2E86] text-white opacity-0 group-hover:opacity-100 transition-all rounded-bl-lg">
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex flex-col gap-1">
                              <h4 className="text-[#000000] dark:text-white text-sm font-semibold truncate max-w-[150px]">{item.product.name}</h4>
                              <p className="text-gray-400 text-xs">Color: {item.color || "Default"}</p>
                              <p className="text-gray-400 text-xs">Size: {item.size || "Regular"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-[#151875] dark:text-slate-200 font-bold text-sm">${item.product.price.toFixed(2)}</td>
                        <td className="py-6">
                           <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 w-[100px] p-1 rounded-sm">
                             <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="w-7 h-7 flex items-center justify-center disabled:opacity-30" disabled={item.quantity <= 1}><Minus size={12} /></button>
                             <span className="text-sm font-bold dark:text-white">{item.quantity}</span>
                             <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="w-7 h-7 flex items-center justify-center"><Plus size={12} /></button>
                           </div>
                        </td>
                        <td className="py-6 text-[#151875] dark:text-white font-bold text-sm text-right pr-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- MOBILE CARDS (Hidden on Desktop) --- */}
              <div className="block space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="border dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[#151875] dark:text-white font-bold text-sm leading-tight">{item.product.name}</h4>
                          <button onClick={() => handleRemove(item.id)} className="text-red-500 p-1"><Trash2 size={16}/></button>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Size: {item.size || "Regular"}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-[#FB2E86] font-bold">${item.product.price.toFixed(2)}</span>
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                            <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} disabled={item.quantity <= 1} className="disabled:opacity-20 dark:text-white"><Minus size={14}/></button>
                            <span className="font-bold text-sm dark:text-white">{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="dark:text-white"><Plus size={14}/></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t dark:border-slate-800">
                <button 
                  onClick={() => refreshCart()} 
                  className="bg-[#FB2E86] text-white font-bold py-3 px-8 rounded-sm hover:bg-pink-700 transition-colors text-sm uppercase tracking-wide"
                >
                  Update Cart
                </button>
                <button onClick={handleClearCart} className="bg-[#FB2E86] text-white font-bold py-3 px-8 rounded-sm hover:bg-pink-700 transition-colors text-sm uppercase tracking-wide">Clear Cart</button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="group">
              <h3 className="text-[#1D3178] dark:text-white text-xl font-bold mb-6 text-center lg:text-left">Cart Totals</h3>
              <div className="bg-[#F4F4FC] dark:bg-slate-800/50 p-8 rounded-sm border dark:border-slate-800">
                <div className="flex justify-between border-b-2 border-[#E8E6F1] dark:border-slate-700 pb-3 mb-4 text-[#1D3178] dark:text-slate-200 font-semibold text-lg">
                  <span>Subtotals:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b-2 border-[#E8E6F1] dark:border-slate-700 pb-3 mb-8 text-[#1D3178] dark:text-white font-semibold text-lg">
                  <span>Totals:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mb-8 text-xs text-gray-400 dark:text-gray-500">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span>Shipping & taxes calculated at checkout</span>
                </div>
                <Link href="/checkout" className="block w-full text-center bg-[#19D16F] text-white font-bold py-3 rounded-sm hover:bg-green-600 transition-all text-sm uppercase tracking-wide shadow-md">Proceed To Checkout</Link>
              </div>
            </div>

            <div>
              <h3 className="text-[#1D3178] dark:text-white text-xl font-bold mb-6 text-center lg:text-left">Calculate Shipping</h3>
              <div className="bg-[#F4F4FC] dark:bg-slate-800/50 p-8 rounded-sm border dark:border-slate-800">
                <div className="space-y-6">
                  <input type="text" placeholder="Country" className="w-full bg-transparent border-b border-[#C7CEE4] dark:border-slate-600 pb-2 focus:outline-none focus:border-[#FB2E86] dark:text-slate-300 text-sm" onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})} />
                  <input type="text" placeholder="City" className="w-full bg-transparent border-b border-[#C7CEE4] dark:border-slate-600 pb-2 focus:outline-none focus:border-[#FB2E86] dark:text-slate-300 text-sm" onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} />
                  <input type="text" placeholder="Postal Code" className="w-full bg-transparent border-b border-[#C7CEE4] dark:border-slate-600 pb-2 focus:outline-none focus:border-[#FB2E86] dark:text-slate-300 text-sm" onChange={(e) => setShippingInfo({...shippingInfo, postal: e.target.value})} />
                  <button className="bg-[#FB2E86] text-white font-bold py-3 px-6 rounded-sm hover:bg-pink-700 transition-all text-sm uppercase tracking-wide w-full">Calculate Shipping</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}