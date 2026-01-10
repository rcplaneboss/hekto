"use client";

import { Trash2, Eye, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
  replied: boolean;
}

export default function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      subject: "Product Inquiry",
      message: "I have a question about product X...",
      submittedAt: "2024-12-22",
      read: true,
      replied: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Order Support",
      message: "I need help with my order...",
      submittedAt: "2024-12-21",
      read: false,
      replied: false,
    },
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const handleMarkAsRead = (id: string) => {
    setSubmissions(
      submissions.map((s) =>
        s.id === id ? { ...s, read: true } : s
      )
    );
  };

  const handleMarkAsReplied = (id: string) => {
    setSubmissions(
      submissions.map((s) =>
        s.id === id ? { ...s, replied: true } : s
      )
    );
  };

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter((s) => s.id !== id));
    setSelectedSubmission(null);
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1">
          Unread Messages
        </p>
        <p className="text-3xl font-bold text-[#FB2E86]">{unreadCount}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  From
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Subject
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => { setSelectedSubmission(sub); handleMarkAsRead(sub.id); }}
                  className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedSubmission?.id === sub.id
                      ? "bg-pink-50 dark:bg-slate-800"
                      : ""
                  }`}
                >
                  <td className={`px-6 py-4 text-sm ${sub.read ? "text-slate-600 dark:text-slate-400" : "font-semibold text-slate-700 dark:text-slate-200"}`}>
                    {sub.name}
                  </td>
                  <td className={`px-6 py-4 text-sm truncate ${sub.read ? "text-slate-600 dark:text-slate-400" : "font-semibold text-slate-700 dark:text-slate-200"}`}>
                    {sub.subject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {selectedSubmission ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    From
                  </p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedSubmission.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedSubmission.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Subject
                  </p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedSubmission.subject}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Message
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {selectedSubmission.message}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 pt-4 border-t dark:border-slate-700">
                  {!selectedSubmission.replied && (
                    <button
                      onClick={() => handleMarkAsReplied(selectedSubmission.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                    >
                      <CheckCircle size={16} />
                      Mark Replied
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow text-center text-slate-500 dark:text-slate-400">
              <Eye size={32} className="mx-auto mb-3 opacity-50" />
              <p>Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
