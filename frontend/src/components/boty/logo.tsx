"use client"

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showIcon = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { text: "text-xl", icon: 16, leaf: 0.7 },
    md: { text: "text-3xl", icon: 22, leaf: 1 },
    lg: { text: "text-5xl", icon: 32, leaf: 1.4 },
  }

  const s = sizes[size]

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {showIcon && (
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          {/* Leaf mark */}
          <path
            d="M20 4c-1 8-6 13-16 16c8-1 14-6 16-16z"
            className="fill-primary"
          />
          <path
            d="M20 4C16 12 10 16 4 20"
            className="stroke-primary"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10 14c2-4 5-7 10-10"
            className="stroke-primary/50"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
      <span className={`font-serif ${s.text} tracking-wider text-foreground`}>
        CitySalon
      </span>
    </span>
  )
}
