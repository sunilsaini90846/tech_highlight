import { Metadata } from 'next'
import Link from 'next/link'
import { listTopics } from '@/lib/db'

export const metadata: Metadata = {
  title: 'AI Topics - Explore Artificial Intelligence by Subject | TechHighlight',
  description: 'Explore artificial intelligence topics and subjects. Find articles organized by machine learning, deep learning, ethics, applications, and more.',
  keywords: ['AI topics', 'artificial intelligence subjects', 'machine learning topics', 'AI categories', 'technology topics'],
}

export default async function TopicsPage() {
  const topics = await listTopics({
    orderBy: 'order',
    orderDirection: 'asc'
  })

  // Group topics by featured status
  const featuredTopics = topics.filter(topic => topic.featured)
  const otherTopics = topics.filter(topic => !topic.featured)

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
          Explore by Topic
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Dive deep into specific areas of artificial intelligence. From machine learning fundamentals
          to advanced research topics, find exactly what you're looking for.
        </p>
      </div>

      {/* Featured Topics */}
      {featuredTopics.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Featured Topics</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className="card group hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {topic.name}
                  </h3>
                  <p className="mb-4 text-neutral-600 line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      {topic.articleCount} articles
                    </span>
                    <span className="text-primary-600 group-hover:text-primary-700 font-medium">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Topics */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">
          All Topics ({topics.length})
        </h2>

        {otherTopics.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {otherTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className="card group hover:shadow-md transition-all duration-200 p-6"
              >
                <h3 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {topic.name}
                </h3>
                <p className="mb-3 text-sm text-neutral-600 line-clamp-2">
                  {topic.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">
                    {topic.articleCount} articles
                  </span>
                  <span className="text-primary-600 group-hover:text-primary-700">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No topics available
            </h3>
            <p className="text-neutral-600">
              Topics will be added as we publish more content. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Topic Categories */}
      <section className="mt-16 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Topic Categories
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our topics are organized into broad categories to help you navigate AI's diverse landscape
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Fundamentals
            </h3>
            <p className="text-neutral-600 text-sm">
              Core concepts, algorithms, and mathematical foundations of AI
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Applications
            </h3>
            <p className="text-neutral-600 text-sm">
              Real-world applications and use cases across industries
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Ethics & Society
            </h3>
            <p className="text-neutral-600 text-sm">
              Responsible AI, ethics, bias, and societal impact
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

