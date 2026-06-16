"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function CTABanner() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-16 bg-background" ref={ref}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-8 scroll-reveal-scale ${isVisible ? "visible" : ""}`}>
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-8 md:px-12 md:py-10">
          {/* Leaf decoration - left side */}
          <div className="absolute left-0 bottom-0 w-32 md:w-44 h-full pointer-events-none">
            <Image
              src="/hero/leaf.svg"
              alt=""
              fill
              className="object-contain object-left-bottom opacity-60"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-0 ml-20 md:ml-36">
            {/* Heading */}
            <div className="flex-shrink-0">
              <h2 className="font-serif text-2xl md:text-3xl text-primary-foreground italic leading-tight">
                For salons,<br />by salons.
              </h2>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-12 bg-primary-foreground/20 mx-8" />

            {/* Description */}
            <p className="text-primary-foreground/80 text-sm md:text-base flex-1">
              Join CitySalon and grow your<br className="hidden md:block" />
              business with zero commissions.
            </p>

            {/* CTA Button */}
            <Link
              href="/register-salon"
              className="group inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium boty-transition hover:bg-primary-foreground/10 flex-shrink-0"
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
