"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function FooterClient({ settings, footerGroups }: any) {
  return (
    <footer className="bg-[#EEEFFB] dark:bg-slate-950 pt-16 font-josefin transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="space-y-6">
            <Link href="/" className="text-4xl font-bold text-black dark:text-white">
              {settings?.logoText || "Hekto"}
            </Link>
            
            <div className="relative flex max-w-[300px]">
              <input
                type="email"
                placeholder="Enter Email Address"
                className=" px-4 py-2 w-4/5 bg-white dark:bg-slate-800 dark:text-white border-none focus:outline-none rounded-l-sm"
              />
              <button className="bg-h-pink w-2/5 text-white px-1 py-2  rounded-r-sm hover:bg-pink-600 transition-colors text-sm">
                Sign Up
              </button>
            </div>

            <div className="text-[#8A8FB9] dark:text-slate-400 space-y-2 text-sm leading-relaxed">
              <p>Contact Info</p>
              <p>{settings?.footerAddress || "Loading address..."}</p>
            </div>
          </div>

          {/* DYNAMIC COLUMNS (Categories, Customer Care, Pages) */}
          {footerGroups.map((group: any) => (
            <div key={group.id} className="space-y-6">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {group.title}
              </h3>
              <ul className="space-y-4">
                {group.links.map((link: any) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-[#8A8FB9] dark:text-slate-400 hover:text-[#FB2E86] dark:hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="mt-16 bg-[#E7E4F8] dark:bg-slate-900 py-4 transition-colors">
        <div className="container mx-auto px-24 max-md:px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#9DA0AE] text-sm font-semibold">
            {settings?.copyright || "©Waterms - All Rights Reserved"}
          </p>
          
          <div className="flex gap-4">
            <Link href={settings?.facebookUrl || "#"} className="bg-[#151875] text-white p-2 rounded-full hover:bg-[#FB2E86] transition-all">
              <Facebook size={16} />
            </Link>
            <Link href={settings?.instagramUrl || "#"} className="bg-[#151875] text-white p-2 rounded-full hover:bg-[#FB2E86] transition-all">
              <Instagram size={16} />
            </Link>
            <Link href={settings?.twitterUrl || "#"} className="bg-[#151875] text-white p-2 rounded-full hover:bg-[#FB2E86] transition-all">
              <Twitter size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}