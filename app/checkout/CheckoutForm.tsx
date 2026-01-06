"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/order"; 
import { Loader2 } from "lucide-react";

export default function CheckoutForm({ user }: { user: any }) {
  const { cart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);

  
  const inputClass = `
    w-full bg-transparent border-b-2 border-[#BFC6E0] dark:border-slate-600 
    py-3 focus:outline-none focus:border-[#FB2E86] dark:focus:border-[#FB2E86] 
    transition-colors text-sm text-[#151875] dark:text-white placeholder:text-[#BFC6E0]
    dark:placeholder:text-slate-500
  `;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold font-josefin text-[#151875] dark:text-white mb-4">Your cart is empty</h2>
        <Link href="/shop" className="bg-[#FB2E86] text-white px-6 py-2 rounded-sm font-josefin">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Shipping Form */}
        <div className="lg:col-span-2 bg-[#F8F8FD] dark:bg-slate-800/40 p-6 md:p-10 rounded-sm border border-transparent dark:border-slate-700">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold font-josefin text-[#1D3178] dark:text-white">Contact Information</h2>
            <p className="text-xs text-[#C1C8E1] dark:text-slate-400 font-medium">
              Already have an account? <Link href="/login" className="underline text-[#FB2E86]">Log in</Link>
            </p>
          </div>

          <form action={async (formData) => {
            setLoading(true);
            const result = await createOrder(formData);
            if (result.success) window.location.href = `/order-completed/${result.orderId}`;
            setLoading(false);
          }} className="space-y-8">
            
            {/* Contact Details */}
            <div className="space-y-4">
              <input 
                name="email" 
                type="email" 
                defaultValue={user?.email}
                placeholder="Email or mobile phone number" 
                className={inputClass}
                required
              />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="newsletter" className="accent-[#19D16F] w-4 h-4" />
                <label htmlFor="newsletter" className="text-[12px] text-[#8A8FB9] dark:text-slate-400 font-medium">
                  Keep me up to date on news and exclusive offers
                </label>
              </div>
            </div>

            {/* Shipping Address */}
            <h2 className="text-lg font-bold font-josefin text-[#1D3178] dark:text-white mt-12 mb-8">Shipping address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="firstName" placeholder="First name (optional)" className={inputClass} />
              <input name="lastName" placeholder="Last name" className={inputClass} required />
              <input name="address" placeholder="Address" className={`${inputClass} md:col-span-2`} required />
              <input name="apartment" placeholder="Apartment, suite, etc. (optional)" className={`${inputClass} md:col-span-2`} />
              <input name="city" placeholder="City" className={`${inputClass} md:col-span-2`} required />
              <input name="country" defaultValue="Bangladesh" className={inputClass} required />
              <input name="postalCode" placeholder="Postal Code" className={inputClass} required />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-12 bg-[#FB2E86] text-white px-8 py-3 rounded-sm font-josefin font-semibold hover:bg-pink-600 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Continue Shipping
            </button>
          </form>
        </div>

        {/* RIGHT: Order Summary Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {cart.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-[#E1E1E1] dark:border-slate-700 pb-4">
                <div className="relative w-16 h-16 bg-[#F5F5F7] dark:bg-slate-700 rounded-sm flex-shrink-0">
                  <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-2" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-black dark:text-white font-josefin truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-[#A1A8C1] dark:text-slate-400">Color: {item.color || 'N/A'}</p>
                  <p className="text-[10px] text-[#A1A8C1] dark:text-slate-400">Size: {item.size || 'N/A'}</p>
                </div>
                <p className="text-sm font-bold text-[#151875] dark:text-slate-300 font-josefin flex-shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Box */}
          <div className="bg-[#F4F4FC] dark:bg-slate-800/80 p-6 rounded-sm space-y-4 border border-transparent dark:border-slate-700 shadow-sm">
            <div className="flex justify-between border-b border-[#E8E6F1] dark:border-slate-700 pb-3">
              <span className="text-lg font-semibold text-[#1D3178] dark:text-white font-josefin">Subtotal:</span>
              <span className="text-lg font-semibold text-[#1D3178] dark:text-white font-josefin">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E6F1] dark:border-slate-700 pb-3">
              <span className="text-lg font-semibold text-[#1D3178] dark:text-white font-josefin">Total:</span>
              <span className="text-lg font-semibold text-[#1D3178] dark:text-white font-josefin">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <div className="w-3 h-3 bg-[#19D16F] rounded-full" />
              <p className="text-[12px] text-[#8A91AB] dark:text-slate-400">Shipping & taxes calculated at checkout</p>
            </div>
            <button className="w-full bg-[#19D16F] text-white py-3 rounded-md font-bold text-sm hover:bg-green-600 transition-all mt-4">
              Proceed To Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}