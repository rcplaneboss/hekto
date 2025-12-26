"use client";

import { useState } from "react";
import { createTrendingPromo } from "@/app/actions/trendingActions";

export default function TrendingPromoForm() {
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#FB2E86] outline-none text-[#151875] dark:text-white";

  return (
    <form action={async (fd) => {
      setLoading(true);
      await createTrendingPromo(fd);
      setLoading(false);
    }} className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 space-y-4">
      <h3 className="text-xl font-bold font-josefin text-[#151875] dark:text-white">Add Trending Promo Banner</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase font-josefin dark:text-white">Banner Title</label>
          <input name="title" placeholder="23% off in all products" className={inputClass} required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase font-josefin dark:text-white">Background Color</label>
          <select name="bgColor" className={inputClass}>
            <option value="#FFF6FB">Soft Pink (Hekto)</option>
            <option value="#EEEFFB">Soft Blue (Hekto)</option>
            <option value="#F2F0FF">Light Purple</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="linkText" placeholder="Link Text (e.g. Shop Now)" className={inputClass} required />
        <input name="linkUrl" placeholder="Link URL (e.g. /shop)" className={inputClass} required />
        <input name="image" type="file" className={inputClass} required />
      </div>

      <button 
        disabled={loading}
        className="w-full bg-[#FB2E86] text-white font-bold py-3 rounded hover:bg-pink-600 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Save Promo Banner"}
      </button>
    </form>
  );
}