"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

export default function StaticPagesManager() {
  const [pages, setPages] = useState<StaticPage[]>([
    {
      id: "1",
      title: "About Us",
      slug: "about",
      content: "Learn more about our company...",
      published: true,
    },
    {
      id: "2",
      title: "FAQ",
      slug: "faq",
      content: "Frequently asked questions...",
      published: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    published: true,
  });

  const handleAdd = () => {
    if (!formData.title || !formData.slug) return;
    if (editingId) {
      setPages(
        pages.map((p) =>
          p.id === editingId ? { ...p, ...formData } : p
        )
      );
      setEditingId(null);
    } else {
      setPages([
        ...pages,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }
    setFormData({ title: "", slug: "", content: "", published: true });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const handleEdit = (page: StaticPage) => {
    setFormData(page);
    setEditingId(page.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
          <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
            {editingId ? "Edit Page" : "Create New Page"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., About Us"
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Page Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., about-us"
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Page content..."
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 rounded accent-[#FB2E86]"
              />
              <label htmlFor="published" className="font-semibold text-slate-700 dark:text-slate-300">
                Publish Page
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="px-6 py-2.5 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]"
              >
                {editingId ? "Update Page" : "Create Page"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: "", slug: "", content: "", published: true });
                }}
                className="px-6 py-2.5 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-semibold hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]"
        >
          <Plus size={20} />
          Create Page
        </button>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                Title
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                Slug
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{page.title}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${page.published ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {page.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 text-[#FB2E86] hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
