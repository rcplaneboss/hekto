"use client";

import { useState } from "react";
import { createPromoBanner } from "@/app/actions/promoActions";

export default function PromoBannerForm({ products }: { products: any[] }) {
    const [loading, setLoading] = useState(false);

    async function clientAction(formData: FormData) {
        setLoading(true);
        try {
            await createPromoBanner(formData);
            alert("Promo Banner Created!");
        } catch (err) {
            alert("Error creating banner");
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#FB2E86] outline-none transition-all text-[#151875] dark:text-white";

    return (
        <div className="w-screen bg-gray-50 dark:bg-slate-900 h-screen flex items-center justify-center p-4">
            <form action={clientAction} className="max-w-3xl p-6 bg-gray-50 dark:bg-slate-900 rounded-xl shadow-lg space-y-6">
                <h2 className="text-2xl font-bold font-josefin text-[#151875] dark:text-white">New Promo Highlight</h2>

                <div className="space-y-2">
                    <label className="text-sm font-semibold dark:text-white font-josefin">Banner Title</label>
                    <input name="title" placeholder="e.g. Unique Features Of Latest & Trending Products" className={inputClass} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold dark:text-white font-josefin">Link to Product</label>
                        <select name="productId" className={inputClass} required>
                            <option value="">Select a product...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold dark:text-white font-josefin">Custom Image (Optional)</label>
                        <input name="image" type="file" className={inputClass} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold dark:text-white font-josefin">Bullet Features (One per line)</label>
                    <textarea
                        name="features"
                        rows={4}
                        placeholder="All frames constructed with hardwood solids...&#10;Reinforced with double wood dowels...&#10;Arms, backs and seats are structurally reinforced"
                        className={inputClass}
                        required
                    />
                    <p className="text-xs text-gray-400">Each new line will become a colorful bullet point.</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FB2E86] hover:bg-pink-600 text-white font-bold py-3 rounded-md transition-colors disabled:bg-gray-400"
                >
                    {loading ? "Saving Banner..." : "Create Promo Banner"}
                </button>
            </form>

            
        </div>
    );
}