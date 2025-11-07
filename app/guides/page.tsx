import { Metadata } from 'next'
import { listArticles } from '@/lib/db'
import { ArticleCard } from '@/components/ui/article-card'
import { Pagination } from '@/components/ui/pagination'

export const metadata: Metadata = {
  title: 'AI Guides - Learn Artificial Intelligence | TechHighlight',
  description: 'Comprehensive guides to help you understand artificial intelligence. From beginner tutorials to advanced concepts, learn AI at your own pace.',
  keywords: ['AI guides', 'artificial intelligence tutorials', 'machine learning guides', 'AI education', 'AI learning'],
}

interface GuidesPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ARTICLES_PER_PAGE = 12

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1

  // Fetch published guide articles with pagination
  const articles = await listArticles({
    status: 'published',
    category: 'guide',
    limit: ARTICLES_PER_PAGE + 1, // Fetch one extra to check if there's a next page
    orderBy: 'publishedAt',
    orderDirection: 'desc',
  })

  const hasNextPage = articles.length > ARTICLES_PER_PAGE
  const displayArticles = articles.slice(0, ARTICLES_PER_PAGE)

  // Calculate total pages (simplified - in production you'd have a count query)
  const totalPages = hasNextPage ? page + 1 : page

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
          Expert AI Guides
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Learn artificial intelligence from comprehensive guides written by experts.
          From beginner concepts to advanced techniques, master AI at your own pace.
        </p>
      </div>

      {/* Featured Guide Section */}
      {displayArticles.length > 0 && displayArticles[0] && (
        <section className="mb-16">
          <div className="card p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                  Featured Guide
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                  {displayArticles[0].title}
                </h2>
                <p className="text-lg text-neutral-600 mb-6">
                  {displayArticles[0].summary}
                </p>
                <a
                  href={`/articles/${displayArticles[0].slug}`}
                  className="btn btn-primary"
                >
                  Start Reading
                </a>
              </div>
              {displayArticles[0].coverImage && (
                <div className="md:text-right">
                  <img
                    src={displayArticles[0].coverImage}
                    alt={displayArticles[0].title}
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* All Guides */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">
          All Guides ({displayArticles.length})
        </h2>

        {displayArticles.length > 0 ? (
          <>
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayArticles.slice(1).map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  priority={page === 1 && index < 5} // Prioritize first 5 on first page
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/guides"
              className="mt-12"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No guides available
            </h3>
            <p className="text-neutral-600">
              We're working on comprehensive AI guides. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Learning Path Section */}
      <section className="mt-16 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Your AI Learning Journey
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Follow our structured learning path to go from beginner to AI expert
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Getting Started
            </h3>
            <p className="text-neutral-600">
              Learn the basics of artificial intelligence and machine learning concepts.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Building Knowledge
            </h3>
            <p className="text-neutral-600">
              Dive deeper into algorithms, neural networks, and practical applications.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Advanced Topics
            </h3>
            <p className="text-neutral-600">
              Explore cutting-edge research, ethics, and the future of AI.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

