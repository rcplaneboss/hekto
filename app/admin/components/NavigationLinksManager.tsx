"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, GripVertical } from "lucide-react";
import {
  addGroup,
  editGroup,
  deleteGroup,
  reorderGroups,
  addLink,
  editLink,
  deleteLink,
  reorderLinks,
} from "../actions/navLinks";

interface NavLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface LinkGroup {
  id: string;
  title: string;
  section: string;
  order: number;
  links: NavLink[];
}

interface NavigationLinksManagerProps {
  groups: LinkGroup[];
}

  // Local state for forms and drag-and-drop
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LinkGroup | null>(null);
  const [groupForm, setGroupForm] = useState({ title: "", section: "HEADER_MAIN" });
  const [showLinkForm, setShowLinkForm] = useState<string | null>(null); // groupId
  const [editingLink, setEditingLink] = useState<{ groupId: string; link: NavLink } | null>(null);
  const [linkForm, setLinkForm] = useState({ label: "", url: "" });

  // Drag-and-drop state (for demo, not persistent)
  // In production, use a library like dnd-kit or react-beautiful-dnd

  // Handlers for group CRUD
  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      await editGroup({ id: editingGroup.id, title: groupForm.title, section: groupForm.section });
    } else {
      await addGroup({ title: groupForm.title, section: groupForm.section });
    }
    setShowGroupForm(false);
    setEditingGroup(null);
    setGroupForm({ title: "", section: "HEADER_MAIN" });
  };
  const handleGroupEdit = (group: LinkGroup) => {
    setEditingGroup(group);
    setGroupForm({ title: group.title, section: group.section });
    setShowGroupForm(true);
  };
  const handleGroupDelete = async (id: string) => {
    if (confirm("Delete this group and all its links?")) {
      await deleteGroup(id);
    }
  };

  // Handlers for link CRUD
  const handleLinkSubmit = async (e: React.FormEvent, groupId: string) => {
    e.preventDefault();
    if (editingLink && editingLink.groupId === groupId) {
      await editLink({ id: editingLink.link.id, label: linkForm.label, url: linkForm.url });
    } else {
      await addLink({ groupId, label: linkForm.label, url: linkForm.url });
    }
    setShowLinkForm(null);
    setEditingLink(null);
    setLinkForm({ label: "", url: "" });
  };
  const handleLinkEdit = (groupId: string, link: NavLink) => {
    setEditingLink({ groupId, link });
    setLinkForm({ label: link.label, url: link.url });
    setShowLinkForm(groupId);
  };
  const handleLinkDelete = async (id: string) => {
    if (confirm("Delete this link?")) {
      await deleteLink(id);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-josefin font-bold mb-4 text-[#151875] dark:text-white">Navigation Groups</h2>
      <button
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]"
        onClick={() => {
          setShowGroupForm(true);
          setEditingGroup(null);
          setGroupForm({ title: "", section: "HEADER_MAIN" });
        }}
      >
        <Plus size={18} /> Add Group
      </button>

      {showGroupForm && (
        <form
          className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow mb-6"
          onSubmit={handleGroupSubmit}
        >
          <h3 className="font-josefin font-bold text-lg mb-4 text-[#151875] dark:text-white">
            {editingGroup ? "Edit Group" : "Add New Group"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Group Title</label>
              <input
                type="text"
                value={groupForm.title}
                onChange={(e) => setGroupForm({ ...groupForm, title: e.target.value })}
                placeholder="e.g., Categories, Customer Care"
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Section</label>
              <select
                value={groupForm.section}
                onChange={(e) => setGroupForm({ ...groupForm, section: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FB2E86]"
              >
                <option value="HEADER_MAIN">Header Main</option>
                <option value="FOOTER">Footer</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]">
                {editingGroup ? "Update Group" : "Add Group"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGroupForm(false);
                  setEditingGroup(null);
                  setGroupForm({ title: "", section: "HEADER_MAIN" });
                }}
                className="px-6 py-2.5 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-semibold hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.id} className="bg-white dark:bg-slate-900 rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-josefin font-semibold text-lg text-[#151875] dark:text-white">
                {group.title} <span className="ml-2 text-xs text-slate-500">[{group.section}]</span>
              </h3>
              <div className="flex gap-2">
                <button
                  className="p-2 text-[#FB2E86] hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg"
                  onClick={() => handleGroupEdit(group)}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"
                  onClick={() => handleGroupDelete(group.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Label</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">URL</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {group.links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{link.label}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{link.url}</td>
                    <td className="px-4 py-2 flex justify-end gap-2">
                      <button
                        className="p-2 text-[#FB2E86] hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg"
                        onClick={() => handleLinkEdit(group.id, link)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg"
                        onClick={() => handleLinkDelete(link.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Add/Edit Link Form */}
            {showLinkForm === group.id && (
              <form
                className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mt-4"
                onSubmit={(e) => handleLinkSubmit(e, group.id)}
              >
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={linkForm.label}
                    onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                    placeholder="Link label"
                    className="flex-1 px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-[#FB2E86]"
                    required
                  />
                  <input
                    type="text"
                    value={linkForm.url}
                    onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                    placeholder="/url"
                    className="flex-1 px-4 py-2.5 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-[#FB2E86]"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2.5 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]">
                    {editingLink && editingLink.groupId === group.id ? "Update Link" : "Add Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkForm(null);
                      setEditingLink(null);
                      setLinkForm({ label: "", url: "" });
                    }}
                    className="px-6 py-2.5 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-semibold hover:bg-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {/* Add Link Button */}
            {showLinkForm !== group.id && (
              <button
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#FB2E86] text-white rounded-lg font-semibold hover:bg-[#e01968]"
                onClick={() => {
                  setShowLinkForm(group.id);
                  setEditingLink(null);
                  setLinkForm({ label: "", url: "" });
                }}
              >
                <Plus size={18} /> Add Link
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
