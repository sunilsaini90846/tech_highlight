import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsletterByIssueNumber, getArticleById } from '@/lib/db'
import { DateBadge } from '@/components/ui/date-badge'
import { Byline } from '@/components/ui/byline'
import { TagPills } from '@/components/ui/tag-pills'

interface NewsletterIssuePageProps {
  params: { issueNumber: string }
}

export async function generateMetadata({ params }: NewsletterIssuePageProps): Promise<Metadata> {
  const issueNumber = parseInt(params.issueNumber)
  const newsletter = await getNewsletterByIssueNumber(issueNumber)

  if (!newsletter) {
    return {
      title: 'Newsletter Issue Not Found | TechHighlight',
    }
  }

  return {
    title: `Newsletter #${newsletter.issueNumber}: ${newsletter.title} | TechHighlight`,
    description: newsletter.intro,
    keywords: ['AI newsletter', 'newsletter', `issue ${newsletter.issueNumber}`, newsletter.title],
  }
}

export default async function NewsletterIssuePage({ params }: NewsletterIssuePageProps) {
  const issueNumber = parseInt(params.issueNumber)

  if (isNaN(issueNumber)) {
    notFound()
  }

  const newsletter = await getNewsletterByIssueNumber(issueNumber)

  if (!newsletter) {
    notFound()
  }

  // Fetch all articles referenced in the newsletter
  const articlePromises = newsletter.items.map(item => getArticleById(item.articleRef))
  const articles = await Promise.all(articlePromises)

  // Filter out null articles (in case some were deleted)
  const validArticles = articles.filter((article): article is NonNullable<typeof article> => article !== null)

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/newsletter"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Newsletter Archive
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-600 text-sm">Issue #{issueNumber}</span>
        </div>

        <div className="max-w-4xl">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Issue #{newsletter.issueNumber}
            </h1>
            <div className="flex flex-col items-end gap-2 ml-4">
              <DateBadge
                date={newsletter.publishedAt || newsletter.createdAt}
              />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                newsletter.status === 'sent'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {newsletter.status === 'sent' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {newsletter.title}
          </h2>

          <p className="text-lg text-neutral-600 mb-6">
            {newsletter.intro}
          </p>

          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>{newsletter.items.length} articles featured</span>
            <span>•</span>
            <span>Published {newsletter.publishedAt ? new Date(newsletter.publishedAt).toLocaleDateString() : 'Draft'}</span>
            {newsletter.status === 'sent' && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`/newsletter/${issueNumber}/amp`}
                    className="text-primary-600 hover:text-primary-700 underline"
                    target="_blank"
                  >
                    Printable
                  </a>
                  <span className="text-neutral-400">•</span>
                  <a
                    href="/newsletter.xml"
                    className="text-primary-600 hover:text-primary-700 underline"
                    target="_blank"
                  >
                    RSS
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">
          Featured Articles
        </h2>

        {validArticles.length > 0 ? (
          <div className="space-y-8">
            {newsletter.items.map((item, index) => {
              const article = validArticles.find(a => a.id === item.articleRef)

              if (!article) {
                return null // Article was deleted or not found
              }

              return (
                <article key={article.id} className="card group">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Article Number */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link
                              href={`/articles/${article.slug}`}
                              className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors"
                            >
                              {article.title}
                            </Link>

                            {item.customNote && (
                              <p className="text-primary-600 font-medium text-sm mt-1">
                                {item.customNote}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-neutral-600 mb-4 line-clamp-2">
                          {article.summary}
                        </p>

                        {/* Article Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {article.category}
                            </span>
                            <DateBadge date={article.publishedAt || article.createdAt} />
                          </div>

                          {article.tags.length > 0 && (
                            <TagPills tags={article.tags.slice(0, 3)} />
                          )}

                          <div className="flex items-center gap-2 text-neutral-500">
                            <Byline authorRef={article.authorRef} showAvatar={false} />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="btn btn-secondary text-sm"
                          >
                            Read Article →
                          </Link>
                        </div>
                      </div>

                      {/* Article Image (Optional) */}
                      {article.coverImage && (
                        <div className="flex-shrink-0 hidden md:block">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No articles in this issue
            </h3>
            <p className="text-neutral-600">
              This newsletter issue appears to be empty or articles may have been removed.
            </p>
          </div>
        )}
      </section>

      {/* Newsletter Footer */}
      <section className="mt-16 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Get the latest AI highlights delivered to your inbox every week.
            Join thousands of readers who stay informed about artificial intelligence.
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

          <div className="mt-6 flex justify-center gap-4">
            <Link href="/newsletter" className="btn btn-secondary">
              View All Issues
            </Link>
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation between issues */}
      {newsletter && (
        <nav className="mt-12 flex justify-between items-center pt-8 border-t border-neutral-200">
          <div>
            {issueNumber > 1 && (
              <Link
                href={`/newsletter/${issueNumber - 1}`}
                className="btn btn-secondary"
              >
                ← Previous Issue
              </Link>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Issue {issueNumber}
            </p>
          </div>

          <div>
            {/* In a real app, you'd check if next issue exists */}
            <Link
              href={`/newsletter/${issueNumber + 1}`}
              className="btn btn-secondary"
            >
              Next Issue →
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
