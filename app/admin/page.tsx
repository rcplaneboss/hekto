import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Box,
  ShoppingBag,
  Users,
  Layers,
  TrendingUp,
} from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";

export const metadata: Metadata = {
  title: "Admin — Dashboard",
};

export default async function AdminPage() {
  const [productCount, orderCount, userCount, categoryCount, revenueAgg, recentOrders, lowStock, latestUsers, revenueOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: true, items: { include: { product: true } } } }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: 'asc' }, take: 6 }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
  ]);

  const totalRevenue = revenueAgg._sum.totalAmount ?? 0;

  // Build revenue data (group by date) for chart
  const revMap = new Map<string, number>()
  for (const o of revenueOrders) {
    const d = new Date(o.createdAt).toISOString().slice(0,10)
    revMap.set(d, (revMap.get(d) ?? 0) + Number(o.totalAmount ?? 0))
  }
  const revenueData = Array.from(revMap.entries()).map(([date, amount]) => ({ date, amount }))
  revenueData.sort((a,b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-josefin dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Overview of store metrics and quick actions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products" className="px-4 py-2 bg-[#FB2E86] text-white rounded-lg">Manage Products</Link>
          <Link href="/admin/orders" className="px-4 py-2 bg-slate-100 rounded-lg">View Orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={productCount} href="/admin/products" Icon={ShoppingBag} color="bg-indigo-50 text-indigo-700" />
        <StatCard label="Orders" value={orderCount} href="/admin/orders" Icon={Box} color="bg-amber-50 text-amber-700" />
        <StatCard label="Customers" value={userCount} href="/admin/users" Icon={Users} color="bg-emerald-50 text-emerald-700" />
        <StatCard label="Categories" value={categoryCount} href="/admin/categories" Icon={Layers} color="bg-sky-50 text-sky-700" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold font-josefin">Revenue</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-lato">Total revenue from orders</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-josefin text-[#151875] dark:text-white">₦{Number(totalRevenue).toLocaleString()}</p>
              <p className="text-xs text-slate-400 dark:text-slate-300 font-lato">Updated just now</p>
            </div>
          </div>

          <div className="mt-6">
            <RevenueChart data={revenueData} />
            <p className="text-xs text-slate-400 dark:text-slate-300 mt-2 font-lato">Revenue trend (last 30 orders)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-josefin">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100">
              <ShoppingBag className="text-slate-700" />
              <span className="font-lato text-sm">Products</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100">
              <Layers className="text-slate-700" />
              <span className="font-lato text-sm">Categories</span>
            </Link>
            <Link href="/admin/promo" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100">
              <TrendingUp className="text-slate-700" />
              <span className="font-lato text-sm">Promos</span>
            </Link>
            <Link href="/admin/banner" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100">
              <Box className="text-slate-700" />
              <span className="font-lato text-sm">Banners</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-josefin">Recent Orders</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase">
                  <th className="py-2">Order</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Items</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y mt-2">
                {recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    <td className="py-3 text-slate-700 dark:text-slate-200">#{o.orderNumber}
                      <div className="text-xs text-slate-400 dark:text-slate-300 font-lato">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-200">{o.user?.name || o.customerEmail}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-200">{o.items.length}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">₦{Number(o.totalAmount).toLocaleString()}</td>
                    <td className="py-3"><span className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold font-josefin">Low Stock</h3>
          <div className="mt-4 space-y-3">
                {lowStock.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-300 font-lato">No low stock products.</p>}
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.imageUrl} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-josefin font-semibold text-sm text-[#151875] dark:text-white">{p.name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-300 font-lato">Stock: {p.stock}</div>
                </div>
                <Link href={`/admin/products`} className="text-sm text-slate-600 dark:text-slate-300">Manage</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold font-josefin">Latest Customers</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {latestUsers.map(u => (
            <div key={u.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="font-josefin font-semibold text-sm text-slate-800 dark:text-white">{u.name || '—'}</div>
              <div className="text-xs text-slate-400 dark:text-slate-300 font-lato">{u.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, href, Icon, color }: { label: string; value: number; href: string; Icon: any; color?: string }) {
  return (
    <Link href={href} className="block p-4 bg-white dark:bg-slate-900 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${color || 'bg-slate-100'}`}>
            <Icon />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-lato">{label}</p>
            <p className="text-2xl font-bold mt-1 dark:text-white">{value}</p>
          </div>
        </div>
        <div className="text-slate-400 text-xs font-lato">View</div>
      </div>
    </Link>
  );
}
