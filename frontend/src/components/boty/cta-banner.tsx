"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function CTABanner() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-10 sm:py-12 md:py-14 lg:py-18 bg-background" ref={ref}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 scroll-reveal-scale ${isVisible ? "visible" : ""}`}>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary to-primary/85 px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-14 lg:py-14">
          {/* Leaf decoration - left side */}
          <div className="absolute left-0 bottom-0 w-24 sm:w-36 md:w-48 h-full pointer-events-none">
            <Image
              src="/hero/leaf.svg"
              alt=""
              fill
              className="object-contain object-left-bottom opacity-30 sm:opacity-50"
              aria-hidden="true"
            />
          </div>

          {/* Decorative circles */}
          <div className="absolute top-6 right-12 w-32 h-32 rounded-full border border-primary-foreground/10 pointer-events-none" />
          <div className="absolute -bottom-8 right-1/4 w-48 h-48 rounded-full border border-primary-foreground/5 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-6 sm:gap-8 md:gap-0 ml-0 sm:ml-24 md:ml-40">
            {/* Heading */}
            <div className="flex-shrink-0">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary-foreground italic leading-tight">
                For salons,<br />by salons.
              </h2>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-14 bg-primary-foreground/15 mx-10" />

            {/* Description */}
            <p className="text-primary-foreground/80 text-sm md:text-base flex-1 leading-relaxed">
              Join CitySalon and grow your
              <br className="hidden md:block" /> business with zero commissions.
            </p>

            {/* CTA Button */}
            <Link
              href="/register-salon"
              className="group inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-semibold boty-transition hover:bg-primary-foreground/90 hover:shadow-lg flex-shrink-0"
            >
              Join as a salon
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
