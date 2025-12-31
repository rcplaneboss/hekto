"use client";

import { useState, useRef, useEffect } from "react";
import { updateProduct } from "@/app/actions/product";
import { X, Plus, ChevronDown, Save, Globe, Lock, Image as ImageIcon, Sparkles, Trash2 } from "lucide-react";

const AVAILABLE_TAGS = ["featured", "latest", "bestseller", "special", "new arrival", "trending", "mini-list"];

export default function EditProductModal({ product, categories, onClose }: any) {
  const [loading, setLoading] = useState(false);
  
  // States
  const [selectedTags, setSelectedTags] = useState<string[]>(product.tags || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(product.colors || []);
  const [isActive, setIsActive] = useState(product.isActive);
  const [currentColor, setCurrentColor] = useState("#FB2E86");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Handling multiple images (max 4 as per your Add form reference)
  // Logic: Initial state is the existing single product image in an array
  const [imagePreviews, setImagePreviews] = useState<string[]>(product.imageUrl ? [product.imageUrl] : []);
  
  // Specs state
  const [specs, setSpecs] = useState<{ key: string, value: string }[]>(
    product.specs ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) })) : []
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      // Keeping it consistent with your "Add" form logic: appending new images
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addColor = () => {
    if (!selectedColors.includes(currentColor)) setSelectedColors((prev) => [...prev, currentColor]);
  };

  const removeColor = (colorToRemove: string) => {
    setSelectedColors(selectedColors.filter(c => c !== colorToRemove));
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    formData.set("tags", selectedTags.join(","));
    formData.set("colors", selectedColors.join(","));
    formData.set("isActive", String(isActive)); 
    formData.set("specs", JSON.stringify(specs));
    
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
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[2.5rem] shadow-2xl border dark:border-slate-800 overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
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
            
            {/* LEFT SIDE: Visuals & Metadata */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Gallery (Max 4)</label>
                <div className="relative group">
                  <div className={`w-full min-h-56 p-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center justify-center overflow-hidden transition-all group-hover:border-[#FB2E86]/50`}>
                    {imagePreviews.length > 0 ? (
                      imagePreviews.map((src, i) => (
                        <img key={i} src={src} className="w-20 h-20 object-cover rounded-xl border dark:border-slate-700 shadow-sm" alt="Preview" />
                      ))
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={40} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Upload Images</p>
                      </div>
                    )}
                    <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border transition-all ${isActive ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isActive ? <Globe className="text-emerald-500" size={20} /> : <Lock className="text-slate-400" size={20} />}
                    <span className={`text-sm font-black uppercase tracking-tighter ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {isActive ? 'Public' : 'Draft'}
                    </span>
                  </div>
                  <button type="button" onClick={() => setIsActive(!isActive)} className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isActive ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <div className="relative">
                  <select name="categoryId" defaultValue={product.categoryId || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold outline-none appearance-none">
                    <option value="">None</option>
                    {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Text Fields & Specs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
                  <input name="name" defaultValue={product.name} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SKU Code</label>
                  <input name="code" defaultValue={product.code} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-mono shadow-inner" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#FB2E86] ml-1">Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-black shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock</label>
                  <input name="stock" type="number" defaultValue={product.stock} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discount (%)</label>
                  <input name="discountPercentage" type="number" defaultValue={product.discountPercentage || 0} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-bold shadow-inner" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Short Description (Next to Price)</label>
                <textarea name="description" defaultValue={product.description} rows={2} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-medium resize-none shadow-inner" placeholder="Brief summary..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Long Description (Full Story)</label>
                <textarea name="longDescription" defaultValue={product.longDescription} rows={4} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl dark:text-white font-medium shadow-inner" placeholder="Detailed content for tabs..." />
              </div>

              {/* SPECIFICATIONS SECTION */}
              <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400">Technical Specs</label>
                  <button type="button" onClick={addSpec} className="p-2 bg-white dark:bg-slate-900 rounded-xl text-[#151875] dark:text-white hover:text-[#FB2E86] transition-colors shadow-sm"><Plus size={16}/></button>
                </div>
                <div className="space-y-3">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-2 animate-in slide-in-from-left-2">
                      <input placeholder="Label" value={spec.key} onChange={(e) => updateSpec(index, 'key', e.target.value)} className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold dark:text-white outline-none shadow-sm" />
                      <input placeholder="Value" value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs dark:text-white outline-none shadow-sm" />
                      <button type="button" onClick={() => removeSpec(index)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TAGS */}
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Marketing Tags</label>
                  <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="min-h-[60px] p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer shadow-inner">
                    {selectedTags.length === 0 && <span className="text-slate-400 text-xs">Select tags...</span>}
                    {selectedTags.map(tag => (
                      <span key={tag} className="bg-[#FB2E86] text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase">
                        {tag} <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} />
                      </span>
                    ))}
                    <ChevronDown size={20} className="ml-auto text-slate-400" />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-2xl rounded-2xl max-h-40 overflow-y-auto p-2">
                      {AVAILABLE_TAGS.map(tag => (
                        <div key={tag} onClick={() => toggleTag(tag)} className={`p-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${selectedTags.includes(tag) ? "bg-[#FB2E86] text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"}`}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* COLORS */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Color Palette</label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl h-[60px] shadow-inner">
                    <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent" />
                    <button type="button" onClick={addColor} className="px-3 text-[10px] font-black text-[#151875] dark:text-white uppercase">Add</button>
                    <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar ml-2">
                      {selectedColors.map(color => (
                        <div key={color} onClick={() => removeColor(color)} className="w-6 h-6 rounded-full shrink-0 cursor-pointer border-2 border-white dark:border-slate-900 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex gap-4 sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 border-t dark:border-slate-800">
            <button type="button" onClick={onClose} className="flex-1 py-5 rounded-[1.5rem] font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">
              Discard Changes
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-5 bg-[#151875] hover:bg-[#FB2E86] text-white rounded-[1.5rem] font-black transition-all shadow-xl disabled:bg-slate-400 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
              {loading ? "Saving Masterpiece..." : <><Save size={18}/> Update Catalog</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}