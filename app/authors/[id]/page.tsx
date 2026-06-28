import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { ResearchCard } from "@/components/features/research-card"
import { Pagination } from "@/components/features/pagination"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { getAuthor, getAuthorPapers } from "@/lib/api"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AuthorProfilePage({ params, searchParams }: PageProps) {
  const [{ id }, raw] = await Promise.all([params, searchParams])
  const page = Number(Array.isArray(raw.page) ? raw.page[0] : (raw.page ?? 1))
  let author
  let papers

  try {
    ;[author, papers] = await Promise.all([getAuthor(id), getAuthorPapers(id, page)])
  } catch {
    notFound()
  }

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild>
          <Link href="/authors">
            <ArrowLeft className="size-4" /> Back to Authors
          </Link>
        </Button>
        <div className="mt-8 rounded-3xl border bg-card p-8">
          <h1 className="text-4xl font-semibold tracking-tight">{author.name}</h1>
          <p className="mt-3 text-muted-foreground">Email: {author.email ?? "Not listed"}</p>
          <p className="mt-1 text-muted-foreground">Papers: {author.paperCount ?? papers.meta.total}</p>
        </div>
        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Published Research</h2>
        <div className="mt-5 grid gap-4">
          {papers.data.map((paper) => (
            <ResearchCard key={paper.id} research={paper} />
          ))}
        </div>
        <Pagination page={papers.meta.page} totalPages={papers.meta.totalPages} getHref={(target) => `/authors/${id}?page=${target}`} />
      </section>
    </PublicShell>
  )
}
