"use client";

import { useState } from "react";
import { Save } from "lucide-react";


interface StoreSettingsFormProps {
  initialData?: any;
  saveAction?: (formData: any) => Promise<{ success: boolean }>;
}

export default function StoreSettingsForm({ initialData, saveAction }: StoreSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: initialData?.logoText || "Hekto Store",
    storeEmail: initialData?.topBarEmail || "admin@hekto.com",
    storePhone: initialData?.topBarPhone || "+1 (555) 123-4567",
    storeAddress: initialData?.footerAddress || "123 Commerce Street, Business City, BC 12345",
    currency: initialData?.currency || "NGN",
    taxRate: initialData?.taxRate?.toString() || "7.5",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [status, setStatus] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      if (saveAction) {
        const result = await saveAction(formData);
        if (result.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
        <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Store Email
              </label>
              <input
                type="email"
                name="storeEmail"
                value={formData.storeEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Store Phone
              </label>
              <input
                type="tel"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Store Address
            </label>
            <textarea
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
        <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
          Store Configuration
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              >
                <option value="NGN">₦ NGN (Nigerian Naira)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968] disabled:opacity-50 transition-all"
      >
        <Save size={20} />
        {loading ? "Saving..." : "Save Settings"}
      </button>
      {status === "success" && (
        <p className="mt-3 text-green-600 font-semibold">Store settings saved successfully!</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-red-600 font-semibold">Error saving settings. Please try again.</p>
      )}
    </form>
  );
}
