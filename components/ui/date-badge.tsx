import { format } from 'date-fns'

interface DateBadgeProps {
  date: Date
  className?: string
}

export function DateBadge({ date, className = '' }: DateBadgeProps) {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  let displayText: string
  let badgeColor: string

  if (diffInDays === 0) {
    displayText = 'Today'
    badgeColor = 'bg-green-100 text-green-800'
  } else if (diffInDays === 1) {
    displayText = 'Yesterday'
    badgeColor = 'bg-blue-100 text-blue-800'
  } else if (diffInDays < 7) {
    displayText = `${diffInDays}d ago`
    badgeColor = 'bg-neutral-100 text-neutral-700'
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    displayText = `${weeks}w ago`
    badgeColor = 'bg-neutral-100 text-neutral-700'
  } else if (diffInDays < 365) {
    displayText = format(date, 'MMM d')
    badgeColor = 'bg-neutral-100 text-neutral-700'
  } else {
    displayText = format(date, 'MMM d, yyyy')
    badgeColor = 'bg-neutral-100 text-neutral-700'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeColor} ${className}`}>
      {displayText}
    </span>
  )
}

