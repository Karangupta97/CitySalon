"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search, User, LogOut } from "lucide-react"
import { Logo } from "./logo"
import { useAuth } from "./auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4">
      <nav className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 backdrop-blur-md rounded-xl sm:rounded-2xl animate-scale-fade-in bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.32)]" style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px' }}>
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">
          {/* Left: Mobile menu button / Desktop nav links */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 text-foreground/80 hover:text-foreground boty-transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation - Left */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
              >
                Explore
              </Link>
              <Link
                href="/advisor"
                className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
              >
                AI Advisor
              </Link>
              <Link
                href="/salons"
                className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
              >
                Salons Near You
              </Link>
              <Link
                href="/cities"
                className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
              >
                Cities
              </Link>
            </div>
          </div>

          {/* Center: Single Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" className="inline-flex sm:hidden" />
            <Logo size="md" className="hidden sm:inline-flex" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            <button
              type="button"
              className="p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {user ? (
              <div className="relative flex items-center group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-border/50 bg-muted/40 hover:bg-muted/70 boty-transition"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-foreground/80">
                    {user.full_name.split(" ")[0]}
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/60 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto boty-transition py-2 z-50">
                  <div className="px-4 py-2 border-b border-border/40">
                    <p className="text-xs font-bold text-foreground truncate">{user.full_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-muted/50 boty-transition font-semibold flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-foreground rounded-full hover:bg-foreground/90 boty-transition"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[400px] pb-5" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-3 border-t border-border/50">
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted/50 boty-transition py-2.5 px-3 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/advisor"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted/50 boty-transition py-2.5 px-3 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Advisor
            </Link>
            <Link
              href="/salons"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted/50 boty-transition py-2.5 px-3 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Salons Near You
            </Link>
            <Link
              href="/cities"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted/50 boty-transition py-2.5 px-3 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Cities
            </Link>
            {user ? (
              <>
                <div className="py-3 px-3 border-t border-b border-border/40 my-2">
                  <p className="text-sm font-bold text-foreground">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="text-sm tracking-wide text-red-600 font-semibold hover:text-red-700 hover:bg-red-50 boty-transition py-2.5 px-3 rounded-lg text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted/50 boty-transition py-2.5 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
