import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Edit, Eye } from "lucide-react";

export default async function EmailTemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const template = await prisma.emailTemplate.findUnique({
    where: { id },
    include: {
      _count: { select: { emailLogs: true } }
    }
  });

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/email-templates"
          className="flex items-center gap-2 text-[#FB2E86] hover:text-pink-600"
        >
          <ArrowLeft size={20} />
          Back to Templates
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FB2E86]/10 rounded-lg">
            <Mail className="text-[#FB2E86]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
              {template.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {template.type.replace('_', ' ').toLowerCase()}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/email-templates/${template.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-[#FB2E86] text-white rounded-lg hover:bg-[#E91E63]"
        >
          <Edit size={16} />
          Edit Template
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
              Template Info
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Status</label>
                <p className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  template.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Type</label>
                <p className="mt-1 text-[#151875] dark:text-white">{template.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Usage Count</label>
                <p className="mt-1 text-[#151875] dark:text-white">{template._count.emailLogs} emails sent</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Created</label>
                <p className="mt-1 text-[#151875] dark:text-white">
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Last Updated</label>
                <p className="mt-1 text-[#151875] dark:text-white">
                  {new Date(template.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
              Variables
            </h3>
            <div className="space-y-2">
              {template.variables.map((variable) => (
                <div key={variable} className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                    {`{{${variable}}}`}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
              Subject Line
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <code className="text-sm">{template.subject}</code>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white">
                Email Preview
              </h3>
            </div>
            <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
              <iframe 
                srcDoc={template.htmlContent}
                className="w-full h-96 border-0"
                title="Email Preview"
              />
            </div>
          </div>

          {template.textContent && (
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6">
              <h3 className="font-josefin font-bold text-lg text-[#151875] dark:text-white mb-4">
                Text Version
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{template.textContent}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}