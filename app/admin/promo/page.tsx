import { prisma } from '@/lib/db'
import PromoBannerForm from '@/components/admin/PromoBannerForm'
import ConfirmActionButton from '@/components/admin/ConfirmActionButton'
import Link from 'next/link'

export default async function AdminPromoPage() {
  const [products, banners] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, price: true, imageUrl: true } }),
    prisma.promoBanner.findMany({ orderBy: { createdAt: 'desc' }, include: { product: true } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-josefin dark:text-white">Promo Banners</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Manage homepage promo highlights</p>
        </div>
        <Link href="/admin" className="text-sm text-slate-600 dark:text-slate-300">Back to dashboard</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {banners.map(b => (
            <div key={b.id} className="p-4 bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg shadow-sm flex items-center gap-4">
              <img src={b.customImage || b.product?.imageUrl} alt="banner" className="w-28 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="font-bold font-josefin text-[#151875] dark:text-white">{b.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">{b.features?.slice(0,3).join(' • ')}</p>
              </div>
              <div className="flex items-center gap-3">
                {b.isActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
                ) : (
                  <div>
                    <ConfirmActionButton
                      endpoint="/api/admin/promo/set-active"
                      payload={{ id: b.id }}
                      label="Set Active"
                      className="px-4 py-1.5 bg-[#151875] text-white text-xs rounded hover:bg-opacity-90 transition-all font-josefin"
                      confirmMessage={`Set "${b.title}" as active banner?`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 dark:text-slate-400 text-center py-4">No banners created yet.</p>}
        </div>

        <div>
          <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold font-josefin mb-4 dark:text-white">Create New Promo Banner</h3>
            <PromoBannerForm products={products} />
          </div>
        </div>
      </div>
    </div>
  )
}