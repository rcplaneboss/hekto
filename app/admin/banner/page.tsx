import { prisma } from '@/lib/db'
import Link from 'next/link'
import BannerUploadForm from '@/components/admin/BannerUploadForm'
import ConfirmActionButton from '@/components/admin/ConfirmActionButton'

export default async function BannerAdminPage(){
  const banners = await prisma.heroBanner.findMany({ orderBy: { order: 'asc' }})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-josefin dark:text-white">Hero Banners</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Manage homepage hero slides</p>
        </div>
        <Link href="/admin" className="text-sm text-slate-600 dark:text-slate-300">Back to dashboard</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {banners.map(b => (
            <div key={b.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex gap-4 items-center border dark:border-slate-800">
              <img src={b.imageUrl} className="w-44 h-28 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold font-josefin text-[#151875] dark:text-white">{b.mainTitle}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">{b.subTitle}</p>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-lato">Button: {b.buttonText} → {b.buttonLink}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-slate-400 dark:text-slate-500 text-sm">Order: {b.order}</div>
                <ConfirmActionButton
                  endpoint="/api/admin/banner/delete"
                  payload={{ id: b.id }}
                  label="Delete"
                  className="text-rose-600 text-xs px-3 py-1 rounded hover:bg-rose-50"
                  confirmMessage={`Delete banner "${b.mainTitle}"?`}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold font-josefin mb-4 dark:text-white">Create Hero Banner</h3>
            <BannerUploadForm />
          </div>
        </div>
      </div>
    </div>
  )
}
