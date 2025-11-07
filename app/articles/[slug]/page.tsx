import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, listArticles, getTopicsByIds } from '@/lib/db'
import { ArticleCard } from '@/components/ui/article-card'
import { Byline } from '@/components/ui/byline'
import { DateBadge } from '@/components/ui/date-badge'
import { TagPills } from '@/components/ui/tag-pills'
import { ArticleStructuredData } from '@/components/seo/structured-data'

// Mock MDX components - in a real app you'd use next-mdx-remote
const MDXContent = ({ content }: { content: string }) => {
  // This is a simplified version - in production you'd use proper MDX rendering
  return (
    <div className="prose prose-neutral max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
    </div>
  )
}

interface ArticlePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found | TechHighlight',
    }
  }

  return {
    title: article.seo.title,
    description: article.seo.description,
    keywords: article.tags,
    authors: [{ name: 'TechHighlight' }],
    alternates: {
      canonical: `https://techhighlight.com/articles/${article.slug}`,
    },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: ['TechHighlight'],
      tags: article.tags,
      siteName: 'TechHighlight',
      images: article.coverImage ? [{
        url: article.coverImage,
        width: 1200,
        height: 630,
        alt: article.title,
      }] : [{
        url: '/og/default.jpg',
        width: 1200,
        height: 630,
        alt: 'TechHighlight - Curated AI Highlights',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo.title,
      description: article.seo.description,
      images: article.coverImage ? [article.coverImage] : ['/og/default.jpg'],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  // Get article topics
  const topics = article.topics.length > 0 ? await getTopicsByIds(article.topics) : []

  // Get related articles (same category, excluding current article)
  const relatedArticles = await listArticles({
    status: 'published',
    category: article.category,
    limit: 4,
  }).then(articles => articles.filter(a => a.id !== article.id).slice(0, 3))

  // Generate table of contents from headings (simplified)
  const headings = extractHeadings(article.body)

  return (
    <>
      <ArticleStructuredData article={article} topics={topics} />
      <div className="container-custom py-12">
        {/* Article Header */}
      <header className="max-w-4xl mx-auto mb-12">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href={`/${article.category === 'news' ? 'news' : article.category === 'guide' ? 'guides' : 'tools'}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← {article.category === 'news' ? 'News' : article.category === 'guide' ? 'Guides' : 'Tools'}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 md:text-5xl leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-neutral-200">
          <div className="flex items-center gap-4">
            <Byline authorRef={article.authorRef} showAvatar={true} />
            <DateBadge date={article.publishedAt || article.createdAt} />
          </div>

          <div className="flex items-center gap-3">
            <ShareButtons title={article.title} url={`/articles/${article.slug}`} />
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mt-8 mb-8">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-8">
            <TagPills tags={article.tags} />
          </div>
        )}
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop */}
          {headings.length > 0 && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {headings.map((heading, index) => (
                    <a
                      key={index}
                      href={`#${heading.id}`}
                      className="block text-sm text-neutral-600 hover:text-primary-600 transition-colors py-1"
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <article className={`${headings.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <MDXContent content={article.body} />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-neutral-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>Published {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}</span>
                  {article.updatedAt && article.updatedAt > article.createdAt && (
                    <>
                      <span>•</span>
                      <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <ShareButtons title={article.title} url={`/articles/${article.slug}`} />
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <Byline authorRef={article.authorRef} showAvatar={true} />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">
                      Author of AI content and technology insights. Stay updated with the latest developments
                      in artificial intelligence and machine learning.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Related Articles
            </h2>
            <p className="text-neutral-600">
              More {article.category} articles you might be interested in
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                article={relatedArticle}
                priority={false}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/${article.category === 'news' ? 'news' : article.category === 'guide' ? 'guides' : 'tools'}`}
              className="btn btn-primary"
            >
              View All {article.category === 'news' ? 'News' : article.category === 'guide' ? 'Guides' : 'Tools'}
            </Link>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="mt-16 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          Stay Updated
        </h2>
        <p className="text-neutral-600 mb-6">
          Get weekly AI highlights delivered to your inbox. Never miss important developments in artificial intelligence.
        </p>

        <div className="max-w-md mx-auto bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-neutral-600 text-sm mb-4">
            Weekly curated highlights of AI developments.
          </p>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 input"
              required
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

// Helper function to extract headings from content (simplified)
function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Array<{ id: string; text: string; level: number }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

    headings.push({ id, text, level })
  }

  return headings
}

// Share buttons component
function ShareButtons({ title, url }: { title: string; url: string }) {
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(fullUrl)

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'Copy Link',
      href: '#',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        navigator.clipboard.writeText(fullUrl)
        // You could show a toast here
      },
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-600 mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={link.onClick}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
    </div>
    </>
  )
}
