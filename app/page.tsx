import { ArrowRight, Library, Search, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { ResearchCard } from "@/components/features/research-card"
import { SearchForm } from "@/components/forms/search-form"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { getRecentResearch } from "@/lib/api"
import type { ResearchSummary } from "@/types/api"

const featureCards = [
  { title: "Search", body: "PostgreSQL full-text search with filters and pagination", icon: Search },
  { title: "Collections", body: "Save useful papers after signing in", icon: Library },
]

async function loadRecentResearch() {
  try {
    return await getRecentResearch(6)
  } catch {
    return { data: [] as ResearchSummary[], meta: { total: 0, page: 1, totalPages: 0 } }
  }
}

export default async function Page() {
  const recent = await loadRecentResearch()

  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--muted),transparent_35%),linear-gradient(135deg,transparent,rgba(0,0,0,0.04))]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Backend-ready academic repository
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Discover, request, and cite NCF research without the old file bottlenecks.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Search approved papers by title, author, category, or keyword. Public PDFs open through presigned links, while private files use the request workflow.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchForm />
            </div>
          </div>

          <div className="grid content-center gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {featureCards.map(({ title, body, icon: Icon }) => (
              <div key={title} className="rounded-3xl border bg-card p-6 shadow-sm">
                <Icon className="mb-6 size-7 text-primary" />
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent / Featured Research</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Browse the latest approved papers</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/search">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {recent.data.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recent.data.map((research) => (
              <ResearchCard key={research.id} research={research} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
            No approved research is available yet. Start the backend and seed data to populate this section.
          </div>
        )}
      </section>
    </PublicShell>
  )
}
