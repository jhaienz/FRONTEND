"use client"

import Link from "next/link"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import type { ApiEnvelope } from "@/types/api"

type PdfRequestResponse = {
  id: string
  status: string
}

export function PdfRequestForm({ researchId }: { researchId: string }) {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setMessage(null)
    setError(null)

    startTransition(async () => {
      try {
        const response = await apiRequest<ApiEnvelope<PdfRequestResponse>>("/pdf-requests", {
          method: "POST",
          body: JSON.stringify({
            researchId,
            name: form.get("name"),
            email: form.get("email"),
            purpose: form.get("purpose"),
          }),
          cache: "no-store",
        })
        setMessage(`Request submitted. Status: ${response.data.status}.`)
        event.currentTarget.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to submit PDF request")
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Name
        <input name="name" required className="h-10 rounded-lg border bg-background px-3" />
      </label>
      <label className="grid gap-2 text-sm">
        Email
        <input name="email" type="email" required className="h-10 rounded-lg border bg-background px-3" />
      </label>
      <label className="grid gap-2 text-sm">
        Purpose
        <textarea name="purpose" rows={5} required className="rounded-lg border bg-background p-3" />
      </label>
      {message ? (
        <p className="rounded-lg bg-secondary p-3 text-sm">
          {message} <Link href={`/research/${researchId}`} className="font-medium underline">Back to research</Link>
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={isPending}>{isPending ? "Submitting..." : "Request whole PDF"}</Button>
    </form>
  )
}
