import { prisma } from "@/lib/db";
import { Box, Layers, Package, ShoppingBag, ArrowUpRight, Plus } from "lucide-react";
import ProductTableManager from "@/components/admin/ProductTableManager";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  const categories = await prisma.category.findMany();

  // Logic for the stats
  const stats = [
    { label: "Total Products", value: products.length, icon: ShoppingBag, color: "from-blue-600 to-indigo-600", shadow: "shadow-blue-500/20" },
    { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, icon: Box, color: "from-rose-500 to-red-600", shadow: "shadow-red-500/20" },
    { label: "Categories", value: categories.length, icon: Layers, color: "from-fuchsia-500 to-purple-600", shadow: "shadow-purple-500/20" },
    { label: "Active Items", value: products.filter(p => p.isActive).length, icon: Package, color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] dark:bg-slate-950">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-[#F6F7FB]/80 dark:bg-slate-950/80 backdrop-blur-md border-b dark:border-slate-800 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#151875] dark:text-white font-josefin tracking-tight">
              Product <span className="text-[#FB2E86]">Inventory</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
              Stock management & Catalog Control
            </p>
          </div>
          
          <Link 
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 bg-[#FB2E86] hover:bg-pink-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-pink-500/25 active:scale-95"
          >
            <Plus size={20} />
            <span>Create New Product</span>
          </Link>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border dark:border-slate-800 hover:border-[#FB2E86]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={26} strokeWidth={2.5} />
                </div>
                <ArrowUpRight className="text-slate-300 dark:text-slate-700 group-hover:text-[#FB2E86] transition-colors" size={20} />
              </div>
              
              <div className="mt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-[#151875] dark:text-white tracking-tighter">
                  {stat.value}
                </p>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-2 -right-2 text-slate-50 dark:text-slate-800/20 font-black text-6xl select-none group-hover:text-[#FB2E86]/5 transition-colors">
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="relative">
          <div className="absolute -top-6 left-10 px-4 py-1 bg-[#151875] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full z-10 shadow-lg">
            Live Catalog
          </div>
          <ProductTableManager initialProducts={products} categories={categories} />
        </div>

      </div>
    </div>
  );
}