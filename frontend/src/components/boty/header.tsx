"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, User } from "lucide-react"
import { Logo } from "./logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4">
      <nav className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 backdrop-blur-md rounded-xl sm:rounded-lg py-0 my-0 animate-scale-fade-in bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.32)]" style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px' }}>
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 text-foreground/80 hover:text-foreground boty-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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
              href="/for-salons"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              For Salons
            </Link>
            <Link
              href="/cities"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Cities
            </Link>
          </div>

          {/* Logo - Center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Logo size="sm" className="sm:hidden" />
            <Logo size="md" className="hidden sm:inline-flex" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button
              type="button"
              className="p-1.5 sm:p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-medium text-white bg-foreground rounded-full hover:bg-foreground/90 boty-transition"
            >
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden boty-transition ${
            isMenuOpen ? "max-h-80 pb-4 sm:pb-5" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 sm:gap-3 pt-3 border-t border-border/50">
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/for-salons"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              For Salons
            </Link>
            <Link
              href="/cities"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Cities
            </Link>
            <Link
              href="/auth/login"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition py-1.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
