"use client";

import Image from "next/image";
import Link from "next/link";

export default function LatestBlog({ blogs }: { blogs: any[] }) {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <h2 className="text-[#151875] dark:text-white text-3xl md:text-4xl font-bold font-josefin text-center mb-16">
          Latest Blog
        </h2>

        {/* Reduced max-width from 6xl to 5xl to make cards narrower */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={blog.mainImage || '/images/blog-1.png'}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Reduced Padding from p-6 to p-5 */}
              <div className="p-5">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[#FB2E86] text-xs">✎</span>
                    <span className="text-[#151875] dark:text-slate-300 font-josefin text-xs md:text-sm">
                      {blog.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#FFA454] text-xs">📅</span>
                    <span className="text-[#151875] dark:text-slate-300 font-josefin text-xs md:text-sm">
                      {new Date(blog.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="text-[#151875] dark:text-white font-josefin text-base md:text-lg font-bold mb-3 group-hover:text-[#FB2E86] transition-colors line-clamp-1">
                  {blog.title}
                </h3>

                {/* Adjusted excerpt to show 2 lines instead of 3 for a cleaner look */}
                <p className="text-[#8A8FB9] dark:text-slate-400 font-lato text-sm leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                <Link 
                  href={`/blog/${blog.slug}`}
                  className="text-[#151875] dark:text-white font-lato text-sm font-semibold underline decoration-[#151875] hover:text-[#FB2E86] hover:decoration-[#FB2E86] transition-all"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}