import React from "react"
import Link from "next/link"
import { Logo } from "@/components/boty/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-secondary/20" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
        {/* Subtle arc decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-primary/3" />
      </div>

      {/* Logo top-left */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="backdrop-blur-xl bg-background/60 border border-border/50 rounded-2xl p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
