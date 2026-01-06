"use client";

import Image from "next/image";
import { Search, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  categories: { name: string; count: number }[];
  recentPosts: any[];
}

export default function BlogSidebar({ categories, recentPosts }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  // Handle Search Input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/blog?query=${encodeURIComponent(searchValue)}`);
    } else {
      router.push("/blog");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* 1. Search Widget */}
      <div className="space-y-4">
        <h3 className="text-[22px] font-bold font-josefin text-[#151875] dark:text-white">Search</h3>
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for posts" 
            className="w-full border-2 border-[#BFC6E0] dark:border-slate-700 rounded-md py-3 px-4 focus:outline-none focus:border-[#FB2E86] bg-transparent text-sm text-[#151875] dark:text-white"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="text-[#BFC6E0] hover:text-[#FB2E86] transition-colors" size={18} />
          </button>
        </form>
      </div>

      {/* 2. Categories Widget (Now Dynamic) */}
      <div className="space-y-4">
        <h3 className="text-[22px] font-bold font-josefin text-[#151875] dark:text-white">Categories</h3>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/blog?category=${cat.name}`}
              className={`flex items-center justify-between p-3 rounded-sm transition-all group ${
                searchParams.get('category') === cat.name 
                ? "bg-[#FB2E86] text-white" 
                : "hover:bg-[#FB2E86]/10 text-[#3F509E] dark:text-slate-300"
              }`}
            >
              <span className={`text-sm font-josefin group-hover:translate-x-1 transition-transform ${
                searchParams.get('category') === cat.name ? "text-white" : ""
              }`}>
                {cat.name}
              </span>
              <span className="text-xs bg-[#F3F9FF] dark:bg-slate-800 px-2 py-0.5 rounded text-[#3F509E] dark:text-slate-400">
                ({cat.count})
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Recent Post Widget (Now Dynamic) */}
      <div className="space-y-4">
        <h3 className="text-[22px] font-bold font-josefin text-[#151875] dark:text-white">Recent Post</h3>
        <div className="space-y-5">
          {recentPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="flex gap-4 items-center group cursor-pointer">
              <div className="relative w-16 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-slate-100">
                <Image src={post.mainImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-[#3F509E] dark:text-white truncate group-hover:text-[#FB2E86]">
                  {post.title}
                </h4>
                <p className="text-[11px] text-[#8A8FB9]">
                  {new Date(post.publishedAt).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Sale Product Widget */}
      {/* Keep this as is or pull from Product model later */}
      <div className="space-y-4">
        <h3 className="text-[22px] font-bold font-josefin text-[#151875] dark:text-white">Sale Product</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center group cursor-pointer">
              <div className="relative w-16 h-14 bg-[#F5F6F8] rounded-sm flex-shrink-0">
                 <Image src={`/images/sale-prod-${i}.png`} alt="Sale" fill className="object-contain p-2" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#3F509E] dark:text-white group-hover:text-[#FB2E86]">Furniture Collection</h4>
                <p className="text-[11px] text-[#8A8FB9] line-through">₦12,000</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Follow Widget */}
      <div className="space-y-4">
        <h3 className="text-[22px] font-bold font-josefin text-[#151875] dark:text-white">Follow</h3>
        <div className="flex gap-3">
          {[Facebook, Instagram, Twitter].map((Icon, idx) => (
            <button key={idx} className="w-8 h-8 rounded-full bg-[#5625DF] text-white flex items-center justify-center hover:bg-[#FB2E86] transition-all hover:-translate-y-1 shadow-md">
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* 6. Tags Widget (Linked to dynamic filtering) */}
      <div className="space-y-4">
        <h3 className="text-[22px] font-bold font-josefin text-[#151875] dark:text-white">Tags</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {["General", "Atsanil", "Insas", "Bibsa"].map((tag) => (
            <Link 
              key={tag} 
              href={`/blog?tag=${tag}`} 
              className={`text-sm underline hover:text-[#FB2E86] transition-colors decoration-[#FB2E86]/30 ${
                searchParams.get('tag') === tag ? "text-[#FB2E86] font-bold" : "text-[#151875] dark:text-slate-400"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}