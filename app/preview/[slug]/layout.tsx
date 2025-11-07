'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { isEditor } from '@/lib/auth'

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login?redirect=' + encodeURIComponent(window.location.pathname))
        return
      }

      if (!userData || !['admin', 'editor'].includes(userData.role)) {
        router.push('/admin/login?error=access-denied')
        return
      }

      setIsAuthorized(true)
    }
  }, [user, userData, loading, router])

  // Show loading while checking auth
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
          <p className="text-neutral-600 mt-4">Checking access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
