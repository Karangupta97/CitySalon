"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-foreground/70" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Check your inbox
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <p className="text-xs text-muted-foreground/70">
            Didn&apos;t receive the email? Check spam or{" "}
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-foreground font-medium hover:text-foreground/70 boty-transition"
            >
              try again
            </button>
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium hover:text-foreground/70 boty-transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-foreground/70" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-muted-foreground text-sm">
          No worries. Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            type="email"
            placeholder="Email"
            className="h-11 pl-10 rounded-xl bg-muted/40 border-border/40 placeholder:text-muted-foreground/50"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl text-sm font-semibold bg-foreground text-background hover:bg-foreground/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground boty-transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
