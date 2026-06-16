"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface UserProfile {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, name: string) => void
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
    const stored = localStorage.getItem("citysalon_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, name: string) => {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
    }
    setUser(profile)
    localStorage.setItem("citysalon_user", JSON.stringify(profile))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("citysalon_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
