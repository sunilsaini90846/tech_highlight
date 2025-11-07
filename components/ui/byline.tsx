'use client'

import { useEffect, useState } from 'react'
import { getUserById } from '@/lib/db'
import { User } from '@/lib/types'

interface BylineProps {
  authorRef: string
  showAvatar?: boolean
  className?: string
}

export function Byline({ authorRef, showAvatar = false, className = '' }: BylineProps) {
  const [author, setAuthor] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAuthor() {
      try {
        const userData = await getUserById(authorRef)
        setAuthor(userData)
      } catch (error) {
        console.error('Failed to load author:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAuthor()
  }, [authorRef])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showAvatar && (
          <div className="h-6 w-6 rounded-full bg-neutral-200 animate-pulse" />
        )}
        <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!author) {
    return (
      <span className={`text-sm text-neutral-500 ${className}`}>
        Unknown Author
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && (
        <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium">
          {author.displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm text-neutral-600">
        {author.displayName}
      </span>
    </div>
  )
}

