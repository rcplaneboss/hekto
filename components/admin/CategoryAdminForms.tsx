"use client";

import { useState, useRef } from "react";
import { createCategory, upsertDiscountItem } from "@/app/actions/categoryActions";
import Image from "next/image";

export default function CategoryAdminForms({ categories, products }: { categories: any[], products: any[] }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const inputClass = "w-full p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#FB2E86] outline-none text-[#151875] dark:text-white transition-all";
  const labelClass = "text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1 block";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: CREATE CATEGORY */}
      <section className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border dark:border-slate-800">
        <h3 className="text-xl font-bold font-josefin text-[#151875] dark:text-white mb-4">
          1. Create New Category
        </h3>
        <form 
          ref={formRef}
          action={async (formData) => { 
            setLoading(true);
            try {
              await createCategory(formData); 
              setPreview(null);
              formRef.current?.reset();
              alert("Category created successfully!");
            } catch (err) {
              alert("Error creating category");
            } finally {
              setLoading(false);
            }
          }} 
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className={labelClass}>Category Name</label>
              <input name="name" placeholder="e.g. Wood Chair" className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Category Image (Circle)</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleImageChange}
                className={`${inputClass} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100`}
                required
              />
            </div>

            <div className="flex items-center gap-2 h-[50px] px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg">
                <input type="checkbox" name="showOnTop" value="true" id="showOnTop" className="accent-[#FB2E86]" />
                <label htmlFor="showOnTop" className="text-sm text-gray-500">Show on Top</label>
            </div>

            <button 
              disabled={loading}
              className="bg-[#151875] dark:bg-slate-700 text-white px-10 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Category"}
            </button>
          </div>

          {preview && (
            <div className="mt-4">
              <p className={labelClass}>Image Preview:</p>
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#FB2E86]">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            </div>
          )}
        </form>
      </section>

      {/* SECTION 2: CONFIGURE DISCOUNT HIGHLIGHT */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold font-josefin text-[#151875] dark:text-white mb-6">
          2. Configure Category Discount Item
        </h3>
        
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
              placeholder="Material expose like metals&#10;Simple neutral colours" 
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