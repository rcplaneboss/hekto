"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <section className="w-full bg-[#F6F5FF] dark:bg-slate-900 py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Main Title: Navy in light mode, White in dark mode */}
        <h1 className="text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin mb-3">
          {title}
        </h1>
        
        {/* Breadcrumbs: Black in light mode, Slate-400 in dark mode */}
        <div className="flex items-center gap-1 text-sm font-lato font-semibold">
          <Link 
            href="/" 
            className="text-black dark:text-slate-300 hover:text-[#FB2E86] dark:hover:text-[#FB2E86] transition-colors"
          >
            Home
          </Link>
          <span className="text-black dark:text-slate-500 mx-1">.</span>
          <span className="text-black dark:text-slate-300">Pages</span>
          <span className="text-black dark:text-slate-500 mx-1">.</span>
          <span className="text-[#FB2E86] font-medium">{title}</span>
        </div>
      </div>
    </section>
  );
}