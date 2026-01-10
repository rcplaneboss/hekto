"use client";

import { Trash2, Mail } from "lucide-react";
import { useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: "1", email: "john@example.com", subscribedAt: "2024-12-20", active: true },
    { id: "2", email: "jane@example.com", subscribedAt: "2024-12-15", active: true },
    { id: "3", email: "bob@example.com", subscribedAt: "2024-12-10", active: false },
  ]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const handleUnsubscribe = (id: string) => {
    setSubscribers(
      subscribers.map((s) =>
        s.id === id ? { ...s, active: false } : s
      )
    );
  };

  const handleDelete = (id: string) => {
    setSubscribers(subscribers.filter((s) => s.id !== id));
  };

  const filteredSubscribers = subscribers.filter((s) => {
    if (filter === "active") return s.active;
    if (filter === "inactive") return !s.active;
    return true;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.active).length,
    inactive: subscribers.filter((s) => !s.active).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">
            Total Subscribers
          </p>
          <p className="text-3xl font-bold text-[#151875] dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">
            Active
          </p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">
            Inactive
          </p>
          <p className="text-3xl font-bold text-orange-600">{stats.inactive}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "active", "inactive"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === tab
                ? "bg-[#FB2E86] text-white"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                Email
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                Subscribed
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
            {filteredSubscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{sub.email}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                  {new Date(sub.subscribedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.active ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {sub.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg">
                    <Mail size={18} />
                  </button>
                  {sub.active && (
                    <button
                      onClick={() => handleUnsubscribe(sub.id)}
                      className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700 rounded-lg"
                    >
                      Unsubscribe
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(sub.id)}
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
