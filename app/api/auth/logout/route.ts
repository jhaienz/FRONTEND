import { NextResponse } from "next/server"

import { clearAuthCookies } from "@/lib/server-auth"

export async function POST() {
  const response = NextResponse.json({ data: { message: "Signed out" } })
  clearAuthCookies(response)
  return response
}
