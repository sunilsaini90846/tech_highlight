import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth'
import { getFirebaseAuth } from './firebase'
import { getUserById, saveUser } from './db'
import { User as UserType } from './types'

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class PermissionError extends AuthError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'permission-denied')
    this.name = 'PermissionError'
  }
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

/**
 * Sign in with Google using popup (preferred for web)
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const auth = getFirebaseAuth()
    const result = await signInWithPopup(auth, googleProvider)
    await handleUserSignIn(result.user)
    return result.user
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      // Fallback to redirect
      return signInWithGoogleRedirect()
    }
    throw new AuthError(error.message, error.code)
  }
}

/**
 * Sign in with Google using redirect (fallback)
 */
export async function signInWithGoogleRedirect(): Promise<void> {
  try {
    const auth = getFirebaseAuth()
    await signInWithRedirect(auth, googleProvider)
  } catch (error: any) {
    throw new AuthError(error.message, error.code)
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  try {
    const auth = getFirebaseAuth()
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new AuthError(error.message, error.code)
  }
}

/**
 * Handle user sign-in - create/update user record
 */
async function handleUserSignIn(firebaseUser: User): Promise<void> {
  try {
    // Check if user exists in our database
    const existingUser = await getUserById(firebaseUser.uid)

    if (!existingUser) {
      // Create new user with default role (reader)
      await saveUser(firebaseUser.uid, {
        displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
        email: firebaseUser.email!,
        role: 'reader', // Default role - admin must manually set to admin/editor
      })
    } else {
      // Update last login time
      await saveUser(firebaseUser.uid, {
        displayName: existingUser.displayName,
        email: existingUser.email,
        role: existingUser.role,
      })
    }
  } catch (error) {
    console.error('Failed to handle user sign-in:', error)
    // Don't throw - allow sign-in to complete even if user creation fails
  }
}

/**
 * Get current user with role information
 */
export async function getCurrentUser(): Promise<UserType | null> {
  try {
    const auth = getFirebaseAuth()
    const firebaseUser = auth.currentUser

    if (!firebaseUser) {
      return null
    }

    const userData = await getUserById(firebaseUser.uid)
    return userData
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

/**
 * Check if current user has required role
 */
export async function hasRole(requiredRoles: string[]): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user ? requiredRoles.includes(user.role) : false
  } catch (error) {
    console.error('Failed to check user role:', error)
    return false
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(['admin'])
}

/**
 * Check if current user is editor or admin
 */
export async function isEditor(): Promise<boolean> {
  return hasRole(['admin', 'editor'])
}

/**
 * Require authentication and role
 */
export async function requireAuth(requiredRoles: string[] = []): Promise<UserType> {
  const user = await getCurrentUser()

  if (!user) {
    throw new AuthError('Authentication required', 'auth/requires-auth')
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    throw new PermissionError(`Required role: ${requiredRoles.join(' or ')}`)
  }

  return user
}

/**
 * Auth state change listener
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}

/**
 * Get Firebase Auth instance (for direct use if needed)
 */
export function getAuth(): Auth {
  return getFirebaseAuth()
}

