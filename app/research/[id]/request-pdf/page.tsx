import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { PdfRequestForm } from "@/components/forms/pdf-request-form"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { getResearch } from "@/lib/api"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function RequestPdfPage({ params }: PageProps) {
  const { id } = await params
  let research

  try {
    research = await getResearch(id)
  } catch {
    notFound()
  }

  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild>
          <Link href={`/research/${id}`}>
            <ArrowLeft className="size-4" /> Back to research
          </Link>
        </Button>
        <div className="mt-8 rounded-3xl border bg-card p-8">
          <h1 className="text-3xl font-semibold tracking-tight">Request whole PDF</h1>
          <p className="mt-3 text-muted-foreground">
            This sends your access request to the owner of “{research.title}”. Metadata remains public, but the PDF download URL is owner-controlled.
          </p>
          <div className="mt-8">
            <PdfRequestForm researchId={id} />
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
