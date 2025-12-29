
"use client";

import { useState, useRef } from "react";
import { updateProduct } from "@/app/actions/product";
import { X, Plus, ChevronDown } from "lucide-react";

const AVAILABLE_TAGS = ["featured", "latest", "bestseller", "special", "new arrival", "trending", "mini-list"];

export default function EditProductModal({ product, categories, onClose }: any) {
  const [loading, setLoading] = useState(false);
  
  // Manage Tags and Colors in state for the UI
  const [selectedTags, setSelectedTags] = useState<string[]>(product.tags || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(product.colors || []);
  const [currentColor, setCurrentColor] = useState("#FB2E86");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addColor = () => {
    if (!selectedColors.includes(currentColor)) {
      setSelectedColors([...selectedColors, currentColor]);
    }
  };

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    // Append the state-managed arrays to the formData
    formData.set("tags", selectedTags.join(","));
    formData.set("colors", selectedColors.join(","));
    
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-[#151875] text-white">
          <div>
            <h2 className="text-xl font-bold font-josefin">Edit Product</h2>
            <p className="text-xs opacity-70">ID: {product.id}</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>

        <form action={handleUpdate} className="p-6 space-y-5 overflow-y-auto">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Product Name</label>
              <input name="name" defaultValue={product.name} required className="w-full p-2.5 border dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white focus:ring-2 focus:ring-[#FB2E86] outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Product Code</label>
              <input name="code" defaultValue={product.code} required className="w-full p-2.5 border dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
          </div>

          {/* Pricing & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Price ($)</label>
              <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full p-2.5 border dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Discount %</label>
              <input name="discountPercentage" type="number" defaultValue={product.discountPercentage} className="w-full p-2.5 border dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Category</label>
              <select name="categoryId" defaultValue={product.categoryId || ""} className="w-full p-2.5 border dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white outline-none">
                <option value="">No Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags (Multi-select UI) */}
          <div className="space-y-1 relative">
            <label className="text-xs font-bold uppercase text-gray-500">Tags</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 border dark:border-slate-700 dark:bg-slate-800 rounded-lg flex flex-wrap gap-2 cursor-pointer min-h-[45px]"
            >
              {selectedTags.map(tag => (
                <span key={tag} className="bg-[#FB2E86] text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                  {tag} <X size={10} onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} />
                </span>
              ))}
              <ChevronDown size={16} className="ml-auto text-gray-400" />
            </div>
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-lg max-h-40 overflow-y-auto">
                {AVAILABLE_TAGS.map(tag => (
                  <div key={tag} onClick={() => toggleTag(tag)} className={`p-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 ${selectedTags.includes(tag) ? "text-[#FB2E86] font-bold" : "dark:text-white"}`}>
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Colors</label>
            <div className="flex items-center gap-3">
              <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
              <button type="button" onClick={addColor} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded uppercase font-bold dark:text-white">Add Color</button>
              <div className="flex gap-2">
                {selectedColors.map(color => (
                  <div key={color} className="w-6 h-6 rounded-full border border-gray-300 relative group" style={{ backgroundColor: color }}>
                    <button type="button" onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={8} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Update Image</label>
              <input name="image" type="file" className="w-full text-xs dark:text-gray-400" />
              <p className="text-[10px] text-gray-400 italic">Leave empty to keep current image</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Stock Status</label>
              <input name="stock" type="number" defaultValue={product.stock} className="w-full p-2 border dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
          </div>

          <div className="flex gap-4 pt-4 pb-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border dark:border-slate-700 rounded-xl font-bold dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#FB2E86] text-white rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 disabled:bg-gray-400">
              {loading ? "Saving Changes..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}