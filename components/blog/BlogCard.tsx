import Image from "next/image";
import Link from "next/link";
import { Calendar, PenTool } from "lucide-react";

export default function BlogCard({ post }: { post: any }) {
  return (
    <article className="group cursor-pointer">
      {/* Image Container with UX Zoom */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-md mb-6">
        <Image 
          src={post.mainImage} 
          alt={post.title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <PenTool size={16} className="text-[#FB2E86]" />
          <span className="bg-[#FFE7F9] text-[#151875] px-6 py-1 rounded-sm text-sm font-josefin font-medium">
            {post.author}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#FFA454]" />
          <span className="bg-[#FFECE2] text-[#151875] px-6 py-1 rounded-sm text-sm font-josefin font-medium">
            {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Content */}
      <h2 className="text-2xl md:text-3xl font-bold font-josefin text-[#151875] dark:text-white mb-4 group-hover:text-[#FB2E86] transition-colors">
        {post.title}
      </h2>
      <p className="text-[#8A8FB9] dark:text-slate-400 font-lato leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>

      {/* Interactive Read More */}
      <Link href={`/blog/${post.slug}`} className="inline-block relative">
        <span className="text-lg font-bold font-josefin text-[#151875] dark:text-white group-hover:text-[#FB2E86] transition-colors">
          Read More
        </span>
        <div className="w-2 h-2 bg-[#FB2E86] rounded-full absolute -right-4 top-1/2 -translate-y-1/2 group-hover:translate-x-2 transition-transform" />
      </Link>
    </article>
  );
}