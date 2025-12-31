"use client";

import { useState, useRef, useEffect } from "react";
import { createProduct } from "@/app/actions/product";
import { 
  ChevronDown, X, Plus, Image as ImageIcon, Sparkles, 
  Tag, Palette, ListChecks, LayoutGrid 
} from "lucide-react";

const AVAILABLE_TAGS = ["featured", "latest", "bestseller", "special", "new arrival", "trending", "mini-list"];

interface Category {
  id: string;
  name: string;
}

export default function AddProductForm({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState("#FB2E86");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const addColor = () => {
    if (!selectedColors.includes(currentColor)) setSelectedColors([...selectedColors, currentColor]);
  };

  async function clientAction(formData: FormData) {
    setLoading(true);
    formData.set("tags", selectedTags.join(","));
    formData.set("colors", selectedColors.join(","));
    formData.set("specs", JSON.stringify(specs));

    try {
      await createProduct(formData);
      alert("Product created successfully!");
      setSelectedTags([]);
      setSelectedColors([]);
      setImagePreviews([]);
      setSpecs([]);
      (document.getElementById("product-form") as HTMLFormElement).reset();
    } catch (err) {
      alert("Error creating product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 transition-all animate-in fade-in duration-500">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-[#151875] dark:text-white font-josefin tracking-tight">
          Create New <span className="text-[#FB2E86]">Product</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add a new masterpiece to your curated collection.</p>
      </div>

      <form id="product-form" action={clientAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2 text-[#151875] dark:text-pink-400 font-bold uppercase text-xs tracking-widest mb-2">
              <Sparkles size={16} /> Basic Information
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1">Product Name</label>
                <input name="name" required placeholder="Ex: Modern Velvet Sofa" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner text-sm" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1">Product Code</label>
                <input name="code" required placeholder="SKU-10293" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner text-sm" />
              </div>
            </div>

            {/* ADDED: Category Dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1 flex items-center gap-1">
                <LayoutGrid size={12} /> Category
              </label>
              <div className="relative">
                <select 
                  name="categoryId" 
                  required 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1">Short Description (Next to Price)</label>
              <textarea name="description" rows={3} placeholder="Brief summary..." className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner text-sm resize-none" />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1">Long Description (Tab Content)</label>
              <textarea name="longDescription" rows={5} placeholder="Full product story..." className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner text-sm resize-none" />
            </div>
          </section>

          {/* SECTION: Specifications */}
          <section className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#151875] dark:text-pink-400 font-bold uppercase text-xs tracking-widest">
                <ListChecks size={16} /> Specifications
              </div>
              <button type="button" onClick={addSpec} className="text-[#FB2E86] text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add Spec
              </button>
            </div>
            
            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-3 animate-in slide-in-from-left-2">
                  <input placeholder="Label (e.g. Material)" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm outline-none dark:text-white" />
                  <input placeholder="Value (e.g. Wood)" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm outline-none dark:text-white" />
                  <button type="button" onClick={() => removeSpec(index)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><X size={18} /></button>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 space-y-6">
             <div className="flex items-center gap-2 text-[#151875] dark:text-pink-400 font-bold uppercase text-xs tracking-widest mb-2">
              <Palette size={16} /> Aesthetics
            </div>
            {/* Aesthetics content (Colors/Tags) remains unchanged... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1">Available Colors</label>
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner">
                  <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none scale-125" />
                  <button type="button" onClick={addColor} className="bg-[#151875] text-white p-2 rounded-xl hover:bg-blue-900 transition-all shadow-md"><Plus size={18} /></button>
                  <div className="flex -space-x-2 overflow-hidden ml-2">
                    {selectedColors.map(color => (
                      <div key={color} className="relative w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-transform hover:z-10 hover:scale-110 group" style={{ backgroundColor: color }}>
                         <button type="button" onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))} className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full transition-opacity"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 relative" ref={dropdownRef}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter ml-1">Marketing Tags</label>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer flex flex-wrap gap-2 items-center min-h-[52px] shadow-inner">
                  {selectedTags.length === 0 && <span className="text-slate-400 text-sm">Target collections...</span>}
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-[#FB2E86] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      {tag} <X size={10} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} />
                    </span>
                  ))}
                  <ChevronDown size={18} className="ml-auto text-slate-400" />
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in slide-in-from-top-2 duration-200">
                    {AVAILABLE_TAGS.map(tag => (
                      <div key={tag} onClick={() => toggleTag(tag)} className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${selectedTags.includes(tag) ? "text-[#FB2E86] font-bold bg-pink-50/50 dark:bg-pink-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-white"}`}>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Inventory & Image Gallery */}
        <div className="space-y-6">
          {/* Media & Pricing sections remain unchanged... */}
          <section className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 space-y-6 text-center">
            <div className="flex items-center gap-2 text-[#151875] dark:text-pink-400 font-bold uppercase text-xs tracking-widest mb-4">
              <ImageIcon size={16} /> Product Gallery (Max 4)
            </div>
            <div className="relative group">
              <div className={`w-full min-h-56 p-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center justify-center overflow-hidden transition-all hover:border-[#FB2E86]`}>
                {imagePreviews.length > 0 ? (
                  imagePreviews.map((src, i) => (
                    <img key={i} src={src} className="w-20 h-20 object-cover rounded-xl border dark:border-slate-700" alt="Preview" />
                  ))
                ) : (
                  <>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 mb-2 group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter w-full text-center">Upload Images</p>
                  </>
                )}
              </div>
              <input type="file" name="images" multiple accept="image/*" required onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-[10px] text-slate-400">First image will be the Hero shot.</p>
          </section>

          <section className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 space-y-6">
             <div className="flex items-center gap-2 text-[#151875] dark:text-pink-400 font-bold uppercase text-xs tracking-widest mb-2">
              <Tag size={16} /> Pricing & Stock
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Retail Price ($)</label>
                <input name="price" type="number" step="0.01" required className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner font-bold text-lg" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Discount (%)</label>
                <input name="discountPercentage" type="number" defaultValue="0" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Initial Stock</label>
                <input name="stock" type="number" defaultValue="0" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white shadow-inner" />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FB2E86] text-white py-5 rounded-3xl font-extrabold text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-500/30 active:scale-[0.98] disabled:bg-slate-400 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {loading ? "Processing..." : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
}