"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, Mail, Phone, Menu, X, Sun, Moon, Monitor } from "lucide-react";

export default function HeaderClient({ settings, navLinks }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll for shadow

  // Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---  THEME LOGIC ---
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
    /* Added sticky top-0 and z-50 to keep it above all other elements */
    <header className={`w-full sticky top-0 z-50 font-[Josefin_Sans] transition-all duration-300 ${
      isScrolled ? "shadow-md" : ""
    }`}>
      {/* --- TOP BAR (Purple Bar) --- */}
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
                <button onClick={() => setTheme("light")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Sun size={14} /> Light
                </button>
                <button onClick={() => setTheme("dark")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Moon size={14} /> Dark
                </button>
                <button onClick={() => setTheme("os")} className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 flex items-center gap-2">
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

          <div className="hidden lg:flex items-center gap-8 text-[#151875] dark:text-slate-300 font-medium">
            {navLinks.map((link: any) => (
              <Link 
                key={link.id} 
                href={link.url} 
                className="hover:text-[#FB2E86] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <input
              type="text"
              className="border-2 border-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-1.5 focus:outline-none focus:border-[#FB2E86] w-64"
              placeholder="Search products..."
            />
            <button className="bg-[#FB2E86] p-2.5 text-white hover:bg-pink-600 transition-colors">
              <Search size={20} />
            </button>
          </div>

          <button className="lg:hidden text-[#151875] dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-6 space-y-6 absolute w-full left-0 shadow-xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col gap-4 text-[#151875] dark:text-white text-lg">
              {navLinks.map((link: any) => (
                <Link key={link.id} href={link.url} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t dark:border-slate-700 flex gap-4">
              <button onClick={() => setTheme("light")} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg dark:text-white"><Sun /></button>
              <button onClick={() => setTheme("dark")} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg dark:text-white"><Moon /></button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}