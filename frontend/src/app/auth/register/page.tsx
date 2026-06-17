"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, Phone, Key } from "lucide-react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/components/boty/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Google Sign-In Simulator state
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulatedName, setSimulatedName] = useState("Demo Google Judge")
  const [simulatedEmail, setSimulatedEmail] = useState("judge.google@citysalon.com")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(false)
    setErrorMsg("")
    setIsLoading(true)

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        bodyData: {
          full_name: fullName,
          email,
          phone_number: phoneNumber || undefined,
          password,
        },
      })
      // Success! Redirect to email verification page with email parameter
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      setShowSimulator(true)
      return
    }

    try {
      if (typeof window !== "undefined" && (window as any).google) {
        const google = (window as any).google
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            setIsLoading(true)
            setErrorMsg("")
            try {
              const res: any = await apiFetch("/auth/google", {
                method: "POST",
                bodyData: { idToken: response.credential },
              })
              if (res?.data?.accessToken && res?.data?.user) {
                login(res.data.user, res.data.accessToken)
                router.push("/")
                router.refresh()
              }
            } catch (err: any) {
              setErrorMsg(err.message || "Google Authentication failed.")
            } finally {
              setIsLoading(false)
            }
          },
        })
        google.accounts.id.prompt()
      } else {
        setErrorMsg("Google Sign-In client is loading. Please click again.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Failed to initialize Google Sign-In.")
    }
  }

  const handleSimulatedSubmit = async () => {
    setIsLoading(true)
    setErrorMsg("")
    setShowSimulator(false)

    try {
      const mockToken = `mock-gsi-token|${simulatedEmail}|${simulatedName}`
      const res: any = await apiFetch("/auth/google", {
        method: "POST",
        bodyData: { idToken: mockToken },
      })

      if (res?.data?.accessToken && res?.data?.user) {
        login(res.data.user, res.data.accessToken)
        router.push("/")
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Google Sign-In Simulation failed.")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
  ]

  const strengthScore = passwordChecks.filter((c) => c.met).length
  const strengthColor = 
    strengthScore === 0 ? "bg-muted" :
    strengthScore === 1 ? "bg-destructive" :
    strengthScore === 2 ? "bg-amber-500" :
    "bg-primary"
  const strengthLabel = 
    strengthScore === 0 ? "" :
    strengthScore === 1 ? "Weak" :
    strengthScore === 2 ? "Fair" :
    "Strong"

  return (
    <div className="space-y-6 animate-blur-in">
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-float shadow-sm">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Join CitySalon and discover your perfect routine.
        </p>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="relative group">
          <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
            focusedField === "fullName" ? "text-primary" : "text-muted-foreground/60"
          }`} />
          <Input
            type="text"
            placeholder="Full name"
            className="h-11 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-foreground transition-all duration-300 shadow-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onFocus={() => setFocusedField("fullName")}
            onBlur={() => setFocusedField(null)}
            required
          />
        </div>

        <div className="relative group">
          <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
            focusedField === "email" ? "text-primary" : "text-muted-foreground/60"
          }`} />
          <Input
            type="email"
            placeholder="Email"
            className="h-11 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-foreground transition-all duration-300 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            required
          />
        </div>

        <div className="relative group">
          <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
            focusedField === "phoneNumber" ? "text-primary" : "text-muted-foreground/60"
          }`} />
          <Input
            type="text"
            placeholder="Phone number (Optional)"
            className="h-11 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-foreground transition-all duration-300 shadow-sm"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onFocus={() => setFocusedField("phoneNumber")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div className="space-y-2">
          <div className="relative group">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "password" ? "text-primary" : "text-muted-foreground/60"
            }`} />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="h-11 pl-10 pr-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-foreground transition-all duration-300 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div className="space-y-2 px-1 py-1 animate-fade-in">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground font-medium">Password Strength</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  strengthScore === 1 ? "text-destructive" :
                  strengthScore === 2 ? "text-amber-500" :
                  "text-primary"
                }`}>{strengthLabel}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
                <div className={`h-full rounded-full transition-all duration-500 ${strengthColor}`} style={{ width: `${(strengthScore / 3) * 100}%` }} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-1.5 text-[11px] transition-all duration-300">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        check.met ? "bg-primary/20 text-primary scale-110" : "bg-muted text-muted-foreground/30"
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className={`transition-colors duration-300 ${check.met ? "text-foreground/80 font-medium" : "text-muted-foreground/50"}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-primary/15 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed mt-2">
          By creating an account, you agree to our{" "}
          <Link href="/" className="text-foreground/75 hover:text-primary transition-colors duration-200 hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/" className="text-foreground/75 hover:text-primary transition-colors duration-200 hover:underline">Privacy Policy</Link>.
        </p>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground/70">
            Or sign up with
          </span>
        </div>
      </div>

      {/* Google Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-10.5 px-4 rounded-xl border border-border/60 bg-background/50 dark:bg-muted/10 hover:bg-muted/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] hover:border-primary/30 transition-all duration-300 shadow-sm cursor-pointer"
          aria-label="Sign up with Google"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-xs font-semibold text-foreground/85">Continue with Google</span>
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-foreground font-semibold hover:text-primary transition-colors duration-200 hover:underline"
        >
          Sign in
        </Link>
      </p>

      {/* Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowSimulator(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-card border border-border/80 rounded-2xl p-6 shadow-xl animate-scale-fade-in space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5 text-accent animate-breathe" />
                Google OAuth Simulator
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Google Client ID is not configured. Use this simulator to run the complete end-to-end database sync, token signing, and session authentication.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Simulated Full Name</label>
                <Input
                  type="text"
                  className="h-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/50 text-xs"
                  value={simulatedName}
                  onChange={(e) => setSimulatedName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Simulated Email Address</label>
                <Input
                  type="email"
                  className="h-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/50 text-xs"
                  value={simulatedEmail}
                  onChange={(e) => setSimulatedEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 rounded-xl text-xs"
                onClick={() => setShowSimulator(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold"
                onClick={handleSimulatedSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Simulate Auth"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
