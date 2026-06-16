"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, MapPin, User } from "lucide-react"
import { Logo } from "./logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 backdrop-blur-md rounded-lg py-0 my-0 animate-scale-fade-in bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.32)]" style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px' }}>
        <div className="flex items-center justify-between h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/80 hover:text-foreground boty-transition"
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
            <Logo size="md" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/auth/login"
              className="hidden sm:flex p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              type="button"
              className="p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Location"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden boty-transition ${
            isMenuOpen ? "max-h-72 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
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
            <Link
              href="/auth/login"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
