import { Metadata } from 'next'
import Link from 'next/link'
import { listArticles, listTopics, listNews } from '@/lib/db'
import { ArticleCard } from '@/components/ui/article-card'
import { DateBadge } from '@/components/ui/date-badge'

export const metadata: Metadata = {
  title: 'TechHighlight - Curated AI Highlights',
  description: 'Stay informed with curated highlights about AI for a general audience. Discover the latest news, comprehensive guides, and powerful tools.',
  keywords: ['AI', 'technology', 'news', 'guides', 'tools', 'artificial intelligence'],
  openGraph: {
    title: 'TechHighlight - Curated AI Highlights',
    description: 'Stay informed with curated highlights about AI for a general audience.',
    type: 'website',
  },
}

export default async function Home() {
  // Fetch data with ISR (revalidate every 5 minutes)
  const [latestArticles, featuredTopics, weeklyHighlights] = await Promise.all([
    listArticles({ status: 'published', limit: 6 }),
    listTopics({ featured: true, limit: 6 }),
    listNews({ limit: 3 }),
  ])

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 py-20">
        <div className="container-custom text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            Curated AI Highlights
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-neutral-600">
            Stay informed with the latest AI developments. From breakthrough news to comprehensive guides,
            discover everything you need to understand artificial intelligence.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/news" className="btn btn-primary">
              Explore News
            </Link>
            <Link href="/guides" className="btn btn-secondary">
              Browse Guides
            </Link>
          </div>
        </div>
      </section>

      {/* This Week's Highlights */}
      {weeklyHighlights.length > 0 && (
        <section className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-neutral-900">This Week's Highlights</h2>
            <Link
              href="/newsletter"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {weeklyHighlights.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                priority={index < 2} // Prioritize first 2 images
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="container-custom">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-neutral-900">Latest Articles</h2>
          <Link
            href="/news"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              priority={index < 3} // Prioritize first 3 images
            />
          ))}
        </div>
      </section>

      {/* Featured Topics */}
      {featuredTopics.length > 0 && (
        <section className="bg-neutral-50 py-16">
          <div className="container-custom">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-neutral-900">Explore by Topic</h2>
              <p className="mt-2 text-neutral-600">
                Dive deep into specific areas of AI technology
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className="card group hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold text-neutral-900 group-hover:text-primary-600">
                      {topic.name}
                    </h3>
                    <p className="mb-3 text-neutral-600 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">
                        {topic.articleCount} articles
                      </span>
                      <span className="text-primary-600 group-hover:text-primary-700">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/topics" className="btn btn-secondary">
                View All Topics
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Overview */}
      <section className="container-custom">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="card text-center">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Latest News</h3>
            <p className="mb-4 text-neutral-600">
              Stay up to date with the latest developments in AI technology and industry news.
            </p>
            <Link href="/news" className="btn btn-primary">
              Read News
            </Link>
          </div>

          <div className="card text-center">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Expert Guides</h3>
            <p className="mb-4 text-neutral-600">
              Learn from comprehensive guides written by experts for everyone.
            </p>
            <Link href="/guides" className="btn btn-primary">
              Browse Guides
            </Link>
          </div>

          <div className="card text-center">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Curated Tools</h3>
            <p className="mb-4 text-neutral-600">
              Discover the best AI tools to enhance your workflow and productivity.
            </p>
            <Link href="/tools" className="btn btn-primary">
              Explore Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

