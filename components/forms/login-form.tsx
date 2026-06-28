"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import type { ApiEnvelope, LoginResponse } from "@/types/api"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError(null)

    startTransition(async () => {
      try {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
          cache: "no-store",
        })

        if (!loginResponse.ok) {
          const payload = (await loginResponse.json()) as { message?: string }
          throw new ApiError(payload.message ?? "Unable to sign in", loginResponse.status)
        }

        const response = (await loginResponse.json()) as ApiEnvelope<LoginResponse>
        const next = searchParams.get("next")
        const fallback = response.data.user.role === "admin" ? "/admin" : "/dashboard"
        router.push(next?.startsWith("/") && !next.startsWith("//") ? next : fallback)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to sign in")
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Email
        <input name="email" type="email" required className="h-10 rounded-lg border bg-background px-3" />
      </label>
      <label className="grid gap-2 text-sm">
        Password
        <input name="password" type="password" required className="h-10 rounded-lg border bg-background px-3" />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={isPending}>{isPending ? "Signing in..." : "Sign In"}</Button>
    </form>
  )
}
