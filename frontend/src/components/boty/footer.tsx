"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { Logo } from "./logo"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const footerLinks = {
  discover: [
    { name: "Browse Salons", href: "/salons" },
    { name: "Shop Products", href: "/shop" },
    { name: "AI Beauty Advisor", href: "/advisor" },
  ],
  forBusiness: [
    { name: "List Your Salon", href: "/auth/salon/register" },
    { name: "Salon Owner Login", href: "/auth/salon/login" },
    { name: "Owner Dashboard", href: "/owner/dashboard" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cancellation Policy", href: "/cancellation" },
  ],
}

export function Footer() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <footer className="bg-card pt-10 sm:pt-12 md:pt-16 lg:pt-20 pb-6 sm:pb-8" ref={ref}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 scroll-reveal ${isVisible ? "visible" : ""}`}>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground mt-3 sm:mt-4 leading-relaxed max-w-xs">
              Mumbai & Navi Mumbai&apos;s trusted beauty & wellness marketplace. Discover, book, and enjoy top-rated salons near you.
            </p>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition boty-shadow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition boty-shadow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition boty-shadow"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 sm:mb-4">Discover</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 sm:mb-4">For Business</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.forBusiness.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CitySalon. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care in Mumbai
          </p>
        </div>
      </div>
    </footer>
  )
}
