"use client";

import { useState, useRef, useEffect } from "react";
import { createProduct } from "@/app/actions/product";
import { ChevronDown, X, Plus } from "lucide-react";

const AVAILABLE_TAGS = ["featured", "latest", "bestseller", "special", "new arrival"];

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState("#FB2E86");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const removeColor = (colorToRemove: string) => {
    setSelectedColors(selectedColors.filter(c => c !== colorToRemove));
  };

  async function clientAction(formData: FormData) {
    setLoading(true);
    formData.set("tags", selectedTags.join(","));
    formData.set("colors", selectedColors.join(","));
    
    try {
      await createProduct(formData);
      alert("Product created successfully!");
      setSelectedTags([]);
      setSelectedColors([]);
      (document.getElementById("product-form") as HTMLFormElement).reset();
    } catch (err) {
      alert("Error creating product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-16 px-4 w-screen transition-colors">
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800">
        <h2 className="text-3xl font-bold mb-8 text-[#151875] dark:text-white font-josefin">
          Product Inventory
        </h2>

        <form id="product-form" action={clientAction} className="space-y-6">
          {/* Name & Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Product Name</label>
              <input name="name" required className="p-3 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#FB2E86] outline-none dark:text-white" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Product Code</label>
              <input name="code" required className="p-3 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg dark:text-white" />
            </div>
          </div>

          {/* Price & Image Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Price ($)</label>
              <input name="price" type="number" step="0.01" required className="p-3 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg dark:text-white" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Product Image</label>
              <input name="image" type="file" accept="image/*" required className="p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#FB2E86] hover:file:bg-pink-100" />
            </div>
          </div>

          {/* Tags Multi-Select */}
          <div className="flex flex-col space-y-2 relative" ref={dropdownRef}>
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Tags</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-3 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg cursor-pointer flex flex-wrap gap-2 items-center min-h-[50px]"
            >
              {selectedTags.length === 0 && <span className="text-gray-400">Select tags...</span>}
              {selectedTags.map(tag => (
                <span key={tag} className="bg-[#FB2E86] text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  {tag}
                  <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} />
                </span>
              ))}
              <ChevronDown size={18} className="ml-auto text-gray-400" />
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {AVAILABLE_TAGS.map(tag => (
                  <div key={tag} onClick={() => toggleTag(tag)} className={`p-3 text-sm cursor-pointer transition-colors ${selectedTags.includes(tag) ? "bg-pink-50 dark:bg-pink-900/20 text-[#FB2E86] font-bold" : "hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"}`}>
                    {tag}
                  </div>
                ))}
              </div>
            )}
            <input type="hidden" name="tags" value={selectedTags.join(",")} />
          </div>

          {/* Color Multi-Picker */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Product Colors</label>
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg">
              <input 
                type="color" 
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
              />
              <button 
                type="button"
                onClick={addColor}
                className="flex items-center gap-2 bg-[#151875] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900 transition-all"
              >
                <Plus size={16} /> Add Color
              </button>
              
              <div className="flex flex-wrap gap-2 ml-4">
                {selectedColors.map(color => (
                  <div 
                    key={color} 
                    className="group relative w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <button 
                      type="button"
                      onClick={() => removeColor(color)}
                      className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <input type="hidden" name="colors" value={selectedColors.join(",")} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FB2E86] text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
          >
            {loading ? "Creating Product..." : "Add Product to Shop"}
          </button>
        </form>
      </div>
    </div>
  );
}