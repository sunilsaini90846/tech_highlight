import { Metadata } from 'next'
import Link from 'next/link'
import { listNewsletters } from '@/lib/db'
import { DateBadge } from '@/components/ui/date-badge'

export const metadata: Metadata = {
  title: 'AI Newsletter Archive - Weekly AI Highlights | TechHighlight',
  description: 'Browse our archive of weekly AI newsletters. Stay updated with curated highlights of the latest developments in artificial intelligence.',
  keywords: ['AI newsletter', 'artificial intelligence newsletter', 'weekly AI updates', 'tech newsletter', 'AI highlights'],
}

export default async function NewsletterPage() {
  const newsletters = await listNewsletters(20) // Get last 20 newsletters

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
          AI Newsletter Archive
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600 mb-8">
          Stay updated with our weekly curated highlights of the latest developments
          in artificial intelligence. Each newsletter features the most important news,
          research breakthroughs, and industry updates.
        </p>

        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto bg-primary-50 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-neutral-600 text-sm mb-4">
            Get weekly AI highlights delivered to your inbox.
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

          <div className="mt-4 pt-4 border-t border-primary-200">
            <div className="flex gap-2 mb-2">
              <a
                href="/newsletter.xml"
                className="text-primary-600 hover:text-primary-700 text-sm underline"
                target="_blank"
              >
                RSS Feed
              </a>
              <span className="text-neutral-400">•</span>
              <a
                href="https://techhighlight.com/newsletter/1/amp"
                className="text-primary-600 hover:text-primary-700 text-sm underline"
                target="_blank"
              >
                Printable Version
              </a>
            </div>
            <p className="text-xs text-neutral-600">
              We use analytics to improve our content.{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Archive */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">
          Past Issues ({newsletters.length})
        </h2>

        {newsletters.length > 0 ? (
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <Link
                key={newsletter.id}
                href={`/newsletter/${newsletter.issueNumber}`}
                className="block card group hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        Issue #{newsletter.issueNumber}: {newsletter.title}
                      </h3>
                      <p className="text-neutral-600 mt-1">
                        {newsletter.intro}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <DateBadge
                        date={newsletter.publishedAt || newsletter.createdAt}
                      />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {newsletter.status === 'sent' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      {newsletter.items.length} articles featured
                    </span>
                    <span className="text-primary-600 group-hover:text-primary-700 font-medium">
                      Read Issue →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No newsletters published yet
            </h3>
            <p className="text-neutral-600">
              Our first newsletter will be published soon. Subscribe above to be notified!
            </p>
          </div>
        )}
      </section>

      {/* What to Expect */}
      <section className="mt-16 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What to Expect in Our Newsletters
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Each weekly newsletter brings you the most important developments in AI
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Latest Research
            </h3>
            <p className="text-neutral-600 text-sm">
              Breakthrough papers, new algorithms, and cutting-edge research developments
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H6a2 2 0 01-2-2V6m8 0H6m2 4v.01M6 12v.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Industry News
            </h3>
            <p className="text-neutral-600 text-sm">
              Company announcements, funding rounds, and major industry developments
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Tool Highlights
            </h3>
            <p className="text-neutral-600 text-sm">
              New AI tools, platforms, and applications worth knowing about
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

