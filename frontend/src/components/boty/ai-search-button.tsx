"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

export function AISearchButton() {
  return (
    <Link
      href="/advisor"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center boty-shadow hover:scale-105 active:scale-95 boty-transition group"
      aria-label="AI Beauty Advisor"
    >
      <Sparkles className="w-5 h-5 group-hover:rotate-12 boty-transition" />
    </Link>
  )
}
