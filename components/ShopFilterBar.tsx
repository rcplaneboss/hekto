"use client";

import { Grid, List, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterBarProps {
  totalCount: number;
  executionTime?: string;
}

export default function ShopFilterBar({ totalCount, executionTime }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname(); 
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // Reset to page 1 whenever a filter changes
      if (name !== "page") params.set("page", "1"); 
      return params.toString();
    },
    [searchParams]
  );

  // Get active filters for the display
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);
  //     if (name !== "page") params.delete("page");
  //     return params.toString();
  //   },
  //   [searchParams]
  // );

 const handleUpdate = (name: string, value: string) => {
    
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const clearFilters = () => {
    
    router.push(pathname, { scroll: false });
  };

  const currentView = searchParams.get("view") || "grid";

  return (
    <div className="py-12 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-[#151875] dark:text-white text-xl font-bold font-josefin">
              {query || category ? (
                <span className="flex items-center gap-2">
                  Results for &quot;{query || category}&quot;
                  <button 
                    onClick={clearFilters}
                    className="p-1 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-400 hover:text-[#FB2E86] transition-colors"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                </span>
              ) : (
                "Ecommerce Accessories & Fashion item"
              )}
            </h2>
            <p className="text-[#8A8FB9] dark:text-slate-400 text-xs mt-1">
              About {totalCount.toLocaleString()} results found ({executionTime} seconds)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#151875] dark:text-slate-300 text-sm font-josefin">Per Page:</span>
              <input 
                type="number" 
                placeholder="6"
                className="w-14 h-8 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 px-1 text-center text-sm outline-none"
                onBlur={(e) => handleUpdate("limit", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate("limit", e.currentTarget.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#151875] dark:text-slate-300 text-sm font-josefin">Sort By:</span>
              <select 
                onChange={(e) => handleUpdate("sort", e.target.value)}
                value={searchParams.get("sort") || "newest"}
                className="border border-gray-200 dark:border-slate-700 dark:bg-slate-900 text-sm p-1 outline-none text-[#8A8FB9]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#151875] dark:text-slate-300 text-sm font-josefin">View:</span>
              <button onClick={() => handleUpdate("view", "grid")} className={`p-1 ${currentView === "grid" ? "text-[#FB2E86]" : "text-[#151875] dark:text-white"}`}>
                <Grid size={18} strokeWidth={currentView === "grid" ? 3 : 2} />
              </button>
              <button onClick={() => handleUpdate("view", "list")} className={`p-1 ${currentView === "list" ? "text-[#FB2E86]" : "text-[#151875] dark:text-white"}`}>
                <List size={18} strokeWidth={currentView === "list" ? 3 : 2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}