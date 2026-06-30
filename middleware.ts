import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const role = request.cookies.get(USER_ROLE_COOKIE)?.value

  const isLoggedIn = Boolean(token)
  const isAdmin = role === "admin"

  // Admin routes — must be logged in AND admin
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Protected user routes — must be logged in
  if (pathname.startsWith("/dashboard") || pathname === "/upload") {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Logged-in users visiting login/register go to their home
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/upload", "/login", "/register"],
}
