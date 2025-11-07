'use client'

import { useEffect, useState } from 'react'

export default function TestFirebasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testFirebase() {
      try {
        // Dynamic import to avoid SSR issues
        const { getFirestoreDb, getFirebaseAuth, getFirebaseAnalytics } = await import('@/lib/firebase')
        
        const db = getFirestoreDb()
        const auth = getFirebaseAuth()
        const analytics = getFirebaseAnalytics()

        if (db && auth) {
          setStatus('success')
          setMessage('Firebase is configured correctly!')
        }
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Unknown error occurred')
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="container-custom py-12">
      <div className="card max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Firebase Connection Test</h1>
        
        {status === 'loading' && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
            <p className="text-neutral-600">Testing Firebase connection...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="font-semibold text-green-900">Success!</h2>
                <p className="mt-1 text-sm text-green-700">{message}</p>
                <p className="mt-2 text-sm text-green-700">
                  Firebase services are initialized and ready to use.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="font-semibold text-red-900">Configuration Error</h2>
                <p className="mt-1 text-sm text-red-700">{message}</p>
                <div className="mt-3 text-sm text-red-700">
                  <p className="font-medium">To fix this:</p>
                  <ol className="mt-2 list-decimal list-inside space-y-1">
                    <li>Create a <code className="bg-red-100 px-1 rounded">.env.local</code> file in the project root</li>
                    <li>Copy values from <code className="bg-red-100 px-1 rounded">env.example</code></li>
                    <li>Add your Firebase config from Firebase Console</li>
                    <li>Restart the dev server</li>
                  </ol>
                  <p className="mt-3">
                    See <strong>FIREBASE_SETUP.md</strong> for detailed instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-3">Required Environment Variables:</h3>
          <ul className="space-y-1 text-sm text-neutral-600 font-mono">
            <li>✓ NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
            <li>✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
            <li>✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
            <li>✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>✓ NEXT_PUBLIC_FIREBASE_APP_ID</li>
            <li>○ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <a 
            href="/FIREBASE_SETUP.md" 
            className="btn btn-primary"
            target="_blank"
          >
            Setup Guide
          </a>
          <a 
            href="/" 
            className="btn btn-secondary"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

