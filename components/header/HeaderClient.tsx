"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, Mail, Phone, Menu, X, Sun, Moon, Monitor, TrendingUp, ChevronDown } from "lucide-react";

export default function HeaderClient({ settings, navLinks }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const trendingSearches = ["Wireless Headphones", "Winter Jackets", "Smart Watches", "Ergonomic Chairs"];
  const popularCategories = [
    { name: "Electronics", url: "/shop?category=electronics" },
    { name: "Fashion", url: "/shop?category=fashion" },
    { name: "Home Decor", url: "/shop?category=home" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearch = (queryOverride?: string) => {
    const finalQuery = queryOverride || searchQuery;
    if (finalQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(finalQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
      setSearchQuery("");
    }
  };

  const updateTheme = () => {
    const isDark = localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    isDark ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
  };

  useEffect(() => { updateTheme(); }, []);

  const setTheme = (mode: "light" | "dark" | "os") => {
    mode === "os" ? localStorage.removeItem("theme") : (localStorage.theme = mode);
    updateTheme();
  };

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="bg-[#7E33E0] text-white py-2 hidden md:block">
        <div className="container mx-auto flex justify-between items-center px-4 text-sm font-josefin">
          <div className="flex gap-8">
             <a href={`mailto:${settings?.topBarEmail}`} className="flex items-center gap-2 hover:text-pink-200">
               <Mail size={14} /> {settings?.topBarEmail || "loading..."}
             </a>
             <a href={`tel:${settings?.topBarPhone}`} className="flex items-center gap-2 hover:text-pink-200">
               <Phone size={14} /> {settings?.topBarPhone || "loading..."}
             </a>
          </div>
          
          <div className="flex items-center gap-5">
            {/* --- RESTORED DESKTOP THEME DROPDOWN --- */}
            <div className="relative group cursor-pointer flex items-center gap-1 py-1 px-2 hover:bg-white/10 rounded transition-colors">
               <span className="flex items-center gap-1">Theme <ChevronDown size={12} /></span>
               <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 text-black dark:text-white shadow-2xl rounded-lg py-2 hidden group-hover:block z-[110] min-w-[130px] border border-gray-100 dark:border-slate-700">
                 <button onClick={() => setTheme("light")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2 text-xs">
                   <Sun size={14} /> Light
                 </button>
                 <button onClick={() => setTheme("dark")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2 text-xs">
                   <Moon size={14} /> Dark
                 </button>
                 <button onClick={() => setTheme("os")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2 text-xs">
                   <Monitor size={14} /> System
                 </button>
               </div>
            </div>

            <Link href="/wishlist" className="flex items-center gap-1 hover:text-pink-200">Wishlist <Heart size={14} /></Link>
            <Link href="/cart" className="hover:text-pink-200"><ShoppingCart size={18} /></Link>
          </div>
        </div>
      </div>

      {/* --- MAIN NAV --- */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 relative z-[70]">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-[#151875] dark:text-white">
            {settings?.logoText || "Hekto"}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 text-[#151875] dark:text-slate-300 font-medium font-josefin">
            {navLinks.map((link: any) => (
              <Link key={link.id} href={link.url} className="hover:text-[#FB2E86] transition-all">{link.label}</Link>
            ))}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center">
            <input 
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border-2 border-gray-100 dark:border-slate-700 dark:bg-slate-800 px-4 py-1.5 focus:outline-none focus:border-[#FB2E86] w-64 text-sm dark:text-white"
              placeholder="Search..."
            />
            <button onClick={() => handleSearch()} className="bg-[#FB2E86] p-2.5 text-white hover:bg-pink-600 transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }} className="p-2 text-[#151875] dark:text-white">
              <Search size={22} />
            </button>
            <Link href="/wishlist" className="p-2 text-[#151875] dark:text-white"><Heart size={22} /></Link>
            <Link href="/cart" className="p-2 text-[#151875] dark:text-white relative">
              <ShoppingCart size={22} />
              <span className="absolute top-1 right-1 bg-[#FB2E86] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">0</span>
            </Link>
            <button onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); }} className="p-2 text-[#151875] dark:text-white">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE DRAWER --- */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-6 space-y-8 absolute w-full left-0 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-300 z-[65]">
            <div className="flex flex-col gap-6 text-[#151875] dark:text-white text-xl font-bold font-josefin">
              {navLinks.map((link: any) => (
                <Link key={link.id} href={link.url} onClick={() => setIsMenuOpen(false)} className="hover:text-[#FB2E86]">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-6 border-t dark:border-slate-800">
              <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Appearance</p>
              <div className="flex gap-4">
                <button onClick={() => setTheme("light")} className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg flex justify-center dark:text-white border dark:border-slate-700"><Sun size={20}/></button>
                <button onClick={() => setTheme("dark")} className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg flex justify-center dark:text-white border dark:border-slate-700"><Moon size={20}/></button>
                <button onClick={() => setTheme("os")} className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg flex justify-center dark:text-white border dark:border-slate-700"><Monitor size={20}/></button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[100] flex flex-col animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center p-4 border-b dark:border-slate-800">
            <button onClick={() => setIsSearchOpen(false)} className="pr-4 dark:text-white"><X size={24}/></button>
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-slate-800 rounded-full px-4 py-2">
              <Search size={18} className="text-gray-400 mr-2" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search products..."
                className="bg-transparent w-full focus:outline-none dark:text-white text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          
          <div className="p-6 space-y-8 overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-josefin">
                <TrendingUp size={14} /> Trending Now
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map(term => (
                  <button key={term} onClick={() => handleSearch(term)} className="px-4 py-2 bg-gray-50 dark:bg-slate-800 dark:text-slate-300 text-sm rounded-full hover:bg-pink-50 hover:text-[#FB2E86] font-josefin">
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 font-josefin">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map(cat => (
                  <Link key={cat.name} href={cat.url} onClick={() => setIsSearchOpen(false)} className="p-4 border dark:border-slate-800 rounded-xl flex justify-between items-center dark:text-white text-sm font-josefin">
                    {cat.name} <Search size={14} className="opacity-20" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}