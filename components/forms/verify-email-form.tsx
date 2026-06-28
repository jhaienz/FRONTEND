"use client"

import Link from "next/link"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import type { ApiEnvelope } from "@/types/api"

type VerifyEmailFormProps = {
  initialEmail: string
}

export function VerifyEmailForm({ initialEmail }: VerifyEmailFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, startVerifyTransition] = useTransition()
  const [isResending, startResendTransition] = useTransition()

  function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    startVerifyTransition(async () => {
      try {
        const response = await apiRequest<ApiEnvelope<{ message: string }>>("/auth/verify-email", {
          method: "POST",
          body: JSON.stringify({ email, code }),
        })
        setMessage(response.data.message)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify email")
      }
    })
  }

  function onResend() {
    setError(null)
    setMessage(null)

    startResendTransition(async () => {
      try {
        const response = await apiRequest<ApiEnvelope<{ message: string }>>("/auth/resend-verification-code", {
          method: "POST",
          body: JSON.stringify({ email }),
        })
        setMessage(response.data.message)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to resend code")
      }
    })
  }

  return (
    <form onSubmit={onVerify} className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 rounded-lg border bg-background px-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Verification Code
        <input
          name="code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          required
          minLength={6}
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className="h-12 rounded-lg border bg-background px-3 text-center text-lg tracking-[0.35em]"
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? (
        <p className="rounded-lg bg-secondary p-3 text-sm">
          {message} <Link href="/login" className="font-medium underline">Sign in</Link>
        </p>
      ) : null}
      <Button type="submit" disabled={isVerifying || isResending}>
        {isVerifying ? "Verifying..." : "Verify Email"}
      </Button>
      <button
        type="button"
        onClick={onResend}
        disabled={isVerifying || isResending || !email}
        className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        {isResending ? "Sending..." : "Resend code"}
      </button>
    </form>
  )
}
