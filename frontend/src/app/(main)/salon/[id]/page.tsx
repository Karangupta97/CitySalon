"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function SalonRedirectPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      router.replace(`/${params.id}`)
    }
  }, [params.id, router])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm font-medium">Redirecting you to the personal domain...</p>
      </div>
    </main>
  )
}
