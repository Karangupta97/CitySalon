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
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-16 sm:py-20">
        <div className="max-w-xl">
          <span
            className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground mb-4 sm:mb-6 block animate-blur-in opacity-0"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            Mumbai Salon Marketplace
          </span>
          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] mb-5 sm:mb-6 text-foreground animate-blur-in opacity-0"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <span className="block italic font-normal">Discover salons</span>
            <span className="block italic font-normal">that truly</span>
            <span className="block font-semibold not-italic">deliver.</span>
          </h1>
          <p
            className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 max-w-sm leading-relaxed animate-blur-in opacity-0"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            Pure discovery. Verified salons.<br />
            Zero hidden charges.
          </p>
          <div
            className="animate-blur-in opacity-0"
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          >
            <Link
              href="/salons"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm tracking-wide font-medium boty-transition hover:bg-primary/90 boty-shadow"
            >
              Explore salons
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
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
          className="object-contain object-bottom-right opacity-30 sm:opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  )
}
