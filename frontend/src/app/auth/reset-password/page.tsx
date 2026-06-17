"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, ArrowRight, Check, ShieldCheck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") || ""

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!token) {
      setErrorMsg("Invalid action: Password reset token is missing from the link.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(false)
    setErrorMsg("")

    if (!token) {
      setErrorMsg("Password reset token is missing.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        bodyData: {
          token,
          password,
          confirm_password: confirmPassword,
        },
      })
      setIsSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. The link may have expired.")
    } finally {
      setIsLoading(false)
    }
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
            <ShieldCheck className="w-5 h-5 text-green-600" />
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
          onClick={() => router.push("/auth/login")}
          className="h-11 w-full rounded-xl px-8 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-1.5"
        >
          Sign in
          <ArrowRight className="w-4 h-4" />
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

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl text-center flex items-center justify-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="h-11 pl-10 pr-10 rounded-xl bg-muted/40 border-border/40 placeholder:text-muted-foreground/50 text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!token}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground boty-transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={!token}
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
            className="h-11 pl-10 pr-10 rounded-xl bg-muted/40 border-border/40 placeholder:text-muted-foreground/50 text-foreground"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!token}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground boty-transition"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            disabled={!token}
          >
            {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl text-sm font-semibold bg-foreground text-background hover:bg-foreground/90"
          disabled={isLoading || !token}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
