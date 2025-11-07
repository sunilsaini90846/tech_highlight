import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicBySlug, listArticles } from '@/lib/db'
import { ArticleCard } from '@/components/ui/article-card'
import { Pagination } from '@/components/ui/pagination'

interface TopicPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const ARTICLES_PER_PAGE = 12

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = await getTopicBySlug(params.slug)

  if (!topic) {
    return {
      title: 'Topic Not Found | TechHighlight',
    }
  }

  return {
    title: `${topic.name} - AI Articles | TechHighlight`,
    description: `${topic.description} Explore articles about ${topic.name.toLowerCase()} in artificial intelligence.`,
    keywords: [`${topic.name}`, 'AI', 'artificial intelligence', 'technology', 'articles'],
  }
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const topic = await getTopicBySlug(params.slug)

  if (!topic) {
    notFound()
  }

  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1

  // Fetch articles for this topic
  const articles = await listArticles({
    status: 'published',
    topic: topic.id, // topic ID
    limit: ARTICLES_PER_PAGE + 1, // Fetch one extra to check if there's a next page
    orderBy: 'publishedAt',
    orderDirection: 'desc',
  })

  const hasNextPage = articles.length > ARTICLES_PER_PAGE
  const displayArticles = articles.slice(0, ARTICLES_PER_PAGE)

  // Calculate total pages (simplified)
  const totalPages = hasNextPage ? page + 1 : page

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/topics"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← All Topics
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-600 text-sm">{topic.name}</span>
        </div>

        <div className="max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
            {topic.name}
          </h1>
          <p className="text-lg text-neutral-600 mb-6">
            {topic.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {displayArticles.length} articles
              </span>
            </div>
            {topic.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured Topic
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      {displayArticles.length > 0 ? (
        <>
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                priority={page === 1 && index < 6}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/topics/${topic.slug}`}
            className="mt-12"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No articles in this topic yet
          </h3>
          <p className="text-neutral-600 mb-6">
            We're working on content for "{topic.name}". Check back soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/news" className="btn btn-primary">
              Browse Latest News
            </Link>
            <Link href="/topics" className="btn btn-secondary">
              Explore Other Topics
            </Link>
          </div>
        </div>
      )}

      {/* Related Topics */}
      <section className="mt-16 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Related Topics
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore other areas of artificial intelligence that might interest you
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* These would be dynamically generated based on related topics */}
          <Link
            href="/topics/machine-learning"
            className="card group hover:shadow-md transition-all duration-200 p-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 mb-2">
              Machine Learning
            </h3>
            <p className="text-sm text-neutral-600">
              Algorithms and techniques for learning from data
            </p>
          </Link>

          <Link
            href="/topics/deep-learning"
            className="card group hover:shadow-md transition-all duration-200 p-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 mb-2">
              Deep Learning
            </h3>
            <p className="text-sm text-neutral-600">
              Neural networks and advanced AI architectures
            </p>
          </Link>

          <Link
            href="/topics/natural-language-processing"
            className="card group hover:shadow-md transition-all duration-200 p-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 mb-2">
              NLP
            </h3>
            <p className="text-sm text-neutral-600">
              Language understanding and generation
            </p>
          </Link>

          <Link
            href="/topics/computer-vision"
            className="card group hover:shadow-md transition-all duration-200 p-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 mb-2">
              Computer Vision
            </h3>
            <p className="text-sm text-neutral-600">
              Image recognition and visual AI
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
