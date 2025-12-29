"use client";

import { useState, useRef, useEffect } from "react";
import { updateProduct } from "@/app/actions/product";
import { X, Plus, ChevronDown, Save, Globe, Lock, Image as ImageIcon, Sparkles, Palette } from "lucide-react";

const AVAILABLE_TAGS = ["featured", "latest", "bestseller", "special", "new arrival", "trending", "mini-list"];

export default function EditProductModal({ product, categories, onClose }: any) {
  const [loading, setLoading] = useState(false);
  
  // States
  const [selectedTags, setSelectedTags] = useState<string[]>(product.tags || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(product.colors || []);
  const [isActive, setIsActive] = useState(product.isActive);
  const [currentColor, setCurrentColor] = useState("#FB2E86");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // --- HELPER FUNCTIONS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addColor = () => {
    if (!selectedColors.includes(currentColor)) {
      setSelectedColors((prev) => [...prev, currentColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    setSelectedColors(selectedColors.filter(c => c !== colorToRemove));
  };

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    // Sync React state to FormData
    formData.set("tags", selectedTags.join(","));
    formData.set("colors", selectedColors.join(","));
    formData.set("isActive", String(isActive)); 
    
    try {
      await updateProduct(product.id, formData);
      onClose();
    } catch (err) {
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#151875]/20 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* --- HEADER --- */}
        <div className="px-8 py-6 border-b dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-[#FB2E86]">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#151875] dark:text-white tracking-tight">Edit Masterpiece</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {product.id.slice(-8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-rose-500">
            <X size={28} />
          </button>
        </div>

        <form action={handleUpdate} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT SIDE: Visuals */}
            <div className="lg:col-span-4 space-y-8">
              <div className="relative group">
                <div className="aspect-square rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#FB2E86]/50">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-contain p-4" alt="Preview" />
                  ) : (
                    <ImageIcon size={40} className="text-slate-300" />
                  )}
                  <input type="file" name="image" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* isActive Switch */}
              <div className={`p-6 rounded-3xl border transition-all ${isActive ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isActive ? <Globe className="text-emerald-500" size={20} /> : <Lock className="text-slate-400" size={20} />}
                    <span className={`text-sm font-black uppercase tracking-tighter ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {isActive ? 'Public' : 'Draft'}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isActive ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Inputs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
                  <input name="name" defaultValue={product.name} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SKU Code</label>
                  <input name="code" defaultValue={product.code} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#FB2E86] ml-1">Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock</label>
                  <input name="stock" type="number" defaultValue={product.stock} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <select name="categoryId" defaultValue={product.categoryId || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold outline-none">
                    <option value="">None</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tags</label>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="min-h-[60px] p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer border-2 border-transparent hover:border-slate-200">
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-[#FB2E86] text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-tighter">
                      {tag} <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} />
                    </span>
                  ))}
                  <ChevronDown size={20} className="ml-auto text-slate-400 mr-2" />
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-2xl rounded-2xl max-h-48 overflow-y-auto p-2">
                    {AVAILABLE_TAGS.map(tag => (
                      <div key={tag} onClick={() => toggleTag(tag)} className={`p-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${selectedTags.includes(tag) ? "bg-[#FB2E86] text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"}`}>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Picker */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400">Color Palette</label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl">
                    <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent" />
                    <button type="button" onClick={addColor} className="px-3 text-[10px] font-black text-[#151875] dark:text-white">ADD</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedColors.map(color => (
                    <div key={color} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg relative group" style={{ backgroundColor: color }}>
                      <button type="button" onClick={() => removeColor(color)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 rounded-[1.5rem] font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">
              Discard
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-5 bg-[#151875] hover:bg-[#FB2E86] text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-indigo-500/20 disabled:bg-slate-400 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
              {loading ? "Saving..." : <><Save size={18}/> Update Catalog</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}