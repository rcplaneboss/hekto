"use client";

import { useState, useRef } from "react";
import { createCategory, upsertDiscountItem } from "@/app/actions/categoryActions";
import Image from "next/image";
import { Plus, Sparkles, Tag, Layout, CheckCircle2, Image as ImageIcon, Rocket, ListChecks } from "lucide-react";

export default function CategoryAdminForms({ categories, products }: { categories: any[], products: any[] }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showOnTop, setShowOnTop] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const inputClass = "w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none text-[#151875] dark:text-white transition-all font-medium text-sm placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1 block";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* --- SECTION 1: CREATE CATEGORY --- */}
      <section className="relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#151875] text-white rounded-xl shadow-lg shadow-indigo-500/20">
            <Layout size={20} />
          </div>
          <h3 className="text-2xl font-black text-[#151875] dark:text-white tracking-tight">
            Category <span className="text-[#FB2E86]">Architect</span>
          </h3>
        </div>

        <form 
          ref={formRef}
          action={async (formData) => { 
            setLoading(true);
            try {
              formData.set("showOnTop", String(showOnTop));
              await createCategory(formData); 
              setPreview(null);
              setShowOnTop(false);
              formRef.current?.reset();
              alert("Category created successfully!");
            } catch (err) {
              alert("Error creating category");
            } finally {
              setLoading(false);
            }
          }} 
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Image Upload Area */}
            <div className="lg:col-span-3">
              <label className={labelClass}>Visual Identity</label>
              <div className="relative aspect-square rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden hover:border-[#FB2E86]/50 transition-all group/img">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover p-2 rounded-[2rem]" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Upload Circle Icon</p>
                  </div>
                )}
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-9 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Naming</label>
                  <input name="name" placeholder="e.g. Modern Collection" className={inputClass} required />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Visibility Settings</label>
                  <button
                    type="button"
                    onClick={() => setShowOnTop(!showOnTop)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                      showOnTop 
                      ? "bg-emerald-50 border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/5" 
                      : "bg-slate-50 border-transparent text-slate-400 dark:bg-slate-800"
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-tight">Prioritize on Homepage</span>
                    {showOnTop ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full lg:w-fit px-12 py-4 bg-[#151875] hover:bg-[#FB2E86] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? "Processing..." : <><Plus size={18} /> Deploy Category</>}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* --- SECTION 2: CONFIGURE DISCOUNT HIGHLIGHT --- */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#FB2E86] text-white rounded-xl shadow-lg shadow-pink-500/20">
            <Sparkles size={20} />
          </div>
          <h3 className="text-2xl font-black text-[#151875] dark:text-white tracking-tight">
            Marketing <span className="text-[#FB2E86]">Hero</span>
          </h3>
        </div>
        
        <form action={async (fd) => {
          setLoading(true);
          await upsertDiscountItem(fd);
          setLoading(false);
          alert("Discount item saved!");
        }} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Selection Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass}>Target Category</label>
                <div className="relative">
                  <select name="categoryId" className={`${inputClass} appearance-none cursor-pointer`} required>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={labelClass}>Featured Showcase Product</label>
                <div className="relative">
                  <select name="productId" className={`${inputClass} appearance-none cursor-pointer`} required>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass}>Promo Headline</label>
                <input name="title" placeholder="20% Discount Of All Products" className={inputClass} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Subtitle / Product Highlight</label>
                <input name="subtitle" placeholder="Eams Sofa Compact" className={inputClass} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-2">
              <label className={labelClass}>Compelling Description</label>
              <textarea name="description" rows={4} className={`${inputClass} resize-none`} placeholder="Write a description that sells the lifestyle..." required />
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label className={labelClass}>Bullet Features (New Line)</label>
              <div className="relative">
                <ListChecks className="absolute right-5 top-5 text-slate-300" size={20} />
                <textarea 
                  name="features" 
                  rows={4} 
                  className={`${inputClass} resize-none font-mono text-xs`} 
                  placeholder="Premium Metal Base&#10;Hand-stitched Leather" 
                  required 
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading || categories.length === 0}
            className="group relative w-full bg-[#151875] hover:bg-[#FB2E86] text-white font-black py-5 rounded-[2rem] transition-all shadow-xl shadow-indigo-500/10 active:scale-[0.99] flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs"
          >
            {loading ? "Synchronizing..." : (
              <>
                <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Launch Configuration
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

// Minimal Helper icon
function ChevronDown(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );
}