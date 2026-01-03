"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, Heart, Facebook, Instagram, Twitter, Minus, Plus, Loader2, Send, User, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext"; // Added Wishlist Context
import { addToCart } from "@/app/actions/cart";
import { addReview } from "@/app/actions/reviews";
import { getRelatedProducts } from "@/app/actions/product";

export default function ProductDetailsClient({ product }: { product: any }) {
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Review States
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { refreshCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); // Wishlist Hook

  const isSaved = isInWishlist(product.id);

  useEffect(() => {
    if (product?.imageUrl) setSelectedImage(product.imageUrl);
    if (product?.colors?.length > 0) setSelectedColor(product.colors[0]);

    const fetchRelated = async () => {
      if (product?.categoryId) {
        const related = await getRelatedProducts(product.categoryId, product.id);
        setRelatedProducts(related);
      }
    };
    fetchRelated();

    const existingItem = cart?.items.find((item: any) => item.productId === product.id);
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [product, cart]);

  if (!product) return null;

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(product.id, quantity, selectedColor || null);
        refreshCart();
      } catch (error) {
        console.error("Failed to add to cart", error);
      }
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("rating", selectedRating.toString());
    formData.append("comment", reviewComment);

    startTransition(async () => {
      try {
        await addReview(formData);
        setReviewComment("");
        setSelectedRating(5);
      } catch (error) {
        alert("Please login to post a review!");
      }
    });
  };

  const allImages = [
    product.imageUrl,
    ...(product.images?.map((img: any) => img.url) || [])
  ].filter(Boolean);

  const mainAvgRating = product.reviews?.length > 0 
    ? product.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / product.reviews.length 
    : 5;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-josefin transition-colors pb-20">
      <PageHeader title="Product Details" />

      {/* PRODUCT INFO SECTION */}
      <div className="container mx-auto max-w-6xl py-10 md:py-20 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-[#1e293b] p-3 md:p-4 shadow-[0_0_25px_rgba(0,0,0,0.06)] rounded-sm max-md:border dark:border-slate-800">

          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 w-full md:w-[150px] no-scrollbar">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`flex-shrink-0 w-24 h-24 md:w-full md:h-32 bg-[#F6F7FB] dark:bg-slate-900 rounded-sm flex items-center justify-center overflow-hidden border-2 transition-all ${selectedImage === url ? "border-[#FB2E86]" : "border-transparent"}`}
                >
                  <img src={url} alt="thumb" className="object-contain w-full h-full p-2" />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-[#F6F7FB] dark:bg-slate-900 rounded-sm flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-[480px]">
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
                <Star key={i} size={12} fill={i < Math.round(mainAvgRating) ? "#FFC416" : "none"} className="text-[#FFC416]" />
              ))}
              <span className="text-[#151875] dark:text-slate-400 text-xs ml-2">({product.reviews?.length || 0})</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-[#151875] dark:text-[#FB2E86]">${product.price}</span>
            </div>

            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="text-[#0D134E] dark:text-slate-200 font-bold mb-2">Color</p>
                <div className="flex gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-4 h-4 rounded-full border transition-all ${selectedColor === color ? "ring-2 ring-[#FB2E86] ring-offset-2 dark:ring-offset-[#1e293b]" : "border-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="text-[#A9ACC6] dark:text-slate-400 leading-[1.8] mb-6 text-sm md:text-base">
              {product.description}
            </p>

            <div className="flex items-center bg-gray-100 dark:bg-slate-800 w-fit rounded p-1 mb-6">
              <button onClick={() => handleQuantityChange("dec")} className="p-1 dark:text-white"><Minus size={14} /></button>
              <span className="px-3 font-bold dark:text-white">{quantity}</span>
              <button onClick={() => handleQuantityChange("inc")} className="p-1 dark:text-white"><Plus size={14} /></button>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isPending}
                className="text-[#151875] dark:text-white font-bold hover:text-[#FB2E86] transition-colors flex items-center gap-2"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={16} />}
                {isPending ? "Adding..." : "Add To Cart"}
              </button>
              
              {/* Updated Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(product)}
                className="group flex items-center gap-2 transition-all active:scale-90"
              >
                <Heart 
                  size={20} 
                  className={`transition-all duration-300 ${isSaved ? "fill-[#FB2E86] text-[#FB2E86]" : "text-[#151875] dark:text-white group-hover:text-[#FB2E86]"}`} 
                />
                <span className={`text-sm font-bold ${isSaved ? "text-[#FB2E86]" : "text-[#151875] dark:text-slate-300"}`}>
                  {isSaved ? "Saved" : "Wishlist"}
                </span>
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t dark:border-slate-800">
              <p className="text-[#151875] dark:text-slate-200 font-bold text-sm">
                Categories: <span className="font-normal text-[#A9ACC6] ml-2"><Link href={`/shop?category=${product.category?.slug}`}>{product.category?.name}</Link></span>
              </p>
              <p className="text-[#151875] dark:text-slate-200 font-bold text-sm">
                Tags: <span className="font-normal text-[#A9ACC6] ml-2 flex gap-3 w-full flex-wrap">
                  {product.tags?.map((tag: string) => (
                    <Link key={tag} href={`/shop?query=${tag}`} className="hover:text-[#FB2E86]">
                      {tag}
                    </Link>
                  ))}
                </span>
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
          <div className="flex overflow-x-auto gap-10 mb-10 no-scrollbar">
            {["Description", "Additional Info", "Specs", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-lg md:text-[24px] font-bold pb-2 transition-all whitespace-nowrap ${activeTab === tab.toLowerCase()
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
                <p className="leading-[2] whitespace-pre-line">{product.longDescription || product.description}</p>
              </div>
            )}
            {activeTab === "additional info" && (
              <div className="animate-in fade-in duration-500">
                <h4 className="text-[#151875] dark:text-white text-xl font-bold mb-4">Additional Information</h4>
                <p className="leading-[2] whitespace-pre-line">{product.additionalInfo || "No additional information provided."}</p>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="animate-in fade-in duration-500">
                <h4 className="text-[#151875] dark:text-white text-xl font-bold mb-6">Technical Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    Object.entries(product.specs).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between border-b dark:border-slate-800 pb-2">
                        <span className="text-[#151875] dark:text-slate-200 font-bold uppercase text-[10px] tracking-widest">{key}</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))
                  ) : <p>Specifications not available.</p>}
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[#151875] dark:text-white text-xl font-bold">Customer Reviews ({product.reviews?.length || 0})</h4>
                    <div className="max-h-[500px] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                      {product.reviews?.map((review: any, idx: number) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-sm shadow-sm border dark:border-slate-800">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                <User size={20} className="text-gray-500" />
                              </div>
                              <div>
                                <p className="text-[#151875] dark:text-white font-bold">{review.user?.name || "Anonymous"}</p>
                                <div className="flex gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} fill={i < review.rating ? "#FFC416" : "none"} className={i < review.rating ? "text-[#FFC416]" : "text-gray-300"} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm leading-relaxed mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-sm shadow-md border dark:border-slate-800 h-fit sticky top-4">
                    <h4 className="text-[#151875] dark:text-white text-xl font-bold mb-6">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-[#151875] dark:text-slate-200 mb-2">Overall Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setSelectedRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star size={28} fill={(hoverRating || selectedRating) >= star ? "#FFC416" : "none"} className={(hoverRating || selectedRating) >= star ? "text-[#FFC416]" : "text-gray-300"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#151875] dark:text-slate-200 mb-2">Review Content</label>
                        <textarea rows={4} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="What was your experience?" className="w-full p-4 bg-[#F4F4FC] dark:bg-slate-800 rounded-sm border-none focus:ring-2 focus:ring-[#FB2E86] outline-none text-sm text-[#151875] dark:text-white" required />
                      </div>
                      <button type="submit" disabled={isPending} className="w-full bg-[#FB2E86] text-white font-bold py-4 rounded-sm flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors disabled:opacity-50 shadow-lg shadow-pink-500/20">
                        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      <div className="container mx-auto max-w-6xl py-20 px-4 md:px-6 overflow-hidden">
        <h3 className="text-2xl md:text-[36px] font-bold text-[#101750] dark:text-white mb-10">Related Products</h3>
        
        <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-6 md:pb-0 no-scrollbar snap-x">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <div key={item.id} className="min-w-[170px] w-[170px] md:w-auto flex-shrink-0 snap-start group">
                <div className="aspect-square overflow-hidden bg-[#F6F7FB] dark:bg-slate-900 rounded-sm mb-3 relative">
                  <Link href={`/shop/${item.id}`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300" 
                    />
                  </Link>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <Link href={`/product/${item.id}`}>
                      <h4 className="text-[#151875] dark:text-slate-200 font-bold text-xs lg:text-sm truncate hover:text-[#FB2E86] transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <div className="flex shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={8} 
                          fill={i < Math.round(item.avgRating || 5) ? "#FFC416" : "none"} 
                          className="text-[#FFC416]" 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#151875] dark:text-[#FB2E86] font-bold text-xs">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full col-span-full py-10 text-center border border-dashed rounded dark:border-slate-800">
               <p className="text-[#A9ACC6] text-sm">No related products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}