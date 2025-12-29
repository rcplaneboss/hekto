"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, Mail, Phone, Menu, X, Sun, Moon, Monitor } from "lucide-react";

export default function HeaderClient({ settings, navLinks }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle for mobile search bar
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  const updateTheme = () => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    updateTheme();
  }, []);

  const setTheme = (mode: "light" | "dark" | "os") => {
    if (mode === "os") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = mode;
    }
    updateTheme();
  };

  return (
    <header className={`w-full sticky top-0 z-50 font-[Josefin_Sans] transition-all duration-300 ${
      isScrolled ? "shadow-md" : ""
    }`}>
      {/* --- TOP BAR --- */}
      <div className="bg-[#7E33E0] text-white py-2 hidden md:block">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex gap-8 items-center text-sm">
            <a href={`mailto:${settings?.topBarEmail}`} className="flex items-center gap-2 hover:text-pink-200">
              <Mail size={14} /> {settings?.topBarEmail || "loading..."}
            </a>
            <a href={`tel:${settings?.topBarPhone}`} className="flex items-center gap-2 hover:text-pink-200">
              <Phone size={14} /> {settings?.topBarPhone || "loading..."}
            </a>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <div className="relative group cursor-pointer flex items-center gap-1 py-1">
              Theme <Sun size={14} />
              <div className="absolute top-full right-0 bg-white dark:bg-slate-800 text-black dark:text-white shadow-2xl rounded-lg py-2 hidden group-hover:block z-[100] min-w-[130px] border border-gray-100 dark:border-slate-700">
                <button onClick={() => setTheme("light")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2 font-josefin">
                  <Sun size={14} /> Light
                </button>
                <button onClick={() => setTheme("dark")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2 font-josefin">
                  <Moon size={14} /> Dark
                </button>
                <button onClick={() => setTheme("os")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2 font-josefin">
                  <Monitor size={14} /> System
                </button>
              </div>
            </div>
            <Link href="/wishlist" className="flex items-center gap-1 hover:text-pink-200">
              Wishlist <Heart size={14} />
            </Link>
            <Link href="/cart" className="hover:text-pink-200">
              <ShoppingCart size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-[#151875] dark:text-white">
            {settings?.logoText || "Hekto"}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 text-[#151875] dark:text-slate-300 font-medium">
            {navLinks.map((link: any) => (
              <Link key={link.id} href={link.url} className="hover:text-[#FB2E86] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border-2 border-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-1.5 focus:outline-none focus:border-[#FB2E86] w-64 text-sm"
              placeholder="Search products..."
            />
            <button onClick={handleSearch} className="bg-[#FB2E86] p-2.5 text-white hover:bg-pink-600 transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMenuOpen(false);
              }}
              className="text-[#151875] dark:text-white"
            >
              {isSearchOpen ? <X size={24} /> : <Search size={24} />}
            </button>
            <button className="text-[#151875] dark:text-white" onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsSearchOpen(false);
              }}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* REFINED MOBILE SEARCH BAR (Slide Down) */}
        {isSearchOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center w-full shadow-sm">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 border-2 border-[#FB2E86] border-r-0 dark:bg-slate-800 dark:text-white px-4 py-2 focus:outline-none text-sm"
                placeholder="Search our catalog..."
              />
              <button onClick={handleSearch} className="bg-[#FB2E86] p-2.5 text-white">
                <Search size={20} />
              </button>
            </div>
          </div>
        )}

        {/* MOBILE DRAWER */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-6 space-y-6 absolute w-full left-0 shadow-xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col gap-4 text-[#151875] dark:text-white text-lg font-josefin">
              {navLinks.map((link: any) => (
                <Link key={link.id} href={link.url} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Quick Links for Mobile Drawer */}
            <div className="flex justify-around py-4 border-y dark:border-slate-800">
                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-1 text-[#151875] dark:text-white text-xs">
                    <Heart size={20} /> Wishlist
                </Link>
                <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-1 text-[#151875] dark:text-white text-xs">
                    <ShoppingCart size={20} /> Cart
                </Link>
            </div>

            <div className="pt-2 flex gap-4">
              <button onClick={() => setTheme("light")} className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg dark:text-white flex justify-center"><Sun size={20}/></button>
              <button onClick={() => setTheme("dark")} className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg dark:text-white flex justify-center"><Moon size={20}/></button>
              <button onClick={() => setTheme("os")} className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg dark:text-white flex justify-center"><Monitor size={20}/></button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}