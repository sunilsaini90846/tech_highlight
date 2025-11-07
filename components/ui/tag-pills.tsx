import Link from 'next/link'

interface TagPillsProps {
  tags: string[]
  maxVisible?: number
  className?: string
}

export function TagPills({ tags, maxVisible = 3, className = '' }: TagPillsProps) {
  const visibleTags = tags.slice(0, maxVisible)
  const remainingCount = tags.length - maxVisible

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleTags.map((tag) => (
        <Link
          key={tag}
          href={`/search?q=${encodeURIComponent(tag)}`}
          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          #{tag}
        </Link>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-500">
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

