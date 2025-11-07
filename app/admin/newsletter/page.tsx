import { Metadata } from 'next'
import Link from 'next/link'
import { listNewsletters } from '@/lib/db'
import { DateBadge } from '@/components/ui/date-badge'

export const metadata: Metadata = {
  title: 'Newsletter Management - TechHighlight Admin',
  description: 'Manage newsletters in TechHighlight admin panel',
}

export default async function NewsletterPage() {
  const newsletters = await listNewsletters()

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Newsletter</h1>
          <p className="mt-2 text-neutral-600">
            Manage newsletter issues and content
          </p>
        </div>
        <Link href="/admin/newsletter/new" className="btn btn-primary">
          New Issue
        </Link>
      </div>

      {/* Newsletter List */}
      {newsletters.length > 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {newsletters.map((newsletter) => (
                <tr key={newsletter.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    #{newsletter.issueNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        {newsletter.title}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {newsletter.summary.slice(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      newsletter.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {newsletter.status === 'sent' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {newsletter.publishedAt ? (
                      <DateBadge date={newsletter.publishedAt} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/newsletter/${newsletter.issueNumber}`}
                        target="_blank"
                        className="text-neutral-600 hover:text-neutral-900"
                        title="Preview"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {newsletter.status === 'sent' && (
                        <a
                          href={`/newsletter/${newsletter.issueNumber}/amp`}
                          target="_blank"
                          className="text-neutral-600 hover:text-neutral-900"
                          title="AMP Version"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      )}
                      <Link
                        href={`/admin/newsletter/${newsletter.id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            No newsletter issues found
          </h3>
          <p className="mt-2 text-neutral-600">
            Get started by creating your first newsletter issue.
          </p>
          <div className="mt-6">
            <Link href="/admin/newsletter/new" className="btn btn-primary">
              Create Issue
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
