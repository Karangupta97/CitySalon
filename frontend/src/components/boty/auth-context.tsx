"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface UserProfile {
  id: string
  full_name: string
  name: string // Backward compatibility alias for pre-existing components
  email: string
  phone_number?: string
  isDemo?: boolean        // true for demo, judge, and dev-team accounts
  salonId?: string | null // salon UUID for real owners; null for demo/new owners
  businessName?: string | null
  role?: string
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (user: Omit<UserProfile, "name">, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("citysalon_user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser({
          ...parsed,
          name: parsed.full_name || parsed.name,
          isDemo: parsed.isDemo ?? false,
          salonId: parsed.salonId ?? null,
          businessName: parsed.businessName ?? null,
        })
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const login = (userProfile: Omit<UserProfile, "name">, token: string) => {
    const profile: UserProfile = {
      ...userProfile,
      name: userProfile.full_name,
      isDemo: userProfile.isDemo ?? false,
      salonId: userProfile.salonId ?? null,
      businessName: userProfile.businessName ?? null,
    }
    setUser(profile)
    localStorage.setItem("citysalon_user", JSON.stringify(profile))
    localStorage.setItem("accessToken", token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("citysalon_user")
    localStorage.removeItem("accessToken")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
