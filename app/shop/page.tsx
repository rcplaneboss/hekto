import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ShopFilterBar from "@/components/ShopFilterBar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination"; // We will create this below

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const startTime = performance.now(); // Start timer
    const params = await searchParams;

    const query = params.query || "";
    const queryKeywords = query.split(" ").filter(Boolean);
    const category = params.category || "";
    const sort = params.sort || "newest";
    const view = params.view || "grid";

    // Pagination logic: 6 products per page
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

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where: whereCondition,
            include: { category: true },
            orderBy,
            take: limit,
            skip: skip, // Skip products for previous pages
        }),
        prisma.product.count({ where: whereCondition }),
    ]);

    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(3); // Time in seconds

    return (
        <main className="bg-white dark:bg-slate-950 min-h-screen transition-colors">
            <PageHeader title="Shop Grid Default" />

            {/* Pass totalCount and executionTime to the bar */}
            <ShopFilterBar totalCount={totalCount} executionTime={executionTime} />

            <div className="container mx-auto px-6 max-w-6xl pb-12">
                {products.length > 0 ? (
                    <>
                        <div className={
                            view === "grid"
                                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                                : "flex flex-col gap-6"
                        }>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} view={view} />
                            ))}
                        </div>

                        {/* Pagination Component */}
                        <div className="mt-20 flex justify-center">
                            <Pagination
                                totalCount={totalCount}
                                pageSize={limit}
                                currentPage={page}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <p className="text-[#151875] dark:text-slate-400 font-josefin text-lg">
                            No products found matching &quot;{query || category || "your criteria"}&quot;
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}