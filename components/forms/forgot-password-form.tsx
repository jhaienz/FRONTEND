"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { clientAction } from "@/lib/client-api"

export function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function submit(path: string, body: unknown, onSuccess: (data: unknown) => void) {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        const data = await clientAction<unknown>(path, "POST", body)
        onSuccess(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed")
      }
    })
  }

  return (
    <div className="grid gap-4">
      {step === 1 ? (
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); submit("/auth/forgot-password", { email }, (data) => { setMessage((data as { message?: string }).message ?? "Check your email."); setStep(2) }) }}>
          <label className="grid gap-2 text-sm">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="h-10 rounded-lg border bg-background px-3" /></label>
          <Button disabled={isPending}>Send reset code</Button>
        </form>
      ) : null}
      {step === 2 ? (
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); const code = new FormData(event.currentTarget).get("code"); submit("/auth/verify-reset-code", { email, code }, (data) => { setResetToken((data as { resetToken: string }).resetToken); setStep(3) }) }}>
          <label className="grid gap-2 text-sm">6-digit code<input name="code" inputMode="numeric" required className="h-10 rounded-lg border bg-background px-3" /></label>
          <Button disabled={isPending}>Verify code</Button>
        </form>
      ) : null}
      {step === 3 ? (
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); const newPassword = new FormData(event.currentTarget).get("newPassword"); submit("/auth/reset-password", { token: resetToken, newPassword }, (data) => setMessage((data as { message?: string }).message ?? "Password reset successfully")) }}>
          <label className="grid gap-2 text-sm">New password<input name="newPassword" type="password" required minLength={8} className="h-10 rounded-lg border bg-background px-3" /></label>
          <Button disabled={isPending}>Reset password</Button>
        </form>
      ) : null}
      {message ? <p className="rounded-lg bg-secondary p-3 text-sm">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
