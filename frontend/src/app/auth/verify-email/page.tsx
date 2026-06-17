"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Mail, RotateCw, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { apiFetch } from "@/lib/api"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tokenParam = searchParams.get("token")
  const emailParam = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [isResending, setIsResending] = useState(false)

  // Auto verify if token is present in URL params on mount
  useEffect(() => {
    if (tokenParam) {
      setOtp(tokenParam)
      triggerVerification(tokenParam)
    }
  }, [tokenParam])

  const triggerVerification = async (verificationToken: string) => {
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      await apiFetch(`/auth/verify-email?token=${verificationToken}`, {
        method: "GET",
      })
      setSuccessMsg("Email successfully verified! You can now sign in.")
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify email. Please double check the code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (otp.length < 6) return
    await triggerVerification(otp)
  }

  const handleResend = async () => {
    if (!emailParam) {
      setErrorMsg("Unable to resend: Email context is missing.")
      return;
    }

    setIsResending(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        bodyData: { email: emailParam },
      })
      setSuccessMsg("A new verification code has been dispatched to your inbox.")
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend verification code.")
    } finally {
      setIsResending(false)
    }
  }

  if (successMsg) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Email Verified!
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {successMsg}
          </p>
        </div>
        <Button
          onClick={() => router.push("/auth/login")}
          className="w-full h-11 rounded-xl text-sm font-semibold bg-foreground text-background hover:bg-foreground/90"
        >
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center">
          <Mail className="w-5 h-5 text-foreground/70" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Enter the 6-digit code we sent to your email address {emailParam && `(${emailParam})`}.
        </p>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl text-center flex items-center justify-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={1} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={2} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40 text-foreground" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={4} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={5} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40 text-foreground" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify button */}
      <Button
        onClick={handleVerify}
        className="w-full h-11 rounded-xl text-sm font-semibold bg-foreground text-background hover:bg-foreground/90"
        disabled={otp.length < 6 || isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
        ) : (
          "Verify Email"
        )}
      </Button>

      {/* Resend */}
      {emailParam && (
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground/70">
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium hover:text-foreground/70 boty-transition disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
            Resend code
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link
          href="/auth/register"
          className="text-foreground font-medium hover:text-foreground/70 boty-transition"
        >
          Go back
        </Link>
      </p>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
