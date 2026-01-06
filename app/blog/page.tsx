import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { prisma } from "@/lib/db"; 
import { Suspense } from "react";

interface BlogPageProps {
  searchParams: Promise<{ 
    category?: string; 
    tag?: string; 
    query?: string; 
    page?: string; 
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag, query, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 3;

  const [posts, categoryData, recentPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        AND: [
          category ? { category: category } : {},
          tag ? { tags: { has: tag } } : {},
          query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
            ]
          } : {},
        ]
      },
      orderBy: { publishedAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.groupBy({
      by: ['category'],
      _count: { category: true },
    }),
    prisma.blogPost.findMany({
      take: 4,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, mainImage: true, publishedAt: true, slug: true }
    })
  ]);

  return (
    // FIX: Force background and text colors for the whole page
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <PageHeader title="Blog Page" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* FIX: justify-center + gap ensures the 75/25 split feels balanced */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 justify-center items-start">
          
          {/* LEFT: Blog Feed */}
          <section className="w-full lg:w-[65%] space-y-16">
            {posts.length > 0 ? (
              posts.map((post) => <BlogCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <h3 className="text-2xl font-josefin text-[#151875] dark:text-pink-500">No posts found.</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Try a different search or category.</p>
              </div>
            )}

            {/* Pagination */}
            <nav className="flex justify-center gap-3 pt-10">
              {[1, 2, 3, 4].map((num) => (
                <button 
                  key={num} 
                  className={`w-10 h-10 rounded-lg font-josefin flex items-center justify-center transition-all shadow-sm border ${
                    num === currentPage 
                    ? "bg-[#FB2E86] border-[#FB2E86] text-white" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#FB2E86] hover:text-[#FB2E86]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </nav>
          </section>

          {/* RIGHT: Sidebar */}
          <aside className="w-full lg:w-[30%] xl:w-[28%] sticky top-28">
            <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />}>
              <BlogSidebar 
                categories={categoryData.map(c => ({ name: c.category, count: c._count.category }))} 
                recentPosts={recentPosts}
              />
            </Suspense>
          </aside>

        </div>
      </main>
    </div>
  );
}