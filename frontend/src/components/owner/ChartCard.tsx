"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  headerActions?: React.ReactNode
  children: React.ReactNode
  w?: number
  h?: number
}

export function ChartCard({
  title,
  subtitle,
  headerActions,
  children,
  className,
  w,
  h,
  ...props
}: ChartCardProps) {
  const isSmallHeight = h !== undefined && h <= 3
  const isSmallWidth = w !== undefined && w <= 4
  const isCompact = isSmallHeight || isSmallWidth

  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-[#E2D9CE]/45 shadow-xs hover:border-[#3D5A3A]/30 transition-all duration-200 flex flex-col justify-start",
        isCompact ? "p-3 gap-1.5" : "p-4 sm:p-5 gap-3",
        className
      )}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className={cn(
          "flex items-start justify-between flex-wrap gap-2 shrink-0",
          isCompact ? "mb-2" : "mb-5"
        )}>
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className={cn(
                "font-serif font-bold text-[#3D5A3A] tracking-tight truncate",
                isCompact ? "text-xs" : "text-base"
              )}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={cn(
                "text-[#6E6960] font-sans mt-0.5 font-medium leading-relaxed truncate",
                isCompact ? "text-[9px]" : "text-xs"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="w-full flex-1 min-h-0 overflow-y-auto pr-0.5 scrollbar-thin">
        {children}
      </div>
    </div>
  )
}

