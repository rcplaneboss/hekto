import { prisma } from '@/lib/db'
import Link from 'next/link'
import ConfirmActionButton from '@/components/admin/ConfirmActionButton'

export default async function UsersAdminPage(){
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, include: { orders: true }})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-josefin dark:text-white">Customers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Registered users and activity</p>
        </div>
        <Link href="/admin" className="text-sm text-slate-600 dark:text-slate-300">Back to dashboard</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => (
          <div key={u.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">{(u.name || 'U').charAt(0).toUpperCase()}</div>
              <div className="flex-1">
                <div className="font-bold font-josefin text-[#151875] dark:text-white">{u.name || '—'}</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 font-lato">{u.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-500 dark:text-slate-400 font-lato">Orders: {u.orders?.length || 0}</div>
                <ConfirmActionButton
                  endpoint="/api/admin/users/delete"
                  payload={{ id: u.id }}
                  label="Delete"
                  className="text-rose-600 text-xs px-3 py-1 rounded hover:bg-rose-50"
                  confirmMessage={`Delete user ${u.email}?`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
