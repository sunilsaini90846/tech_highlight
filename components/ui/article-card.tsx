import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { Byline } from './byline'
import { DateBadge } from './date-badge'
import { TagPills } from './tag-pills'

interface ArticleCardProps {
  article: Article
  priority?: boolean // For Next.js Image optimization
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="card group">
      {/* Cover Image */}
      {article.coverImage && (
        <Link href={`/articles/${article.slug}`} className="block mb-4 overflow-hidden rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            width={400}
            height={240}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        </Link>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {article.category}
          </span>
          <DateBadge date={article.publishedAt || article.createdAt} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold leading-tight">
          <Link
            href={`/articles/${article.slug}`}
            className="text-neutral-900 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
          >
            {article.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-neutral-600 line-clamp-3">
          {article.summary}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <TagPills tags={article.tags.slice(0, 3)} />
        )}

        {/* Author and Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <Byline authorRef={article.authorRef} />
          <div className="text-sm text-neutral-500">
            {article.topics.length > 0 && (
              <span>{article.topics.length} topic{article.topics.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

