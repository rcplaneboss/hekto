// app/shop-left-sidebar/_components/SidebarFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const DISCOUNTS = [
    { label: "20% Cash Back", value: "20" },
    { label: "5% Cash Back", value: "5" },
    { label: "25% Discount", value: "25" },
    { label: "30% Discount", value: "30" },
    { label: "50% Discount", value: "50" }
];
const PRICES = [
    { label: "$0.00 - $150.00", value: "0-150" },
    { label: "$150.00 - $350.00", value: "150-350" },
    { label: "$350.00 - $500.00", value: "350-500" },
    { label: "$500.00 +", value: "500-99999" }
];

interface SidebarProps {
    categories: { name: string; slug: string; count: number }[];
    tagCounts: { tag: string; count: number }[];
}

export default function SidebarFilters({ categories, tagCounts }: SidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(name) === value) {
            params.delete(name);
        } else {
            params.set(name, value);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const isSelected = (name: string, value: string) => searchParams.get(name) === value;

    return (
        <div className="flex flex-col gap-10">
            {/* 1. Product Tags */}
            <div>
                <h3 className="text-[#151875] dark:text-white font-josefin text-xl font-bold border-b-2 border-[#151875] inline-block mb-5">Product Tags</h3>
                <div className="flex flex-col gap-3">
                    {tagCounts.map(({ tag, count }) => (
                        <label key={tag} className="flex items-center justify-between group cursor-pointer text-[#7E81A2] hover:text-[#FB2E86] transition-colors">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={isSelected("brand", tag)}
                                    onChange={() => updateFilter("brand", tag)}
                                    className="w-4 h-4 accent-[#FB2E86] rounded" 
                                />
                                <span className="font-lato capitalize">{tag}</span>
                            </div>
                            <span className="text-xs">({count})</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 2. Discount Offer */}
            <div>
                <h3 className="text-[#151875] dark:text-white font-josefin text-xl font-bold border-b-2 border-[#151875] inline-block mb-5">Discount Offer</h3>
                <div className="flex flex-col gap-3">
                    {DISCOUNTS.map((d) => (
                        <label key={d.value} className="flex items-center gap-2 cursor-pointer text-[#7E81A2] hover:text-[#FF2F91]">
                            <input 
                                type="checkbox" 
                                checked={isSelected("discount", d.value)}
                                onChange={() => updateFilter("discount", d.value)}
                                className="w-4 h-4 accent-[#FF2F91]" 
                            />
                            <span className="font-lato">{d.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 3. Rating Filter */}
            <div>
                <h3 className="text-[#151875] dark:text-white font-josefin text-xl font-bold border-b-2 border-[#151875] inline-block mb-5">Rating Item</h3>
                <div className="flex flex-col gap-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={isSelected("rating", star.toString())}
                                onChange={() => updateFilter("rating", star.toString())}
                                className="w-4 h-4 accent-[#FFB265]" 
                            />
                            <div className="flex text-[#FFB265] text-sm">
                                {"★".repeat(star)}{"☆".repeat(5-star)}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* 4. Categories */}
            <div>
                <h3 className="text-[#151875] dark:text-white font-josefin text-xl font-bold border-b-2 border-[#151875] inline-block mb-5">Categories</h3>
                <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                        <label key={cat.slug} className="flex items-center justify-between group cursor-pointer text-[#7E81A2] hover:text-[#FB2E86]">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={isSelected("category", cat.slug)}
                                    onChange={() => updateFilter("category", cat.slug)}
                                    className="w-4 h-4 accent-[#FB2E86]" 
                                />
                                <span className="font-lato">{cat.name}</span>
                            </div>
                            <span className="text-xs">({cat.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 5. Price Filter */}
            <div>
                <h3 className="text-[#151875] dark:text-white font-josefin text-xl font-bold border-b-2 border-[#151875] inline-block mb-5">Price Filter</h3>
                <div className="flex flex-col gap-3">
                    {PRICES.map((p) => (
                        <label key={p.value} className="flex items-center gap-2 cursor-pointer text-[#7E81A2] hover:text-[#FB2E86]">
                            <input 
                                type="checkbox" 
                                checked={isSelected("price", p.value)}
                                onChange={() => updateFilter("price", p.value)}
                                className="w-4 h-4 accent-[#FB2E86]" 
                            />
                            <span className="font-lato">{p.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {searchParams.toString() && (
                <button 
                    onClick={() => router.push("/shop-left-sidebar")}
                    className="mt-4 py-2 px-4 bg-[#FB2E86] text-white rounded-md font-josefin text-sm self-start hover:bg-[#d42274] transition-all"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
}