import { prisma } from "@/lib/db";
import { seedEmailTemplates } from "@/app/actions/email";
import Link from "next/link";
import { Mail, Plus, Eye, Edit } from "lucide-react";

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({
    include: {
      _count: { select: { emailLogs: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Seed templates if none exist
  if (templates.length === 0) {
    await seedEmailTemplates();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-josefin font-bold text-[#151875] dark:text-white">
            Email Templates
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage email templates for automated notifications
          </p>
        </div>
        <Link
          href="/admin/email-templates/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#FB2E86] text-white rounded-lg hover:bg-[#E91E63]"
        >
          <Plus size={20} />
          New Template
        </Link>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FB2E86]/10 rounded-lg">
                  <Mail className="text-[#FB2E86]" size={20} />
                </div>
                <div>
                  <h3 className="font-josefin font-bold text-[#151875] dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {template.type.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                <strong>Subject:</strong> {template.subject}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Variables: {template.variables.join(', ')}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Used {template._count.emailLogs} times
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/admin/email-templates/${template.id}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye size={14} />
                  View
                </Link>
                <Link
                  href={`/admin/email-templates/${template.id}/edit`}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                >
                  <Edit size={14} />
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email Logs Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800">
        <div className="p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-josefin font-bold text-[#151875] dark:text-white">
            Recent Email Activity
          </h2>
        </div>
        <div className="p-6">
          <EmailLogsSummary />
        </div>
      </div>
    </div>
  );
}

async function EmailLogsSummary() {
  const recentLogs = await prisma.emailLog.findMany({
    include: {
      template: { select: { name: true } },
      order: { select: { orderNumber: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const stats = await prisma.emailLog.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.status} className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-2xl font-bold text-[#151875] dark:text-white">
              {stat._count.status}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
              {stat.status.toLowerCase()}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Logs */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-400 uppercase border-b dark:border-slate-700">
              <th className="py-2">Template</th>
              <th className="py-2">Recipient</th>
              <th className="py-2">Status</th>
              <th className="py-2">Sent</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {recentLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="py-3">
                  <div>
                    <p className="font-medium text-[#151875] dark:text-white">
                      {log.template?.name || 'Custom'}
                    </p>
                    {log.order && (
                      <p className="text-xs text-slate-500">
                        Order #{log.order.orderNumber}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">
                  {log.recipient}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.status === 'SENT' 
                      ? 'bg-green-100 text-green-800'
                      : log.status === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-slate-500 dark:text-slate-400">
                  {log.sentAt ? new Date(log.sentAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}