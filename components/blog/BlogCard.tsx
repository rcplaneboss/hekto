"use client"; // Add this to handle the dynamic date formatting on the client side

import Image from "next/image";
import Link from "next/link";
import { Calendar, PenTool } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlogCard({ post }: { post: any }) {
  const [mounted, setMounted] = useState(false);

  // This ensures the date is only rendered on the client to match the user's local time
  // preventing the "static" feel or hydration errors.
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="group cursor-pointer bg-transparent animate-in fade-in duration-500">
      {/* Image Container */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-md mb-6 shadow-sm bg-slate-100 dark:bg-slate-800">
        <Image
          src={post.mainImage}
          alt={post.title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4">
        {/* Author */}
        <div className="flex items-center gap-2">
          <PenTool size={16} className="text-[#FB2E86]" />
          <span className="bg-[#FFE7F9] dark:bg-pink-900/30 text-[#151875] dark:text-pink-200 px-4 md:px-6 py-1 rounded-sm text-sm font-josefin font-medium transition-colors">
            {post.author}
          </span>
        </div>

        {/* Dynamic Date Badge */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#FFA454]" />
          <span className="bg-[#FFECE2] dark:bg-orange-900/30 text-[#151875] dark:text-orange-200 px-4 md:px-6 py-1 rounded-sm text-sm font-josefin font-medium transition-colors">
            {/* If not mounted yet, show a placeholder or the raw string to avoid blank space */}
            {mounted ? formatDate(post.publishedAt) : "Loading date..."}
          </span>
        </div>
      </div>

      {/* Content */}
      <h2 className="text-2xl md:text-3xl font-bold font-josefin text-[#151875] dark:text-slate-100 mb-4 group-hover:text-[#FB2E86] transition-colors leading-tight">
        {post.title}
      </h2>
      
      <p className="text-[#8A8FB9] dark:text-slate-400 font-lato leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>

      {/* Interactive Read More */}
      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 group/link">
        <span className="text-lg font-bold font-josefin text-[#151875] dark:text-slate-200 group-hover/link:text-[#FB2E86] transition-colors">
          Read More
        </span>
        <div className="w-2 h-2 bg-[#FB2E86] rounded-full group-hover/link:translate-x-2 transition-transform" />
      </Link>
    </article>
  );
}