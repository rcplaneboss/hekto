import { prisma } from "@/lib/db";
import CategoryAdminForms from "@/components/admin/CategoryAdminForms";

export default async function AdminCategoryPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold font-josefin text-[#151875] dark:text-white">Category Discounts</h1>
          <p className="text-gray-500">Manage the tabbed "Discount Item" section of the homepage</p>
        </header>

        <CategoryAdminForms categories={categories} products={products} />
      </div>
    </div>
  );
}