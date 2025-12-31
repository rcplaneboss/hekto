"use client";

import { useState } from "react";
import { createHeroBanner } from "@/app/actions/banner";

export default function BannerUploadForm() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-4 flex items-center justify-center">
    <form action={async (formData) => {
      setLoading(true);
      await createHeroBanner(formData);
      setLoading(false);
      alert("Banner uploaded successfully!");
    }} className="max-w-xl p-8 bg-white dark:bg-slate-900 rounded-xl shadow-md space-y-4">
      
      <h2 className="text-2xl font-bold dark:text-white">New Hero Banner</h2>
      
      <input name="mainTitle" placeholder="Main Title (e.g. New Collection)" required 
        className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white" />
      
      <input name="subTitle" placeholder="Subtitle (Pink text)" required 
        className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white" />
      
      <textarea name="description" placeholder="Description..." required 
        className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white" />

      <div className="space-y-2">
        <label className="block text-sm font-medium dark:text-slate-300">Product Image</label>
        <input name="image" type="file" accept="image/*" required 
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#FB2E86] text-white py-3 rounded font-bold hover:bg-pink-600 disabled:bg-gray-400">
        {loading ? "Uploading..." : "Publish Banner"}
      </button>
    </form>
    </div>
  );
}