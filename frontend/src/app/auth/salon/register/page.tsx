"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Store, MapPin,
  Check, Sparkles, Shield, BarChart3, Calendar, Users, Key,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/components/boty/auth-context"

export default function SalonRegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Step 1: Owner details
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  // Step 2: Salon details
  const [salonName, setSalonName] = useState("")
  const [salonCity, setSalonCity] = useState("")
  const [salonAddress, setSalonAddress] = useState("")

  const passwordChecks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
    { label: "Special char", met: /[^a-zA-Z0-9]/.test(password) },
  ]
  const strengthScore = passwordChecks.filter((c) => c.met).length

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (strengthScore < 4) {
      setErrorMsg("Please meet all password requirements.")
      return
    }
    setErrorMsg("")
    setStep(2)
  }

  const handleDemoLogin = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    try {
      // Register the owner account
      await apiFetch("/auth/register", {
        method: "POST",
        bodyData: {
          full_name: fullName,
          email,
          phone_number: phone || undefined,
          password,
        },
      })

      // Redirect to verify email, then they'll proceed to dashboard
      router.push(`/auth/salon/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Calendar, label: "Appointment System" },
    { icon: BarChart3, label: "Revenue Analytics" },
    { icon: Users, label: "Staff Management" },
    { icon: Shield, label: "Verified Badge" },
  ]

  return (
    <div className="space-y-3.5 animate-blur-in">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm relative">
          <Store className="w-5 h-5 text-primary" />
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-accent" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="font-serif text-xl font-semibold tracking-tight">
          {step === 1 ? "Register Your Salon" : "Salon Details"}
        </h1>
        <p className="text-muted-foreground text-xs">
          {step === 1 ? "Join 500+ salon owners growing with CitySalon." : "Tell us about your salon — edit everything later."}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
          step === 1 ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/50 text-muted-foreground"
        }`}>
          <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[9px]">1</span>
          Owner
        </div>
        <div className="w-6 h-px bg-border" />
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
          step === 2 ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/50 text-muted-foreground"
        }`}>
          <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[9px]">2</span>
          Salon
        </div>
      </div>

      {/* Features row */}
      {step === 1 && (
        <>
          {/* Demo Credentials Card */}
          <div className="relative overflow-hidden p-3 rounded-xl bg-accent/10 border border-accent/30 space-y-2 transition-all duration-300 hover:border-accent/50 shadow-sm">
            <div className="absolute inset-0 shimmer-border pointer-events-none opacity-30" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Key className="w-3.5 h-3.5 text-accent shrink-0 animate-pulse" />
                <h4 className="text-[11px] font-semibold text-foreground/90">Demo Access — Skip Registration</h4>
              </div>
              <span className="text-[8px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">Fast Pass</span>
            </div>
            <Button
              type="button"
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full h-8.5 rounded-lg border-accent/40 text-foreground hover:bg-accent/20 hover:text-foreground hover:scale-[1.01] active:scale-[0.99] text-xs font-medium transition-all duration-300"
              disabled={isLoading}
            >
              Skip Registration & Enter Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/30">
              <f.icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[10px] font-medium text-foreground/80">{f.label}</span>
            </div>
          ))}
          </div>
        </>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Step 1: Owner Info */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-3">
          <div className="relative">
            <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "name" ? "text-primary" : "text-muted-foreground/60"
            }`} />
            <Input type="text" placeholder="Your full name *" value={fullName} onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} required
              className="h-10 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
          </div>

          <div className="relative">
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "email" ? "text-primary" : "text-muted-foreground/60"
            }`} />
            <Input type="email" placeholder="Business email *" value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} required
              className="h-10 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
          </div>

          <div className="relative">
            <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "phone" ? "text-primary" : "text-muted-foreground/60"
            }`} />
            <Input type="text" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
              className="h-10 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                focusedField === "password" ? "text-primary" : "text-muted-foreground/60"
              }`} />
              <Input type={showPassword ? "text" : "password"} placeholder="Create password *" value={password} onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} required
                className="h-10 pl-10 pr-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 animate-fade-in">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-1 text-[10px]">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${check.met ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/30"}`}>
                      <Check className="w-2 h-2 stroke-[3]" />
                    </div>
                    <span className={check.met ? "text-foreground/80 font-medium" : "text-muted-foreground/50"}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md">
            Continue →
          </Button>
        </form>
      )}

      {/* Step 2: Salon Info */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Store className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "salonName" ? "text-primary" : "text-muted-foreground/60"
            }`} />
            <Input type="text" placeholder="Salon name *" value={salonName} onChange={(e) => setSalonName(e.target.value)}
              onFocus={() => setFocusedField("salonName")} onBlur={() => setFocusedField(null)} required
              className="h-10 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm" />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none z-10" />
            <Select value={salonCity} onValueChange={(v) => setSalonCity(v)} required>
              <SelectTrigger className="h-10 pl-10 rounded-xl bg-muted/30 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-sm shadow-sm [&>span]:text-muted-foreground/45 data-[state=open]:border-primary/60">
                <SelectValue placeholder="Select city *" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Navi Mumbai">Navi Mumbai</SelectItem>
                <SelectItem value="Thane">Thane</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Noida">Noida</SelectItem>
                <SelectItem value="Gurugram">Gurugram</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
                <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="Jaipur">Jaipur</SelectItem>
                <SelectItem value="Lucknow">Lucknow</SelectItem>
                <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <MapPin className={`absolute left-3.5 top-2.5 w-4 h-4 transition-colors duration-300 ${
              focusedField === "address" ? "text-primary" : "text-muted-foreground/60"
            }`} />
            <textarea placeholder="Full address (optional)" value={salonAddress} onChange={(e) => setSalonAddress(e.target.value)}
              onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField(null)} rows={2}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/30 border border-border/40 focus:border-primary/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/45 text-sm transition-all shadow-sm resize-none" />
          </div>

          <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15 text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground/80">Note:</span> You can complete your full salon profile (services, staff, images, timings) after registration from your Owner Dashboard.
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}
              className="flex-1 h-10 rounded-xl text-sm font-medium border-border/50">
              ← Back
            </Button>
            <Button type="submit" disabled={isLoading}
              className="flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Create Salon Account"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Terms */}
      <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed">
        By registering, you agree to our{" "}
        <Link href="/terms" className="text-foreground/75 hover:text-primary hover:underline">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="text-foreground/75 hover:text-primary hover:underline">Privacy Policy</Link>.
      </p>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have a salon account?{" "}
        <Link href="/auth/salon/login" className="text-foreground font-semibold hover:text-primary transition-colors hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
