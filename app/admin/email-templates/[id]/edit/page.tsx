"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditEmailTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [templateId, setTemplateId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => {
      setTemplateId(id);
      fetch(`/api/admin/email-templates/${id}`)
        .then(res => res.json())
        .then(data => setTemplate(data));
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const variables = formData.get('variables')?.toString().split(',').map(v => v.trim()) || [];

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          subject: formData.get('subject'),
          htmlContent: formData.get('htmlContent'),
          textContent: formData.get('textContent'),
          variables,
          isActive: formData.get('isActive') === 'on'
        })
      });

      if (response.ok) {
        router.push(`/admin/email-templates/${templateId}`);
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!template) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/admin/email-templates/${templateId}`}
          className="flex items-center gap-2 text-[#FB2E86] hover:text-pink-600"
        >
          <ArrowLeft size={20} />
          Back to Template
        </Link>
      </div>

      <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
        Edit Template
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                Settings
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={template.name}
                  className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Variables
                </label>
                <input
                  type="text"
                  name="variables"
                  defaultValue={template.variables.join(', ')}
                  className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#FB2E86] dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={template.isActive}
                />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                Content
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  defaultValue={template.subject}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">HTML Content</label>
                <textarea
                  name="htmlContent"
                  defaultValue={template.htmlContent}
                  rows={15}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href={`/admin/email-templates/${templateId}`}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#FB2E86] text-white rounded-lg"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}