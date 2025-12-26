"use client";

import { useState } from "react";
import { createCategory, upsertDiscountItem } from "@/app/actions/categoryActions";

export default function CategoryAdminForms({ categories, products }: { categories: any[], products: any[] }) {
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#FB2E86] outline-none text-[#151875] dark:text-white transition-all";
  const labelClass = "text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1 block";

  return (
    <div className="space-y-12">
     {/* SECTION 1: CREATE CATEGORY */}
<section className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border dark:border-slate-800">
  <h3 className="text-xl font-bold font-josefin text-[#151875] dark:text-white mb-4">
    1. Create New Category
  </h3>
  <form 
    action={async (formData) => { 
      await createCategory(formData); 
      // Optional: you can add an alert or reset here
    }} 
    className="flex gap-4"
  >
    <input name="name" placeholder="e.g. Wood Chair" className={inputClass} required />
    <button className="bg-[#151875] dark:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all">
      Add
    </button>
  </form>
</section>

      {/* SECTION 2: CONFIGURE DISCOUNT HIGHLIGHT */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold font-josefin text-[#151875] dark:text-white mb-6">2. Configure Category Discount Item</h3>
        
        <form action={async (fd) => {
          setLoading(true);
          await upsertDiscountItem(fd);
          setLoading(false);
          alert("Discount item saved!");
        }} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Select Category</label>
              <select name="categoryId" className={inputClass} required>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Hero Product (Image & Link)</label>
              <select name="productId" className={inputClass} required>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Promo Title</label>
              <input name="title" placeholder="20% Discount Of All Products" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Subtitle/Product Name</label>
              <input name="subtitle" placeholder="Eams Sofa Compact" className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" rows={3} className={inputClass} placeholder="Describe the offer..." required />
          </div>

          <div>
            <label className={labelClass}>Features (One per line)</label>
            <textarea 
              name="features" 
              rows={4} 
              className={inputClass} 
              placeholder="Material expose like metals&#10;Simple neutral colours&#10;Clear lines and geometric figures" 
              required 
            />
          </div>

          <button 
            disabled={loading || categories.length === 0}
            className="w-full bg-[#FB2E86] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/20 transition-all disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Discount Configuration"}
          </button>
        </form>
      </section>
    </div>
  );
}