import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ShopFilterBar from "@/components/ShopFilterBar";
import ProductCardList from "@/components/ProductCardList";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Search } from "lucide-react";
import Fuse from "fuse.js"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop List View",
  description: "Browse our detailed product catalog in a list view format. Read descriptions, check ratings, and find the perfect item.",
};

export default async function ShopListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const startTime = performance.now();
  const params = await searchParams;

  // --- PARAMS & DEFAULTS ---
  const query = params.query || "";
  const queryKeywords = query.split(" ").filter(Boolean);
  const category = params.category || "";
  const sort = params.sort || "newest";
  
  // Force "list" view for this page, but allow override if needed
  const view = "grid"; 

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "6"); 
    const skip = (page - 1) * limit;

  // --- FILTERING LOGIC ---
  const whereCondition: any = {
    isActive: true, // Only show active products
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: queryKeywords } }
      ],
    }),
    ...(category && {
      category: { slug: category }
    }),
  };

  // --- SORTING LOGIC ---
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { reviews: { _count: "desc" } }; // Basic sort by popularity

  // --- DATA FETCHING ---
  const [products, totalCount, allCategories] = await Promise.all([
    prisma.product.findMany({
      where: whereCondition,
      // We include 'reviews' here because the List View design specifically shows Star Ratings
      include: { 
        category: true,
        reviews: true 
      },
      orderBy,
      take: limit,
      skip: skip,
    }),
    prisma.product.count({ where: whereCondition }),
    prisma.category.findMany({ select: { name: true, slug: true } }) 
  ]);

  // --- FUZZY SEARCH LOGIC ---
  let suggestion: any = null;
  if (products.length === 0 && query) {
    const fuse = new Fuse(allCategories, {
      keys: ["name"],
      threshold: 0.4, 
    });
    const fuzzyResults = fuse.search(query);
    if (fuzzyResults.length > 0) {
      suggestion = fuzzyResults[0].item;
    }
  }

  const endTime = performance.now();
  const executionTime = ((endTime - startTime) / 1000).toFixed(3);

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen transition-colors">
      <PageHeader title="Shop List" />
      
      {/* Reusing your FilterBar logic */}
      <ShopFilterBar totalCount={totalCount} executionTime={executionTime} currentView="list" />

      <div className="container mx-auto px-6 max-w-6xl pb-24">
        {products.length > 0 ? (
          <>
            {/* FORCE LIST LAYOUT: Flex Column instead of Grid */}
            <div className="flex flex-col gap-8">
              {products.map((product) => (
                <ProductCardList
                  key={product.id} 
                  product={product} 
                  view="list" 
                />
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <Pagination totalCount={totalCount} pageSize={limit} currentPage={page} />
            </div>

            {/* Brands Logo Strip (From Screenshot) */}
            <div className="mt-24 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
               {/* Replace with your actual brands image component */}
               <img src="/images/brands-logos.png" alt="Partner Brands" className="w-full max-w-4xl object-contain grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          </>
        ) : (
          /* --- EMPTY STATE (Reused from Grid) --- */
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-6 text-[#FB2E86]">
              <Search size={32} />
            </div>
            <h2 className="text-[#151875] dark:text-white font-josefin text-2xl mb-2 font-bold">
              No results for &quot;{query}&quot;
            </h2>
            
            {suggestion ? (
              <div className="mt-4 p-4 bg-white dark:bg-slate-800 inline-block rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-3">
                <p className="text-gray-500 dark:text-slate-400">
                  Did you mean: 
                  <Link 
                    href={`/shop-list?category=${suggestion.slug}`}
                    className="ml-2 text-[#FB2E86] font-bold hover:underline decoration-2 underline-offset-4"
                  >
                    {suggestion.name}?
                  </Link>
                </p>
              </div>
            ) : (
              <p className="text-gray-400 max-w-xs mx-auto">
                We couldn't find any matches. Try using different keywords or check your spelling.
              </p>
            )}

            <div className="mt-10">
              <Link href="/shop" className="inline-block bg-[#151875] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all font-josefin">
                Back to Shop Grid
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}