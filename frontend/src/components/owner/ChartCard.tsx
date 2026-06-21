"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  headerActions?: React.ReactNode
  children: React.ReactNode
}

export function ChartCard({
  title,
  subtitle,
  headerActions,
  children,
  className,
  ...props
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/45 shadow-xs hover:border-[#3D5A3A]/30 transition-all duration-200 flex flex-col justify-between",
        className
      )}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
          <div>
            {title && (
              <h3 className="font-serif text-base font-bold text-[#3D5A3A] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#6E6960] font-sans mt-0.5 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="w-full flex-1">
        {children}
      </div>
    </div>
  )
}
