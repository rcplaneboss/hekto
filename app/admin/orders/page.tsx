import { prisma } from '@/lib/db'
import Link from 'next/link'
import ConfirmActionButton from '@/components/admin/ConfirmActionButton'

export default async function OrdersAdminPage(){
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, items: { include: { product: true } } }})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-josefin dark:text-white">Orders</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Recent orders and statuses</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/orders/new" 
            className="bg-[#FB2E86] text-white px-4 py-2 rounded-lg font-josefin hover:bg-pink-600 transition"
          >
            New Order
          </Link>
          <Link href="/admin" className="text-sm text-slate-600">Back to dashboard</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-6 py-4 text-xs text-slate-400 uppercase">Order</th>
                <th className="px-6 py-4 text-xs text-slate-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs text-slate-400 uppercase">Items</th>
                <th className="px-6 py-4 text-xs text-slate-400 uppercase">Total</th>
                <th className="px-6 py-4 text-xs text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(o => (
                <tr key={o.id} className="group hover:bg-[#F6F7FB] dark:hover:bg-slate-800 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold font-josefin dark:text-white">#{o.orderNumber}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-400 font-lato">{new Date(o.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold font-josefin dark:text-white">{o.firstName} {o.lastName}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-400 font-lato">{o.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">{o.items.length}</td>
                  <td className="px-6 py-4 font-black text-lg text-[#151875] dark:text-white">₦{o.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {o.status}
                      </span>
                      {o.status !== 'DELIVERED' && (
                        <ConfirmActionButton
                          endpoint="/api/admin/orders/update-status"
                          payload={{ id: o.id, status: 'DELIVERED' }}
                          label="Mark Delivered"
                          className="text-sm text-slate-600 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100"
                          confirmMessage={`Mark order #${o.orderNumber} as delivered?`}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-[#FB2E86] hover:text-pink-600 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
