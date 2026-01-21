"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, User, MapPin, CreditCard } from "lucide-react";
import { useGuestCart } from "@/context/GuestCartContext";

export default function GuestCheckoutPage() {
  const router = useRouter();
  const { getSessionId } = useGuestCart();
  const [loading, setLoading] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("sessionId", getSessionId());
    formData.append("isGuest", "true");
    
    if (createAccount) {
      formData.append("createAccount", "true");
      formData.append("password", formData.get("password") as string);
    }

    try {
      const response = await fetch("/api/checkout/guest", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        router.push(`/order-confirmation/${result.orderId}`);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/cart"
            className="flex items-center gap-2 text-[#FB2E86] hover:text-pink-600"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white mb-8">
              Guest Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="text-[#FB2E86]" size={20} />
                  <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                    Contact Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-[#FB2E86]" size={20} />
                  <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                    Shipping Address
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Apartment, suite, etc.
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Creation Option */}
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="text-[#FB2E86]" size={20} />
                  <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                    Account Options
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="createAccount"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="rounded border-slate-300 text-[#FB2E86] focus:ring-[#FB2E86]"
                  />
                  <label htmlFor="createAccount" className="text-sm text-slate-600 dark:text-slate-300">
                    Create an account for faster checkout next time
                  </label>
                </div>
                
                {createAccount && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required={createAccount}
                      className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-700"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FB2E86] text-white py-3 rounded-lg font-josefin font-bold hover:bg-pink-600 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Complete Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6 sticky top-8">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
                Order Summary
              </h3>
              {/* Order summary will be populated by cart items */}
              <div className="text-center py-8 text-slate-500">
                Loading cart items...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}