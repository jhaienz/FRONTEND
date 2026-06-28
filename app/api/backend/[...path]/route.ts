import { NextRequest, NextResponse } from "next/server"

import { API_ROOT } from "@/lib/api"
import { getAccessToken, refreshAccessToken } from "@/lib/server-auth"

const methodsWithBody = new Set(["POST", "PUT", "PATCH", "DELETE"])

async function proxy(request: NextRequest, context: { params: Promise<unknown> }) {
  const { path } = (await context.params) as { path: string[] }
  const target = new URL(`${API_ROOT}/${path.join("/")}`)
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value))

  const cookieCarrier = NextResponse.json({})
  const token = await getAccessToken()

  const body = methodsWithBody.has(request.method) ? await request.text() : undefined
  const makeBackendRequest = (accessToken: string | null) =>
    fetch(target, {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("content-type") ?? "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body,
      cache: "no-store",
    })

  let backendResponse = await makeBackendRequest(token)

  // Only attempt token refresh if we had a token that the backend rejected
  if (backendResponse.status === 401 && token) {
    const refreshed = await refreshAccessToken(cookieCarrier)
    if (!refreshed) {
      return NextResponse.json({ statusCode: 401, message: "Session expired. Sign in again." }, { status: 401 })
    }
    backendResponse = await makeBackendRequest(refreshed)
  }

  const payload = await backendResponse.text()
  const proxiedResponse = new NextResponse(payload, {
    status: backendResponse.status,
    headers: { "Content-Type": backendResponse.headers.get("content-type") ?? "application/json" },
  })
  cookieCarrier.cookies.getAll().forEach((cookie) => proxiedResponse.cookies.set(cookie))
  return proxiedResponse
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const PUT = proxy
export const DELETE = proxy
