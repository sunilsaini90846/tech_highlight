import { Metadata } from 'next'
import Link from 'next/link'
import { listArticles } from '@/lib/db'
import { ArticleStatus } from '@/lib/types'
import { DateBadge } from '@/components/ui/date-badge'

export const metadata: Metadata = {
  title: 'Articles Management - TechHighlight Admin',
  description: 'Manage articles in TechHighlight admin panel',
}

interface ArticlesPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const status = typeof searchParams.status === 'string' ? searchParams.status as ArticleStatus : undefined
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const limit = 20

  // Fetch articles with optional status filter
  const articles = await listArticles({
    status,
    limit,
    orderBy: 'updatedAt',
    orderDirection: 'desc',
  })

  // Get counts for each status
  const [allArticles, publishedArticles, draftArticles, scheduledArticles] = await Promise.all([
    listArticles({ limit: 1000 }),
    listArticles({ status: 'published', limit: 1000 }),
    listArticles({ status: 'draft', limit: 1000 }),
    listArticles({ status: 'scheduled', limit: 1000 }),
  ])

  const statusCounts = {
    all: allArticles.length,
    published: publishedArticles.length,
    draft: draftArticles.length,
    scheduled: scheduledArticles.length,
  }

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Articles</h1>
          <p className="mt-2 text-neutral-600">
            Manage your articles and content
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          New Article
        </Link>
      </div>

      {/* Status Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/articles"
            className={`btn ${!status ? 'btn-primary' : 'btn-secondary'}`}
          >
            All ({statusCounts.all})
          </Link>
          <Link
            href="/admin/articles?status=published"
            className={`btn ${status === 'published' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Published ({statusCounts.published})
          </Link>
          <Link
            href="/admin/articles?status=draft"
            className={`btn ${status === 'draft' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Drafts ({statusCounts.draft})
          </Link>
          <Link
            href="/admin/articles?status=scheduled"
            className={`btn ${status === 'scheduled' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Scheduled ({statusCounts.scheduled})
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      {articles.length > 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {article.coverImage && (
                        <img
                          src={article.coverImage}
                          alt=""
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="text-sm font-medium text-neutral-900 hover:text-primary-600"
                        >
                          {article.title}
                        </Link>
                        <div className="text-sm text-neutral-500 truncate max-w-xs">
                          {article.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'published' ? 'bg-green-100 text-green-800' :
                      article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <DateBadge date={article.updatedAt} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {article.status === 'draft' && (
                        <Link
                          href={`/preview/${article.slug}`}
                          target="_blank"
                          className="text-neutral-600 hover:text-neutral-900"
                          title="Preview draft"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit article"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            {status ? `No ${status} articles found` : 'No articles found'}
          </h3>
          <p className="mt-2 text-neutral-600">
            Get started by creating your first article.
          </p>
          <div className="mt-6">
            <Link href="/admin/articles/new" className="btn btn-primary">
              Create Article
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
