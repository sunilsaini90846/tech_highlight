import { Metadata } from 'next'
import { listArticles } from '@/lib/db'
import { ArticleCard } from '@/components/ui/article-card'
import { Pagination } from '@/components/ui/pagination'

export const metadata: Metadata = {
  title: 'AI News - Latest Developments | TechHighlight',
  description: 'Stay up to date with the latest AI news and developments. Curated articles on artificial intelligence breakthroughs and industry updates.',
  keywords: ['AI news', 'artificial intelligence', 'technology news', 'AI developments', 'machine learning news'],
}

interface NewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ARTICLES_PER_PAGE = 12

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const offset = (page - 1) * ARTICLES_PER_PAGE

  // Fetch published news articles with pagination
  const articles = await listArticles({
    status: 'published',
    category: 'news',
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
          Latest AI News
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Stay up to date with the latest developments in artificial intelligence.
          From breakthrough research to industry announcements, we've got you covered.
        </p>
      </div>

      {/* Articles Grid */}
      {displayArticles.length > 0 ? (
        <>
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                priority={page === 1 && index < 6} // Prioritize first 6 on first page
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/news"
            className="mt-12"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No news articles found
          </h3>
          <p className="text-neutral-600">
            Check back later for the latest AI developments and news.
          </p>
        </div>
      )}
    </div>
  )
}

