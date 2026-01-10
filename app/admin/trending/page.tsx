import { prisma } from '@/lib/db'
import TrendingPromoForm from '@/components/admin/TrendingPromoForm'
import { Trash2 } from 'lucide-react'
import ConfirmActionButton from '@/components/admin/ConfirmActionButton'
import Link from 'next/link'

export default async function AdminTrendingPage() {
  const promos = await prisma.trendingPromo.findMany()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-josefin dark:text-white">Trending Promos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Small promotional tiles used across the site</p>
        </div>
        <Link href="/admin" className="text-sm text-slate-600 dark:text-slate-300">Back to dashboard</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {promos.map(promo => (
            <div key={promo.id} className="p-4 rounded-2xl flex items-center justify-between border dark:border-slate-800" style={{ backgroundColor: promo.bgColor }}>
              <div>
                <p className="font-bold font-josefin text-[#151875] dark:text-white">{promo.title}</p>
                <p className="text-xs opacity-80 dark:text-slate-300 font-lato">{promo.linkUrl}</p>
              </div>
              <ConfirmActionButton
                endpoint="/api/admin/trending/delete"
                payload={{ id: promo.id }}
                label={"Delete"}
                className="text-red-500 hover:bg-white/50 p-2 rounded"
                confirmMessage={`Delete "${promo.title}"?`}
              />
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold font-josefin mb-4 dark:text-white">Create Trending Promo</h3>
            <TrendingPromoForm />
          </div>
        </div>
      </div>
    </div>
  )
}