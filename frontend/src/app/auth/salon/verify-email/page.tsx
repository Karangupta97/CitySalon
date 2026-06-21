"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Mail, RotateCw, CheckCircle, XCircle, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/components/boty/auth-context"

function SalonVerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()
  const tokenParam = searchParams.get("token")
  const emailParam = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [isResending, setIsResending] = useState(false)

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
      const response: any = await apiFetch("/salon-auth/verify-email", {
        method: "POST",
        bodyData: { code: verificationToken },
      })

      // Auto sign-in if tokens returned
      if (response?.data?.accessToken && response?.data?.partner) {
        login(response.data.partner, response.data.accessToken)
        setSuccessMsg("Email verified! Redirecting to your dashboard...")
        setTimeout(() => {
          router.push("/owner/dashboard")
          router.refresh()
        }, 1000)
      } else {
        setSuccessMsg("Email verified! Redirecting...")
        setTimeout(() => {
          router.push("/owner/dashboard")
          router.refresh()
        }, 1000)
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed. Please check the code and try again.")
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
      return
    }
    setIsResending(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      await apiFetch("/salon-auth/resend-verification", {
        method: "POST",
        bodyData: { email: emailParam },
      })
      setSuccessMsg("A new verification code has been sent to your inbox.")
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend verification code.")
    } finally {
      setIsResending(false)
    }
  }

  // Success state
  if (successMsg && !errorMsg) {
    return (
      <div className="space-y-5 text-center animate-blur-in">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-xl font-semibold tracking-tight">Email Verified!</h1>
          <p className="text-muted-foreground text-xs max-w-xs mx-auto">{successMsg}</p>
        </div>
        <div className="flex justify-center">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-blur-in">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
          <Mail className="w-5 h-5 text-primary" />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Store className="w-2 h-2 text-accent" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="font-serif text-xl font-semibold tracking-tight">Verify your email</h1>
        <p className="text-muted-foreground text-xs max-w-xs mx-auto">
          Enter the 6-digit code sent to{emailParam ? ` ${emailParam}` : " your email"}.
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="p-2.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-10 h-10 text-base rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={1} className="w-10 h-10 text-base rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={2} className="w-10 h-10 text-base rounded-lg bg-muted/40 border-border/40 text-foreground" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-10 h-10 text-base rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={4} className="w-10 h-10 text-base rounded-lg bg-muted/40 border-border/40 text-foreground" />
            <InputOTPSlot index={5} className="w-10 h-10 text-base rounded-lg bg-muted/40 border-border/40 text-foreground" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        className="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
        disabled={otp.length < 6 || isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          "Verify & Continue"
        )}
      </Button>

      {/* Resend */}
      {emailParam && (
        <div className="text-center space-y-1.5">
          <p className="text-[11px] text-muted-foreground/70">Didn&apos;t receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium hover:text-primary transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
            Resend code
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-[11px] text-muted-foreground">
        Wrong email?{" "}
        <Link href="/auth/salon/register" className="text-foreground font-semibold hover:text-primary transition-colors hover:underline">
          Go back
        </Link>
      </p>
    </div>
  )
}

export default function SalonVerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    }>
      <SalonVerifyEmailContent />
    </Suspense>
  )
}
