import Link from "next/link"
import { CalendarDays, Download, Eye } from "lucide-react"

import type { ResearchSummary } from "@/types/api"

function formatDate(value?: string | null) {
  if (!value) return "Undated"
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value))
}

function names(items?: Array<{ name: string }>) {
  if (!items?.length) return "Unknown authors"
  return items.map((item) => item.name).join(", ")
}

export function ResearchCard({ research }: { research: ResearchSummary }) {
  const category = research.categories?.[0]?.name ?? "Research"

  return (
    <Link
      href={`/research/${research.id}`}
      className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {category}
        </span>
        {research.rank ? <span className="text-xs text-muted-foreground">Rank {research.rank.toFixed(2)}</span> : null}
      </div>
      <h3 className="line-clamp-2 text-lg font-semibold tracking-tight group-hover:text-primary">
        {research.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{names(research.authors)}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{research.abstract ?? "No abstract provided."}</p>
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" /> {formatDate(research.publishDate ?? research.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye className="size-3.5" /> {research.viewCount ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <Download className="size-3.5" /> {research.downloadCount ?? 0}
        </span>
      </div>
    </Link>
  )
}
