"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async () => {
    if (otp.length < 6) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleResend = async () => {
    setIsResending(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsResending(false)
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
          Enter the 6-digit code we sent to your email address.
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40" />
            <InputOTPSlot index={1} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40" />
            <InputOTPSlot index={2} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40" />
            <InputOTPSlot index={4} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40" />
            <InputOTPSlot index={5} className="w-11 h-11 text-lg rounded-lg bg-muted/40 border-border/40" />
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
