import { NextRequest, NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"

const protectedPrefixes = ["/dashboard", "/upload"]
const authPages = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  )
  const role = request.cookies.get(USER_ROLE_COOKIE)?.value

  // Redirect logged-in users away from auth pages
  if (hasSession && authPages.includes(pathname)) {
    const dest = request.nextUrl.clone()
    dest.pathname = role === "admin" ? "/admin" : "/dashboard"
    dest.search = ""
    return NextResponse.redirect(dest)
  }

  // Protect dashboard and upload routes
  if (
    (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) || pathname.startsWith("/admin")) &&
    !hasSession
  ) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Non-admin trying to access admin routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    dashboardUrl.search = ""
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload", "/admin/:path*", "/login", "/register"],
}
