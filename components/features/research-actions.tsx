"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { clientAction, clientEnvelope } from "@/lib/client-api"

export function ResearchActions({
  researchId,
  isPrivate,
  citation,
}: {
  researchId: string
  isPrivate: boolean
  citation: string
}) {
  const trackedView = useRef(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (trackedView.current) return
    trackedView.current = true
    void clientAction<{ message: string }>(`/research/${researchId}/view`, "POST").catch(() => {})
  }, [researchId])

  function downloadPdf() {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        const { url } = await clientEnvelope<{ url: string }>(`/research/${researchId}/pdf`)
        setPdfUrl(url)
        void clientAction<{ message: string }>(`/research/${researchId}/download`, "POST").catch(() => {})
        window.open(url, "_blank", "noopener,noreferrer")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to open PDF")
      }
    })
  }

  function addToCollection() {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        const response = await clientAction<{ message: string }>("/collections", "POST", { researchId })
        setMessage(response.message)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to add to collection")
      }
    })
  }

  function cite() {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        void clientAction<{ message: string }>(`/research/${researchId}/cite`, "POST").catch(() => {})
        await navigator.clipboard.writeText(citation)
        setMessage("Citation copied")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to cite research")
      }
    })
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        {isPrivate ? (
          <Button asChild>
            <Link href={`/research/${researchId}/request-pdf`}>Request PDF</Link>
          </Button>
        ) : (
          <Button type="button" disabled={isPending} onClick={downloadPdf}>
            Download PDF
          </Button>
        )}
        <Button type="button" variant="outline" disabled={isPending} onClick={cite}>
          Cite
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={addToCollection}>
          Add to Collection
        </Button>
      </div>
      {message ? <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {pdfUrl && !isPrivate ? (
        <iframe
          className="mt-6 h-[640px] w-full rounded-2xl border bg-background"
          src={pdfUrl}
          title="Research PDF viewer"
        />
      ) : null}
    </>
  )
}
