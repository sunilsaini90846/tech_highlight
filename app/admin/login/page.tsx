'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithGoogle, AuthError, PermissionError } from '@/lib/auth'
import { useAuth } from '@/context/auth-context'

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, userData, loading: authLoading } = useAuth()

  // Redirect if already authenticated with proper role
  useEffect(() => {
    if (!authLoading && user && userData) {
      if (userData.role === 'admin' || userData.role === 'editor') {
        router.push('/admin')
      } else {
        setError('Access denied. Admin or editor role required.')
      }
    }
  }, [user, userData, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)

      await signInWithGoogle()
      // Redirect will happen in useEffect when userData is updated

    } catch (err) {
      setLoading(false)

      if (err instanceof PermissionError) {
        setError('Access denied. Only administrators and editors can access the admin panel.')
      } else if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }

      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-neutral-900">TechHighlight</span>
          </Link>
          <h2 className="text-3xl font-bold text-neutral-900">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in with your Google account to access the admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-neutral-200">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mr-3"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                ← Back to TechHighlight
              </Link>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-neutral-500">
          <p>Only users with admin or editor roles can access this area.</p>
          <p className="mt-1">Contact an administrator to get access.</p>
        </div>
      </div>
    </div>
  )
}
