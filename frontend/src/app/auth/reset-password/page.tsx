"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, ArrowRight, Check, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

  const passwordChecks = [
    { label: "8+ chars", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
  ]

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Password updated!
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Your password has been successfully reset. You can now sign in.
          </p>
        </div>
        <Button
          asChild
          className="h-11 rounded-xl px-8 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90"
        >
          <Link href="/auth/login">
            Sign in
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center">
          <Lock className="w-5 h-5 text-foreground/70" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Set new password
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose a strong password to keep your account secure.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="h-11 pl-10 pr-10 rounded-xl bg-muted/40 border-border/40 placeholder:text-muted-foreground/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground boty-transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="flex items-center gap-3 px-1">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-1 text-[11px]">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center boty-transition ${
                      check.met ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/40"
                    }`}
                  >
                    <Check className="w-2 h-2" />
                  </div>
                  <span className={check.met ? "text-foreground/70" : "text-muted-foreground/50"}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            className="h-11 pl-10 pr-10 rounded-xl bg-muted/40 border-border/40 placeholder:text-muted-foreground/50"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground boty-transition"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl text-sm font-semibold bg-foreground text-background hover:bg-foreground/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  )
}
