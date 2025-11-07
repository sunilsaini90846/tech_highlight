import { Metadata } from 'next'
import { listArticles, listTopics, listSources } from '@/lib/db'
import { ArticleStatus } from '@/lib/types'
import { ArticleCard } from '@/components/ui/article-card'
import { DateBadge } from '@/components/ui/date-badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Dashboard - TechHighlight',
  description: 'Admin dashboard for managing TechHighlight content',
}

export default async function AdminDashboard() {
  // Get statistics
  const [allArticles, topics, sources] = await Promise.all([
    listArticles({ limit: 1000 }), // Get all for stats
    listTopics(),
    listSources(),
  ])

  // Calculate statistics
  const stats = {
    totalArticles: allArticles.length,
    publishedArticles: allArticles.filter(a => a.status === 'published').length,
    draftArticles: allArticles.filter(a => a.status === 'draft').length,
    scheduledArticles: allArticles.filter(a => a.status === 'scheduled').length,
    totalTopics: topics.length,
    activeSources: sources.filter(s => s.active).length,
  }

  // Get recent edits (last 5 modified articles)
  const recentEdits = allArticles
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="mt-2 text-neutral-600">
          Manage your content and monitor site statistics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-primary-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Articles</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.totalArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Published</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.publishedArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-yellow-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Drafts</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.draftArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Scheduled</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.scheduledArticles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-12">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles/new" className="btn btn-primary">
            New Article
          </Link>
          <Link href="/admin/topics/new" className="btn btn-secondary">
            New Topic
          </Link>
          <Link href="/admin/sources/new" className="btn btn-secondary">
            Add Source
          </Link>
          <Link href="/admin/newsletter/new" className="btn btn-secondary">
            Create Newsletter
          </Link>
        </div>
      </div>

      {/* Recent Edits */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Articles */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Edits</h2>
            <Link href="/admin/articles" className="text-sm text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>

          {recentEdits.length > 0 ? (
            <div className="space-y-4">
              {recentEdits.map((article) => (
                <div key={article.id} className="flex items-start space-x-3 py-2">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-sm font-medium text-neutral-900 hover:text-primary-600 truncate block"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {article.status}
                      </span>
                      <DateBadge date={article.updatedAt} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No recent edits</p>
          )}
        </div>

        {/* Content Overview */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Content Overview</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Topics</span>
              <span className="text-sm font-medium text-neutral-900">{stats.totalTopics}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Active Sources</span>
              <span className="text-sm font-medium text-neutral-900">{stats.activeSources}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">News Articles</span>
              <span className="text-sm font-medium text-neutral-900">
                {allArticles.filter(a => a.category === 'news').length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Guides</span>
              <span className="text-sm font-medium text-neutral-900">
                {allArticles.filter(a => a.category === 'guide').length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Tools</span>
              <span className="text-sm font-medium text-neutral-900">
                {allArticles.filter(a => a.category === 'tool').length}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200">
            <Link href="/admin/articles" className="btn btn-primary w-full">
              Manage Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
