import { NextRequest, NextResponse } from "next/server"

import { API_ROOT } from "@/lib/api"
import { setAuthCookies } from "@/lib/server-auth"

export async function POST(request: NextRequest) {
  const backendResponse = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  })

  const payload = await backendResponse.json()
  const response = NextResponse.json(payload, { status: backendResponse.status })

  if (backendResponse.ok) {
    setAuthCookies(response, payload.data)
  }

  return response
}
