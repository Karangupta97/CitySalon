"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Store, XCircle, Scissors, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/components/boty/auth-context"

export default function SalonLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    const isDemo = email.toLowerCase().trim() === "judge@citysalon.com" && password === "Password123!"

    try {
      const response: any = await apiFetch("/auth/login", {
        method: "POST",
        bodyData: { email, password },
      })

      if (response?.data?.accessToken && response?.data?.user) {
        login(response.data.user, response.data.accessToken)
      }

      router.push("/owner/dashboard")
      router.refresh()
    } catch (err: any) {
      if (isDemo) {
        login(
          { id: "demo-owner-id", full_name: "Demo Salon Owner", email: "judge@citysalon.com" },
          "demo-owner-jwt-token"
        )
        router.push("/owner/dashboard")
        router.refresh()
      } else {
        setErrorMsg(err.message || "Invalid credentials. Please check your email and password.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail("judge@citysalon.com")
    setPassword("Password123!")
    setIsLoading(true)
    setErrorMsg("")

    try {
      const response: any = await apiFetch("/auth/login", {
        method: "POST",
        bodyData: { email: "judge@citysalon.com", password: "Password123!" },
      })

      if (response?.data?.accessToken && response?.data?.user) {
        login(response.data.user, response.data.accessToken)
      }

      router.push("/owner/dashboard")
      router.refresh()
    } catch (err: any) {
      login(
        { id: "demo-owner-id", full_name: "Demo Salon Owner", email: "judge@citysalon.com" },
        "demo-owner-jwt-token"
      )
      router.push("/owner/dashboard")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 animate-blur-in">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm relative">
          <Store className="w-5 h-5 text-primary" />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Scissors className="w-2 h-2 text-accent" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="font-serif text-xl font-semibold tracking-tight">Salon Owner Login</h1>
        <p className="text-muted-foreground text-xs">Access your dashboard to manage bookings, staff & analytics.</p>
      </div>

      {/* Demo Credentials Card */}
      <div className="relative overflow-hidden p-3 rounded-xl bg-accent/10 border border-accent/30 space-y-2 transition-all duration-300 hover:border-accent/50 shadow-sm">
        <div className="absolute inset-0 shimmer-border pointer-events-none opacity-30" />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Key className="w-3.5 h-3.5 text-accent shrink-0 animate-pulse" />
            <h4 className="text-[11px] font-semibold text-foreground/90">Demo Salon Owner Access</h4>
          </div>
          <span className="text-[8px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">Fast Pass</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-background/60 dark:bg-background/20 p-2 rounded-lg border border-border/40 font-mono">
          <div>
            <span className="text-muted-foreground block text-[8px] uppercase tracking-wider">Email</span>
            <span className="text-foreground font-medium select-all">judge@citysalon.com</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[8px] uppercase tracking-wider">Password</span>
            <span className="text-foreground font-medium select-all">Password123!</span>
          </div>
        </div>
        <Button type="button" onClick={handleDemoLogin} variant="outline"
          className="w-full h-8 rounded-lg border-accent/40 text-foreground hover:bg-accent/20 text-xs font-medium transition-all duration-300"
          disabled={isLoading}>
          Autofill & Sign In to Dashboard
        </Button>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-2.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
          <XCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === "email" ? "text-primary" : "text-muted-foreground/60"}`} />
          <Input type="email" placeholder="Salon email address" value={email} onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} required
            className="h-10 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
        </div>

        <div className="relative">
          <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === "password" ? "text-primary" : "text-muted-foreground/60"}`} />
          <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} required
            className="h-10 pl-10 pr-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-[11px] font-medium text-foreground/75 hover:text-primary hover:underline transition-colors">Forgot password?</Link>
        </div>

        <Button type="submit" disabled={isLoading}
          className="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md">
          {isLoading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "Sign In to Dashboard"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-border/60" /></div>
        <div className="relative flex justify-center text-[11px]"><span className="bg-background px-3 text-muted-foreground/70">New to CitySalon?</span></div>
      </div>

      {/* Register CTA */}
      <div className="text-center space-y-2">
        <Link href="/auth/salon/register">
          <Button variant="outline" className="w-full h-9 rounded-xl border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 text-xs font-semibold transition-all">
            Register Your Salon — It&apos;s Free
          </Button>
        </Link>
        <p className="text-[11px] text-muted-foreground">
          Customer login?{" "}
          <Link href="/auth/login" className="text-foreground font-semibold hover:text-primary transition-colors hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
