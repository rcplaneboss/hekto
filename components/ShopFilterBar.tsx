"use client";

import { Grid, List, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";


interface FilterBarProps {
  totalCount: number;
  executionTime?: string; 
}


export default function ShopFilterBar({ totalCount, executionTime }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to create a new URL string with updated params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // Reset to page 1 if filter changes
      if (name !== "page") params.delete("page"); 
      return params.toString();
    },
    [searchParams]
  );

  const handleUpdate = (name: string, value: string) => {
    router.push(`/shop?${createQueryString(name, value)}`, { scroll: false });
  };

  const currentView = searchParams.get("view") || "grid";

  return (
    <div className="py-12 bg-white dark:bg-slate-950 ">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-[#151875] dark:text-white text-xl font-bold font-josefin">
              Ecommerce Accessories & Fashion item
            </h2>
            <p className="text-[#8A8FB9] dark:text-slate-400 text-xs mt-1">
              About {totalCount.toLocaleString()} results found ({executionTime} seconds)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-[#151875] dark:text-slate-300 text-sm">Per Page:</span>
              <input 
                type="number" 
                placeholder="12"
                className="w-14 h-8 border dark:border-slate-700 dark:bg-slate-900 px-1 text-center text-sm"
                onBlur={(e) => handleUpdate("limit", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate("limit", e.currentTarget.value)}
              />
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-[#151875] dark:text-slate-300 text-sm">Sort By:</span>
              <select 
                onChange={(e) => handleUpdate("sort", e.target.value)}
                value={searchParams.get("sort") || "newest"}
                className="border dark:border-slate-700 dark:bg-slate-900 text-sm p-1 outline-none text-[#8A8FB9]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Changer - FIXED */}
            <div className="flex items-center gap-2">
              <span className="text-[#151875] dark:text-slate-300 text-sm">View:</span>
              <button 
                onClick={() => handleUpdate("view", "grid")}
                className={`p-1 transition-colors ${currentView === "grid" ? "text-[#FB2E86]" : "text-[#151875] dark:text-white"}`}
              >
                <Grid size={18} strokeWidth={currentView === "grid" ? 3 : 2} />
              </button>
              <button 
                onClick={() => handleUpdate("view", "list")}
                className={`p-1 transition-colors ${currentView === "list" ? "text-[#FB2E86]" : "text-[#151875] dark:text-white"}`}
              >
                <List size={18} strokeWidth={currentView === "list" ? 3 : 2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}