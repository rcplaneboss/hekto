"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SiteConfigurationForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteTitle: "Hekto - Premium eCommerce",
    metaDescription: "Shop the best products online at Hekto.",
    googleAnalyticsId: "",
    facebookPixelId: "",
    customCss: "",
    customJs: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    alert("Site configuration saved!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
        <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
          General Site Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Site Title
            </label>
            <input
              type="text"
              name="siteTitle"
              value={formData.siteTitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
        <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
          Integrations
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={formData.googleAnalyticsId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                name="facebookPixelId"
                value={formData.facebookPixelId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
        <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
          Custom Code
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Custom CSS
            </label>
            <textarea
              name="customCss"
              value={formData.customCss}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86] font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Custom JS
            </label>
            <textarea
              name="customJs"
              value={formData.customJs}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86] font-mono"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968] disabled:opacity-50 transition-all"
      >
        <Save size={20} />
        {loading ? "Saving..." : "Save Configuration"}
      </button>
    </form>
  );
}
