import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Reserved system paths that cannot be used as salon usernames
const RESERVED_PATHS = new Set([
  "login",
  "signup",
  "book",
  "admin",
  "api",
  "settings",
  "auth",
  "advisor",
  "owner",
  "salons",
  "shop",
  "product",
  "privacy",
  "terms",
])

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname.toLowerCase()

  // Exclude local assets, Next.js internal files, API routes, and files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Get the first segment of the pathname
  const firstSegment = url.pathname.split("/").filter(Boolean)[0]

  // Redirect root /login and /signup to their actual auth routes
  if (firstSegment === "login") {
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }
  if (firstSegment === "signup") {
    url.pathname = "/auth/register"
    return NextResponse.redirect(url)
  }

  // If it's a reserved path, let it resolve naturally (Next.js will load the folder or return 404)
  if (firstSegment && RESERVED_PATHS.has(firstSegment)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}
