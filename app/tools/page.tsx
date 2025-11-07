import { Metadata } from 'next'
import { listArticles } from '@/lib/db'
import { ArticleCard } from '@/components/ui/article-card'
import { Pagination } from '@/components/ui/pagination'

export const metadata: Metadata = {
  title: 'AI Tools Directory - Curated Artificial Intelligence Tools | TechHighlight',
  description: 'Discover the best AI tools and software. Curated directory of artificial intelligence applications, platforms, and tools for every use case.',
  keywords: ['AI tools', 'artificial intelligence software', 'AI platforms', 'machine learning tools', 'AI applications'],
}

interface ToolsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ARTICLES_PER_PAGE = 12

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1

  // Fetch published tool articles with pagination
  const articles = await listArticles({
    status: 'published',
    category: 'tool',
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
          Curated AI Tools
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Discover the most powerful artificial intelligence tools and platforms.
          From development frameworks to productivity applications, find the right tools for your AI journey.
        </p>
      </div>

      {/* Tool Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">Tool Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Development</h3>
            <p className="text-sm text-neutral-600">Frameworks, libraries, and development tools for AI</p>
          </div>

          <div className="card p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Productivity</h3>
            <p className="text-sm text-neutral-600">AI-powered tools to boost your productivity</p>
          </div>

          <div className="card p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Creative</h3>
            <p className="text-sm text-neutral-600">AI tools for design, art, and creative work</p>
          </div>

          <div className="card p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Analytics</h3>
            <p className="text-sm text-neutral-600">Data analysis and business intelligence tools</p>
          </div>
        </div>
      </section>

      {/* Featured Tool Section */}
      {displayArticles.length > 0 && displayArticles[0] && (
        <section className="mb-16">
          <div className="card p-8 md:p-12 bg-gradient-to-r from-primary-50 to-neutral-50">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                  Featured Tool
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
                  Learn More
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

      {/* All Tools */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            All Tools ({displayArticles.length})
          </h2>
        </div>

        {displayArticles.length > 0 ? (
          <>
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayArticles.slice(1).map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  priority={page === 1 && index < 5}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/tools"
              className="mt-12"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No tools available
            </h3>
            <p className="text-neutral-600">
              We're curating the best AI tools. Check back soon for our comprehensive directory!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

