import { type NextRequest, NextResponse } from "next/server"

import { clearAuthCookies } from "@/lib/server-auth"

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url))
  clearAuthCookies(response)
  return response
}
