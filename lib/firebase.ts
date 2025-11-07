import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, type Analytics } from 'firebase/analytics'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate that all required environment variables are present
const validateConfig = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ]

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.\n' +
      'See FIREBASE_SETUP.md for instructions.'
    )
  }
}

// Initialize Firebase only once
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null

if (typeof window !== 'undefined') {
  // Client-side initialization
  validateConfig()
  
  // Initialize Firebase app (only once)
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  // Initialize services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  // Initialize Analytics (only in browser, not in SSR)
  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app)
  }
}

/**
 * Get the Firebase Firestore instance
 * @returns {Firestore} Firestore database instance
 */
export const getFirestoreDb = (): Firestore => {
  if (!db) {
    throw new Error(
      'Firestore is not initialized. This function can only be called on the client side.'
    )
  }
  return db
}

/**
 * Get the Firebase Auth instance
 * @returns {Auth} Firebase Auth instance
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error(
      'Firebase Auth is not initialized. This function can only be called on the client side.'
    )
  }
  return auth
}

/**
 * Get the Firebase Storage instance
 * @returns {FirebaseStorage} Firebase Storage instance
 */
export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    throw new Error(
      'Firebase Storage is not initialized. This function can only be called on the client side.'
    )
  }
  return storage
}

/**
 * Get the Firebase Analytics instance
 * @returns {Analytics | null} Firebase Analytics instance or null if not enabled
 */
export const getFirebaseAnalytics = (): Analytics | null => {
  return analytics
}

/**
 * Get the Firebase App instance
 * @returns {FirebaseApp} Firebase App instance
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    throw new Error(
      'Firebase App is not initialized. This function can only be called on the client side.'
    )
  }
  return app
}

// Export configured instances for direct use
export { app, auth, db, storage, analytics }

