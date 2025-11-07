import { Metadata } from 'next'
import Link from 'next/link'
import { listTopics } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Topics Management - TechHighlight Admin',
  description: 'Manage topics in TechHighlight admin panel',
}

export default async function TopicsPage() {
  const topics = await listTopics()

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Topics</h1>
          <p className="mt-2 text-neutral-600">
            Manage article topics and categories
          </p>
        </div>
        <Link href="/admin/topics/new" className="btn btn-primary">
          New Topic
        </Link>
      </div>

      {/* Topics Grid */}
      {topics.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    {topic.slug}
                  </p>
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
                {topic.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  {topic.articleCount} articles
                </span>
                <Link
                  href={`/admin/topics/${topic.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            No topics found
          </h3>
          <p className="mt-2 text-neutral-600">
            Get started by creating your first topic.
          </p>
          <div className="mt-6">
            <Link href="/admin/topics/new" className="btn btn-primary">
              Create Topic
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
