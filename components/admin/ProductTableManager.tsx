"use client";

import { useState, useMemo } from "react";
import { Edit, Trash2, Box, Search, Filter, Plus, SlidersHorizontal, MoreVertical, ExternalLink } from "lucide-react";
import { deleteProduct } from "@/app/actions/product";
import EditProductModal from "./EditProductModal";
import Link from "next/link";

export default function ProductTableManager({ initialProducts, categories }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter, initialProducts]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- ICONIC ACTION BAR --- */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
        <div className="relative w-full xl:w-2/5 group">
          <div className="absolute inset-0 bg-[#FB2E86]/5 blur-xl group-focus-within:bg-[#FB2E86]/10 transition-all rounded-full" />
          <div className="relative flex items-center bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#FB2E86]/20 transition-all">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, SKU, or code..."
              className="w-full pl-3 pr-4 py-4 bg-transparent border-none outline-none dark:text-white text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-64">
            <select 
              className="w-full pl-4 pr-10 py-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-[#FB2E86]/20 dark:text-white appearance-none cursor-pointer text-sm font-semibold shadow-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <Link 
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#151875] hover:bg-[#FB2E86] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/10 hover:shadow-[#FB2E86]/20 text-sm active:scale-95"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <th className="px-8 py-6 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">Product Detail</th>
                <th className="px-6 py-6 hidden lg:table-cell text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">Category</th>
                <th className="px-6 py-6 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">Financials</th>
                <th className="px-6 py-6 hidden sm:table-cell text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">Inventory</th>
                <th className="px-8 py-6 text-right text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800/50">
              {filteredProducts.map((product: any) => (
                <tr key={product.id} className="group hover:bg-[#F6F7FB] dark:hover:bg-slate-800/40 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className="relative group/img">
                        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-500">
                          <img 
                            src={product.imageUrl} 
                            className="h-full w-full object-contain transform group-hover/img:scale-110 transition-transform duration-500" 
                            alt="" 
                          />
                        </div>
                        {!product.isActive && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white dark:border-slate-900"></span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[#151875] dark:text-slate-100 text-[15px] tracking-tight group-hover:text-[#FB2E86] transition-colors leading-tight">
                          {product.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                          {product.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 hidden md:table-cell">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-tighter">
                      <Box size={12} className="opacity-50" />
                      {product.category?.name || "Unassigned"}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-[#151875] dark:text-white text-lg tracking-tighter">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded w-fit mt-1">
                          SAVE {product.discountPercentage}%
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 hidden sm:table-cell">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold dark:text-slate-200">{product.stock}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">In Stock</span>
                      </div>
                      <div className="w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            product.stock > 10 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                            product.stock > 0 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'
                          }`}
                          style={{ width: `${Math.min(product.stock * 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedProduct(product)} 
                        className="p-3 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all active:scale-90"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={async () => { if(confirm("Delete item permanently?")) await deleteProduct(product.id)}} 
                        className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-300">
                <Search size={48} strokeWidth={1} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#151875] dark:text-white">No results found</h3>
                <p className="text-sm text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
              <button 
                onClick={() => {setSearchQuery(""); setCategoryFilter("all")}}
                className="text-[#FB2E86] text-xs font-black uppercase tracking-widest hover:tracking-[0.2em] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <EditProductModal 
          product={selectedProduct} 
          categories={categories}
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}

// Helper icons missing from original imports
function ChevronDown(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );
}