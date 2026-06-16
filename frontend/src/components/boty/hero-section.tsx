"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-[100svh] flex items-center bg-background overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      {/* Right side hero image — desktop only, parallax */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full hidden lg:block"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <Image
          src="/hero/Hero.svg"
          alt="Beautiful woman at salon"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-xl">
          <span
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary/80 font-medium mb-5 sm:mb-7 animate-blur-in opacity-0"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <span className="w-6 h-px bg-primary/40" />
            Mumbai Salon Marketplace
          </span>
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.08] mb-5 sm:mb-7 text-foreground animate-blur-in opacity-0"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <span className="block italic font-normal">Discover salons</span>
            <span className="block italic font-normal">that truly</span>
            <span className="block font-semibold not-italic text-primary">deliver.</span>
          </h1>
          <p
            className="text-sm sm:text-base text-muted-foreground mb-9 sm:mb-11 max-w-sm leading-relaxed animate-blur-in opacity-0"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            Pure discovery. Verified salons.<br />
            Zero hidden charges.
          </p>
          <div
            className="flex items-center gap-4 animate-blur-in opacity-0"
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          >
            <Link
              href="/salons"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm tracking-wide font-medium boty-transition hover:bg-primary/90 boty-shadow hover:shadow-lg"
            >
              Explore salons
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
            </Link>
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground boty-transition"
            >
              View services
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile hero image */}
      <div className="absolute bottom-0 right-0 w-3/4 h-[45vh] sm:h-[50vh] lg:hidden pointer-events-none">
        <Image
          src="/hero/Hero.svg"
          alt="Beautiful woman at salon"
          fill
          className="object-contain object-bottom-right opacity-25 sm:opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>
    </section>
  )
}
