"use client";

import { useState, useEffect } from "react";
import { Star, Heart, Facebook, Instagram, Twitter } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function ProductDetailsClient({ product }: { product: any }) {
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (product?.imageUrl) setSelectedImage(product.imageUrl);
    if (product?.colors?.length > 0) setSelectedColor(product.colors[0]);
  }, [product]);

  if (!product) return null;

  const allImages = [
    product.imageUrl,
    ...(product.images?.map((img: any) => img.url) || [])
  ].filter(Boolean);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-josefin transition-colors pb-20">
      <PageHeader title="Product Details" />

      <div className="container mx-auto max-w-6xl py-10 md:py-20 px-4 md:px-6">
        {/* MAIN PRODUCT CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-[#1e293b] p-3 md:p-4 shadow-[0_0_25px_rgba(0,0,0,0.06)] rounded-sm border dark:border-slate-800">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 w-full md:w-[150px] no-scrollbar [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allImages.map((url, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(url)}
                  className={`flex-shrink-0 w-24 h-24 md:w-full md:h-32 bg-[#F6F7FB] dark:bg-slate-800 rounded-sm flex items-center justify-center overflow-hidden border-2 transition-all ${
                    selectedImage === url ? "border-[#FB2E86]" : "border-transparent"
                  }`}
                >
                  <img src={url} alt="thumb" className="object-contain w-full h-full p-2" />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-[#F6F7FB] dark:bg-slate-800 rounded-sm flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-[480px]">
              <img src={selectedImage} alt={product.name} className="object-contain max-h-[420px] w-full p-6" />
            </div>
          </div>

          {/* RIGHT: Product Content */}
          <div className="lg:col-span-5 flex flex-col justify-center px-2 md:px-6">
            <h2 className="text-2xl md:text-[36px] font-bold text-[#0D134E] dark:text-white mb-2 leading-tight">
              {product.name}
            </h2>
            
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < 4 ? "#FFC416" : "none"} className={i < 4 ? "text-[#FFC416]" : "text-gray-300"} />
              ))}
              <span className="text-[#151875] dark:text-slate-400 text-xs ml-2">({product.reviews?.length || 0})</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-lg font-bold text-[#151875] dark:text-[#FB2E86]">${product.price}</span>
            </div>

            {/* Dynamic Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-[#0D134E] dark:text-slate-200 font-bold mb-2">Color</p>
                <div className="flex gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        selectedColor === color ? "ring-2 ring-[#FB2E86] ring-offset-2 dark:ring-offset-[#1e293b]" : "border-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="text-[#A9ACC6] dark:text-slate-400 leading-[1.8] mb-6 text-sm md:text-base">
              {product.description}
            </p>
            
            <div className="flex items-center gap-5 mb-8">
              <button className="text-[#151875] dark:text-white font-bold hover:text-[#FB2E86] transition-colors">
                Add To Cart
              </button>
              <Heart size={18} className="text-[#151875] dark:text-white cursor-pointer hover:text-[#FB2E86]" />
            </div>

            <div className="space-y-4 pt-4 ">
              <p className="text-[#151875] dark:text-slate-200 font-bold text-sm">
                Categories: <span className="font-normal text-[#A9ACC6] ml-2">{product.category?.name}</span>
              </p>
              <p className="text-[#151875] dark:text-slate-200 font-bold text-sm">
                Tags: <span className="font-normal text-[#A9ACC6] ml-2">{product.tags?.join(", ")}</span>
              </p>
              <div className="flex items-center gap-4">
                <span className="text-[#151875] dark:text-slate-200 font-bold text-sm">Share</span>
                <div className="flex gap-3">
                  <Facebook size={16} className="text-[#151875] dark:text-slate-300 cursor-pointer" />
                  <Instagram size={16} className="text-[#151875] dark:text-slate-300 cursor-pointer" />
                  <Twitter size={16} className="text-[#151875] dark:text-slate-300 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="bg-[#F9F8FE] dark:bg-[#111a2e] py-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex overflow-x-auto gap-10 mb-10  no-scrollbar">
            {["Description", "Additional Info", "Specs", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-lg md:text-[24px] font-bold pb-2 transition-all whitespace-nowrap ${
                  activeTab === tab.toLowerCase() 
                    ? "text-[#151875] dark:text-[#FB2E86] border-b-2 border-[#151875] dark:border-[#FB2E86]" 
                    : "text-[#151875]/40 dark:text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-[#A9ACC6] dark:text-slate-400">
            {activeTab === "description" && (
              <div className="animate-in fade-in duration-500">
                <h4 className="text-[#151875] dark:text-white text-xl font-bold mb-4">Full Product Description</h4>
                <p className="leading-[2] whitespace-pre-line">
                  {product.longDescription}
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 max-w-3xl">
                {product.specs && Object.entries(product.specs).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between border-b dark:border-slate-800 py-4">
                    <span className="text-[#151875] dark:text-slate-200 font-bold uppercase text-xs tracking-widest">{key}</span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="py-4">
                <p>Reviews ({product.reviews?.length || 0})</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}