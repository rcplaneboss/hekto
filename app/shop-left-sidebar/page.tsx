// app/shop-left-sidebar/page.tsx
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ShopFilterBar from "@/components/ShopFilterBar";
import Pagination from "@/components/Pagination";
import SidebarFilters from "./_components/SidebarFilters";
import ProductCardList from "@/components/ProductCardList";

export default async function ShopLeftSidebarPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const query = params.query || "";
    const category = params.category || "";
    const brand = params.brand || ""; 
    const rating = params.rating ? parseInt(params.rating) : 0; 
    const priceRange = params.price || "";
    const discount = params.discount ? parseFloat(params.discount) : 0;
    
    const view = params.view || "list"; 
    const page = parseInt(params.page || "1");
    const limit = 6;
    const skip = (page - 1) * limit;

    let priceMin = 0;
    let priceMax = 999999;
    if (priceRange) {
        const parts = priceRange.split("-");
        priceMin = parseFloat(parts[0]);
        priceMax = parseFloat(parts[1]);
    }

    const whereCondition: any = {
        isActive: true,
        ...(query && { name: { contains: query, mode: "insensitive" } }),
        ...(category && { category: { slug: category } }),
        ...(brand && { tags: { has: brand } }),
        ...(discount > 0 && { discountPercentage: { gte: discount } }),
        ...(priceRange && { price: { gte: priceMin, lte: priceMax } }),
        ...(rating > 0 && {
            reviews: { some: { rating: { gte: rating } } }
        }),
    };

    // Pre-defined Tags for counting
    const TAGS_TO_COUNT = ["featured", "trending", "latest", "best-seller", "special-offer"];

    const [products, totalCount, allCategories, catCounts, tagCounts] = await Promise.all([
        prisma.product.findMany({
            where: whereCondition,
            include: { category: true, _count: { select: { reviews: true } } },
            take: limit, skip, orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where: whereCondition }),
        prisma.category.findMany({ select: { id: true, name: true, slug: true } }),
        // Group counts by category
        prisma.product.groupBy({
            by: ['categoryId'],
            _count: { categoryId: true },
            where: { isActive: true }
        }),
        // Individual tag counts
        Promise.all(TAGS_TO_COUNT.map(async (tag) => ({
            tag,
            count: await prisma.product.count({ where: { tags: { has: tag }, isActive: true } })
        })))
    ]);

    // Map counts back to category objects
    const categoriesWithCounts = allCategories.map(cat => ({
        ...cat,
        count: catCounts.find(c => c.categoryId === cat.id)?._count.categoryId || 0
    }));

    return (
        <main className="bg-white dark:bg-slate-950 transition-colors pb-20 ">
            <PageHeader title="Shop Left Sidebar" />
            <ShopFilterBar totalCount={totalCount} />

            <div className="container mx-auto py-12 px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="lg:col-span-1 order-2 lg:order-1">
                        <SidebarFilters 
                            categories={categoriesWithCounts} 
                            tagCounts={tagCounts} 
                        />
                    </aside>

                    <section className="lg:col-span-3 order-1 lg:order-2">
                        <div className={view === "grid" 
                            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" 
                            : "flex flex-col gap-8"
                        }>
                            {products.map((product) => (
                                <ProductCardList key={product.id} product={product}  />
                            ))}
                        </div>
                        
                        {totalCount > limit && (
                            <div className="mt-12 flex justify-center">
                                <Pagination totalCount={totalCount} pageSize={limit} currentPage={page} />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}