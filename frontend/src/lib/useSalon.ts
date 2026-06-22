import { useState, useEffect } from "react"
import { salons, type SalonData } from "@/data/salons"

export function useSalon(idOrSlug: string) {
  const [salon, setSalon] = useState<SalonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!idOrSlug) {
      setIsLoading(false)
      return
    }

    // 1. Try static mock data (matching keys like 'akshita-shoanak')
    if (salons[idOrSlug]) {
      setSalon(salons[idOrSlug])
      setIsLoading(false)
      return
    }

    // 2. Try matching static mock name slug (e.g. if idOrSlug is case-insensitive or slightly different)
    const mockMatch = Object.entries(salons).find(([key, s]) => {
      return (
        key.toLowerCase() === idOrSlug.toLowerCase() ||
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === idOrSlug.toLowerCase()
      )
    })
    if (mockMatch) {
      setSalon(mockMatch[1])
      setIsLoading(false)
      return
    }

    // 3. Fetch from Backend API
    const fetchSalon = async () => {
      try {
        const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
        const API_URL = RAW_API_URL.endsWith("/api/v1")
          ? RAW_API_URL
          : RAW_API_URL.replace(/\/+$/, "") + "/api/v1"

        const response = await fetch(`${API_URL}/public/salons/${idOrSlug}`)
        if (!response.ok) {
          throw new Error(`Failed to load salon details: ${response.statusText}`)
        }
        const json = await response.json()
        if (json?.status === "success" && json?.data) {
          setSalon(json.data)
        } else {
          throw new Error("Salon not found.")
        }
      } catch (err: any) {
        console.error("useSalon fetch error:", err)
        setError(err.message || "Salon not found")
        setSalon(null)
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    fetchSalon()
  }, [idOrSlug])

  return { salon, isLoading, error }
}
