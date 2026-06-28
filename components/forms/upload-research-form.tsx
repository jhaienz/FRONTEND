"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { clientAction } from "@/lib/client-api"

type CreatedResearch = { id: string }
type UploadUrl = { uploadUrl: string; key: string }

export function UploadResearchForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const file = form.get("file")
    setError(null)
    setMessage(null)

    if (!(file instanceof File) || file.type !== "application/pdf") {
      setError("Upload a PDF file.")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("PDF must be 50 MB or smaller.")
      return
    }

    startTransition(async () => {
      try {
        const authors = String(form.get("authors") ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((name) => ({ name }))

        const created = await clientAction<CreatedResearch>("/research", "POST", {
          title: form.get("title"),
          abstract: form.get("abstract"),
          publishDate: form.get("publishDate") || undefined,
          authors,
        })

        const upload = await clientAction<UploadUrl>(`/research/${created.id}/upload-url`, "POST", {
          filename: file.name,
          contentType: "application/pdf",
        })

        const r2Response = await fetch(upload.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": "application/pdf" },
        })

        if (!r2Response.ok) throw new Error("PDF upload to storage failed")

        await clientAction<{ message: string }>(`/research/${created.id}/confirm-upload`, "POST")

        setMessage("Research uploaded and submitted for approval.")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="grid gap-2 text-sm">Title<input name="title" required className="h-10 rounded-lg border bg-background px-3" /></label>
      <label className="grid gap-2 text-sm">Abstract<textarea name="abstract" required rows={6} className="rounded-lg border bg-background p-3" /></label>
      <label className="grid gap-2 text-sm">Publish Date<input name="publishDate" type="date" className="h-10 rounded-lg border bg-background px-3" /></label>
      <label className="grid gap-2 text-sm">Authors<textarea name="authors" required rows={4} placeholder="One author name per line" className="rounded-lg border bg-background p-3" /></label>
      <label className="grid gap-2 text-sm">PDF File<input name="file" type="file" accept="application/pdf" required className="rounded-lg border bg-background p-3" /></label>
      {message ? <p className="rounded-lg bg-secondary p-3 text-sm">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={isPending}>{isPending ? "Uploading..." : "Submit Research"}</Button>
    </form>
  )
}
