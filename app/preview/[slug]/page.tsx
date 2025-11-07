import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/db'
import Link from 'next/link'

interface PreviewPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug, false) // Don't check published status

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} (Preview)`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const article = await getArticleBySlug(params.slug, false) // Don't check published status

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Preview Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-3">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                Preview Mode - This article is not yet published
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/articles/${article.id}`}
                className="text-sm text-yellow-800 hover:text-yellow-900 underline"
              >
                Edit Article
              </Link>
              <Link
                href="/"
                className="text-sm text-yellow-800 hover:text-yellow-900 underline"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container-custom py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {article.status === 'draft' ? 'Draft' : 'Scheduled'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {article.title}
          </h1>

          <p className="text-xl text-neutral-600 mb-6">
            {article.summary}
          </p>

          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <span>By Author</span>
            <span>•</span>
            <span>{article.updatedAt.toLocaleDateString()}</span>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mb-8">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: article.body.replace(/\n/g, '<br>') // Basic line break conversion
            }}
          />
        </div>

        {/* Topics */}
        {article.topics && article.topics.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.topics.map((topic) => (
                <span
                  key={topic.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800"
                >
                  {topic.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
