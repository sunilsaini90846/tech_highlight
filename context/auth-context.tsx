'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChange, getCurrentUser } from '@/lib/auth'
import { User } from '@/lib/types'

interface AuthContextType {
  user: FirebaseUser | null
  userData: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserData = async () => {
    if (user) {
      try {
        const data = await getCurrentUser()
        setUserData(data)
      } catch (error) {
        console.error('Failed to refresh user data:', error)
        setUserData(null)
      }
    } else {
      setUserData(null)
    }
  }

  const signOut = async () => {
    const { signOut } = await import('@/lib/auth')
    await signOut()
  }

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        await refreshUserData()
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

