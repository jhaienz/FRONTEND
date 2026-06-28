import type {
  ApiEnvelope,
  Author,
  Category,
  Keyword,
  PaginatedResponse,
  ResearchDetail,
  ResearchSummary,
  SearchSuggestions,
} from "@/types/api"

export const API_ROOT = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api`

type RequestOptions = RequestInit & {
  token?: string
  query?: Record<string, string | number | undefined | null>
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_ROOT}${path}`)

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(payload.message)) {
      return payload.message.join(" ")
    }
    return payload.message ?? response.statusText
  } catch {
    return response.statusText
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { token, query, headers, ...init } = options
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status)
  }

  return (await response.json()) as T
}

export async function getEnvelope<T>(path: string, options?: RequestOptions) {
  const response = await apiRequest<ApiEnvelope<T>>(path, options)
  return response.data
}

export async function getPaginated<T>(path: string, options?: RequestOptions) {
  return apiRequest<PaginatedResponse<T>>(path, options)
}

export async function getRecentResearch(limit = 6) {
  return getPaginated<ResearchSummary>("/research", {
    query: { page: 1, limit },
    next: { revalidate: 60 },
  })
}

export async function searchResearch(query: Record<string, string | number | undefined>) {
  return getPaginated<ResearchSummary>("/search", {
    query,
    cache: "no-store",
  })
}

export async function getResearch(id: string) {
  return getEnvelope<ResearchDetail>(`/research/${id}`, { cache: "no-store" })
}

export async function getCategories() {
  return getEnvelope<Category[]>("/categories", { next: { revalidate: 300 } })
}

export async function getCategory(id: string, page = 1) {
  return apiRequest<{ data: Category & { researches: ResearchSummary[] }; meta: PaginatedResponse<ResearchSummary>["meta"] }>(
    `/categories/${id}`,
    { query: { page, limit: 10 }, cache: "no-store" },
  )
}

export async function getKeywords() {
  return getEnvelope<Keyword[]>("/keywords", { next: { revalidate: 300 } })
}

export async function getAuthors(query: Record<string, string | number | undefined>) {
  return getPaginated<Author>("/authors", { query, cache: "no-store" })
}

export async function getAuthor(id: string) {
  return getEnvelope<Author>(`/authors/${id}`, { cache: "no-store" })
}

export async function getAuthorPapers(id: string, page = 1) {
  return getPaginated<ResearchSummary>(`/authors/${id}/papers`, {
    query: { page, limit: 10 },
    cache: "no-store",
  })
}

export async function getSuggestions(q: string) {
  return getEnvelope<SearchSuggestions>("/search/suggestions", {
    query: { q },
    cache: "no-store",
  })
}
