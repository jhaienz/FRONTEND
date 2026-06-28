"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { clientAction, clientPublicGet } from "@/lib/client-api"
import type { Category } from "@/types/api"

type Option = Pick<Category, "id" | "name">

export function RegisterForm() {
  const router = useRouter()
  const [institutions, setInstitutions] = useState<Option[]>([])
  const [programs, setPrograms] = useState<Option[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    Promise.all([clientPublicGet<Option[]>("/institutions"), clientPublicGet<Option[]>("/programs")])
      .then(([nextInstitutions, nextPrograms]) => {
        setInstitutions(nextInstitutions)
        setPrograms(nextPrograms)
      })
      .catch(() => {})
  }, [])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    startTransition(async () => {
      try {
        const email = String(form.get("email") ?? "")
        const payload = {
          email,
          password,
          firstName: form.get("firstName"),
          middleName: form.get("middleName") || undefined,
          lastName: form.get("lastName"),
          suffix: form.get("suffix") || undefined,
          institutionId: form.get("institutionId") || undefined,
          programId: form.get("programId") || undefined,
        }
        const response = await clientAction<{ message: string }>("/auth/register", "POST", payload)
        setMessage(response.message)
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to register")
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">First Name<input name="firstName" required className="h-10 rounded-lg border bg-background px-3" /></label>
        <label className="grid gap-2 text-sm">Last Name<input name="lastName" required className="h-10 rounded-lg border bg-background px-3" /></label>
        <label className="grid gap-2 text-sm">Middle Name<input name="middleName" className="h-10 rounded-lg border bg-background px-3" /></label>
        <label className="grid gap-2 text-sm">Suffix<input name="suffix" className="h-10 rounded-lg border bg-background px-3" /></label>
      </div>
      <label className="grid gap-2 text-sm">Email<input name="email" type="email" required className="h-10 rounded-lg border bg-background px-3" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">Password<input name="password" type="password" required minLength={8} className="h-10 rounded-lg border bg-background px-3" /></label>
        <label className="grid gap-2 text-sm">Confirm<input name="confirmPassword" type="password" required minLength={8} className="h-10 rounded-lg border bg-background px-3" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Institution
          <select name="institutionId" className="h-10 rounded-lg border bg-background px-3">
            <option value="">External / not listed</option>
            {institutions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Program
          <select name="programId" className="h-10 rounded-lg border bg-background px-3">
            <option value="">Not applicable</option>
            {programs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="rounded-lg bg-secondary p-3 text-sm">{message} <Link href="/login" className="font-medium underline">Sign in</Link></p> : null}
      <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Account"}</Button>
    </form>
  )
}
