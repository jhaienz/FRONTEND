import { ApiError } from "@/lib/api"
import type { ApiEnvelope, PaginatedResponse } from "@/types/api"

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(payload.message)) return payload.message.join(" ")
    return payload.message ?? response.statusText
  } catch {
    return response.statusText
  }
}

// All requests go through /api/backend proxy (same-origin → no CORS).
// The proxy attaches the auth cookie if present; public endpoints work without it.
async function authenticatedRequest<T>(path: string, options: RequestInit & { query?: Record<string, string | number | undefined | null> } = {}) {
  const url = new URL(`/api/backend${path}`, window.location.origin)
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value))
  })

  const { query: _query, headers, ...init } = options
  void _query
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status)
  }

  return (await response.json()) as T
}

export async function clientEnvelope<T>(path: string, init: RequestInit = {}) {
  const response = await authenticatedRequest<ApiEnvelope<T>>(path, init)
  return response.data
}

export async function clientPaginated<T>(path: string, page = 1, limit = 20) {
  return authenticatedRequest<PaginatedResponse<T>>(path, {
    query: { page, limit },
  })
}

export async function clientAction<T>(path: string, method: string, body?: unknown) {
  return clientEnvelope<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

// For public endpoints that don't require auth — still routes through the proxy
// to avoid CORS, but omits content-type for GET requests.
export async function clientPublicGet<T>(path: string, query?: Record<string, string | number | undefined | null>) {
  const response = await authenticatedRequest<ApiEnvelope<T>>(path, { query })
  return response.data
}
