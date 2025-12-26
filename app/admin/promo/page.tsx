import { prisma } from "@/lib/db";
import { createPromoBanner, togglePromoStatus } from "@/app/actions/promoActions";
import PromoBannerForm from "@/components/admin/PromoBannerForm"; // This is the client form from earlier

export default async function AdminPromoPage() {
  // Fetch products for the dropdown and all existing banners for the list
  const [products, banners] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, price: true } }),
    prisma.promoBanner.findMany({ orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <div className="w-screen min-h-screen p-8 space-y-12 bg-gray-100 dark:bg-slate-950">
      {/* 1. Add New Banner Form */}
      <section>
        <PromoBannerForm products={products} />
      </section>

      {/* 2. Manage Existing Banners */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border dark:border-slate-800">
        <h3 className="text-xl font-bold font-josefin text-[#151875] dark:text-white mb-6">Existing Banners</h3>
        <div className="grid gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
              <div className="flex flex-col">
                <span className="font-semibold text-[#151875] dark:text-white">{banner.title}</span>
                <span className="text-xs text-gray-500 italic">Created: {banner.createdAt.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {banner.isActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
                ) : (
                  <form action={togglePromoStatus.bind(null, banner.id)}>
                    <button className="px-4 py-1.5 bg-[#151875] text-white text-xs rounded hover:bg-opacity-90 transition-all font-josefin">
                      Set Active
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 text-center py-4">No banners created yet.</p>}
        </div>
      </section>
    </div>
  );
}