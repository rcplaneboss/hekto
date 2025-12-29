import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ShopFilterBar from "@/components/ShopFilterBar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Search } from "lucide-react";
import Fuse from "fuse.js"; 
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop Grid Default ",
    description: "Explore our diverse range of products in the Shop Grid Default layout at Hekto E-commerce. Find everything you need with ease and style.",
};

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const startTime = performance.now();
    const params = await searchParams;

    const query = params.query || "";
    const queryKeywords = query.split(" ").filter(Boolean);
    const category = params.category || "";
    const sort = params.sort || "newest";
    const view = params.view || "grid";

    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "6");
    const skip = (page - 1) * limit;

    const whereCondition: any = {
        isActive: true,
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

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low") orderBy = { price: "asc" };
    if (sort === "price-high") orderBy = { price: "desc" };

    const [products, totalCount, allCategories] = await Promise.all([
        prisma.product.findMany({
            where: whereCondition,
            include: { category: true },
            orderBy,
            take: limit,
            skip: skip,
        }),
        prisma.product.count({ where: whereCondition }),
        prisma.category.findMany({ select: { name: true, slug: true } }) // Get categories for fuzzy match
    ]);

    // --- FUZZY SEARCH LOGIC ---
    let suggestion: any = null;
    if (products.length === 0 && query) {
        const fuse = new Fuse(allCategories, {
            keys: ["name"],
            threshold: 0.4, // Lower is stricter, higher is looser (0.4 is sweet spot)
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
            <PageHeader title="Shop Grid Default" />
            <ShopFilterBar totalCount={totalCount} executionTime={executionTime} />

            <div className="container mx-auto px-6 max-w-6xl pb-12">
                {products.length > 0 ? (
                    <>
                        <div className={view === "grid" 
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
                            : "flex flex-col gap-6"
                        }>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} view={view} />
                            ))}
                        </div>
                        <div className="mt-20 flex justify-center">
                            <Pagination totalCount={totalCount} pageSize={limit} currentPage={page} />
                        </div>
                    </>
                ) : (
                    /* --- MEANINGFUL EMPTY STATE --- */
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
                                        href={`/shop?category=${suggestion.slug}`}
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
                                Back to Shop
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}