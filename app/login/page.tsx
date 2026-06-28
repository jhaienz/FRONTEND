import Link from "next/link"
import { Suspense } from "react"

import { LoginForm } from "@/components/forms/login-form"
import { PublicShell } from "@/components/layout/public-shell"

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="mx-auto flex max-w-7xl justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access your dashboard, collections, uploads, and requests.</p>
          <div className="mt-6">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading sign in form...</div>}>
              <LoginForm />
            </Suspense>
          </div>
          <div className="mt-6 flex justify-between text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
            <Link href="/register" className="font-medium hover:text-primary">Register</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
