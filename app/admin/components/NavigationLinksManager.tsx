"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface NavLink {
  id: string;
  title: string;
  url: string;
  order: number;
}

export default function NavigationLinksManager() {
  const [links, setLinks] = useState<NavLink[]>([
    { id: "1", title: "Home", url: "/", order: 1 },
    { id: "2", title: "Shop", url: "/shop", order: 2 },
    { id: "3", title: "Blog", url: "/blog", order: 3 },
    { id: "4", title: "About", url: "/about", order: 4 },
    { id: "5", title: "Contact", url: "/contact", order: 5 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "" });

  const handleAdd = () => {
    if (!formData.title || !formData.url) return;
    if (editingId) {
      setLinks(
        links.map((l) =>
          l.id === editingId ? { ...l, title: formData.title, url: formData.url } : l
        )
      );
      setEditingId(null);
    } else {
      setLinks([
        ...links,
        {
          id: Date.now().toString(),
          title: formData.title,
          url: formData.url,
          order: links.length + 1,
        },
      ]);
    }
    setFormData({ title: "", url: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleEdit = (link: NavLink) => {
    setFormData({ title: link.title, url: link.url });
    setEditingId(link.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
          <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
            {editingId ? "Edit Link" : "Add New Link"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Link Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Shop, About Us"
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Link URL
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="e.g., /shop, /about"
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="px-6 py-2.5 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]"
              >
                {editingId ? "Update Link" : "Add Link"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: "", url: "" });
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
          Add Link
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
                URL
              </th>
              <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{link.title}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{link.url}</td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-[#FB2E86] hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
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
