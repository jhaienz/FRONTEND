"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { clientAction, clientEnvelope, clientPaginated } from "@/lib/client-api"
import type {
  AnalyticsOverview,
  AnalyticsPoint,
  Category,
  CollectionItem,
  Keyword,
  NotificationItem,
  PdfRequestItem,
  ResearchSummary,
  UserProfile,
} from "@/types/api"

function AuthNotice({ error }: { error: string | null }) {
  if (!error) return null
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      {error} <Link href="/login" className="font-medium underline">Sign in</Link>
    </div>
  )
}

function StatGrid({ overview }: { overview: AnalyticsOverview | null }) {
  const stats = [
    ["Papers", overview?.totalResearches],
    ["Views", overview?.totalViews],
    ["Downloads", overview?.totalDownloads],
    ["Citations", overview?.totalCitations],
    ...(overview?.totalUsers === undefined ? [] : [["Users", overview.totalUsers] as [string, number]]),
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map(([label, value]) => (
        <div key={label} className="rounded-2xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value ?? "--"}</p>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsPanel({ admin = false }: { admin?: boolean }) {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [trend, setTrend] = useState<AnalyticsPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const prefix = admin ? "/analytics/admin" : "/analytics/user"
    Promise.all([
      clientEnvelope<AnalyticsOverview>(`${prefix}/overview`),
      clientEnvelope<AnalyticsPoint[]>(`${prefix}/trends?period=weekly&metric=views`),
    ])
      .then(([nextOverview, nextTrend]) => {
        setOverview(nextOverview)
        setTrend(nextTrend)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load analytics"))
  }, [admin])

  return (
    <section className="rounded-3xl border bg-card p-8">
      <h1 className="text-3xl font-semibold tracking-tight">{admin ? "Admin Dashboard" : "User Dashboard"}</h1>
      <p className="mt-3 text-muted-foreground">Live analytics from the backend.</p>
      <div className="mt-8"><AuthNotice error={error} /></div>
      <div className="mt-6"><StatGrid overview={overview} /></div>
      <div className="mt-8 rounded-2xl border bg-background p-5">
        <h2 className="font-semibold">Weekly views</h2>
        <div className="mt-4 grid gap-2">
          {trend.map((point) => (
            <div key={point.date} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-sm">
              <span>{new Date(point.date).toLocaleDateString()}</span>
              <span className="font-medium">{point.count}</span>
            </div>
          ))}
          {!trend.length ? <p className="text-sm text-muted-foreground">No trend data yet.</p> : null}
        </div>
      </div>
    </section>
  )
}

export function MyPapersPanel() {
  const [papers, setPapers] = useState<ResearchSummary[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    clientPaginated<ResearchSummary>("/research/my")
      .then((response) => setPapers(response.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load papers"))
  }, [])

  return (
    <section className="rounded-3xl border bg-card p-8">
      <h1 className="text-3xl font-semibold tracking-tight">My Papers</h1>
      <div className="mt-6"><AuthNotice error={error} /></div>
      <div className="mt-6 overflow-hidden rounded-2xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50"><tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Privacy</th><th className="p-3">Views</th></tr></thead>
          <tbody>{papers.map((paper) => <tr key={paper.id} className="border-t"><td className="p-3 font-medium"><Link href={`/research/${paper.id}`}>{paper.title}</Link></td><td className="p-3">{paper.status}</td><td className="p-3">{paper.filePrivacy}</td><td className="p-3">{paper.viewCount ?? 0}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  )
}

export function CollectionsPanel() {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function load() {
    clientEnvelope<CollectionItem[]>("/collections")
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load collections"))
  }

  useEffect(load, [])

  function remove(researchId: string) {
    startTransition(async () => {
      await clientAction(`/collections/${researchId}`, "DELETE")
      load()
    })
  }

  return (
    <section className="rounded-3xl border bg-card p-8">
      <h1 className="text-3xl font-semibold tracking-tight">My Collections</h1>
      <div className="mt-6"><AuthNotice error={error} /></div>
      <div className="mt-6 grid gap-3">
        {items.map((item) => <div key={item.researchId} className="flex items-center justify-between gap-4 rounded-2xl border p-4"><Link href={`/research/${item.researchId}`} className="font-medium hover:text-primary">{item.research.title}</Link><Button variant="outline" disabled={isPending} onClick={() => remove(item.researchId)}>Remove</Button></div>)}
      </div>
    </section>
  )
}

export function NotificationsPanel() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function load() {
    clientPaginated<NotificationItem>("/notifications")
      .then((response) => setItems(response.data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load notifications"))
  }

  useEffect(load, [])

  return (
    <section className="rounded-3xl border bg-card p-8">
      <div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-semibold tracking-tight">Notifications</h1><Button disabled={isPending} onClick={() => startTransition(async () => { await clientAction("/notifications/read-all", "PATCH"); load() })}>Mark all read</Button></div>
      <div className="mt-6"><AuthNotice error={error} /></div>
      <div className="mt-6 grid gap-3">{items.map((item) => <div key={item.id} className="rounded-2xl border p-4"><p className={item.read ? "text-muted-foreground" : "font-medium"}>{item.message}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p></div>)}</div>
    </section>
  )
}

export function PdfRequestsPanel() {
  const [items, setItems] = useState<PdfRequestItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function load() {
    clientEnvelope<PdfRequestItem[]>("/pdf-requests/my")
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load PDF requests"))
  }

  useEffect(load, [])

  function decide(id: string, action: "approve" | "reject") {
    startTransition(async () => {
      await clientAction(`/pdf-requests/${id}/${action}`, "POST")
      load()
    })
  }

  return (
    <section className="rounded-3xl border bg-card p-8">
      <h1 className="text-3xl font-semibold tracking-tight">PDF Requests</h1>
      <div className="mt-6"><AuthNotice error={error} /></div>
      <div className="mt-6 grid gap-3">{items.map(({ request, research }) => <div key={request.id} className="rounded-2xl border p-4"><h2 className="font-medium">{research.title}</h2><p className="mt-1 text-sm text-muted-foreground">{request.requesterName} · {request.requesterEmail}</p><p className="mt-2 text-sm">{request.purpose}</p><div className="mt-4 flex gap-2"><Button disabled={isPending} onClick={() => decide(request.id, "approve")}>Approve</Button><Button variant="outline" disabled={isPending} onClick={() => decide(request.id, "reject")}>Reject</Button></div></div>)}</div>
    </section>
  )
}

export function SettingsPanel() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    clientEnvelope<UserProfile>("/users/me")
      .then(setProfile)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load profile"))
  }, [])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    startTransition(async () => {
      const updated = await clientAction<UserProfile>("/users/me", "PATCH", {
        firstName: form.get("firstName"),
        middleName: form.get("middleName") || null,
        lastName: form.get("lastName"),
        suffix: form.get("suffix") || null,
      })
      setProfile(updated)
      setMessage("Profile updated")
    })
  }

  return (
    <section className="rounded-3xl border bg-card p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
      <div className="mt-6"><AuthNotice error={error} /></div>
      {profile ? <form onSubmit={onSubmit} className="mt-6 grid max-w-2xl gap-4"><label className="grid gap-2 text-sm">First Name<input name="firstName" defaultValue={profile.firstName} className="h-10 rounded-lg border bg-background px-3" /></label><label className="grid gap-2 text-sm">Middle Name<input name="middleName" defaultValue={profile.middleName ?? ""} className="h-10 rounded-lg border bg-background px-3" /></label><label className="grid gap-2 text-sm">Last Name<input name="lastName" defaultValue={profile.lastName} className="h-10 rounded-lg border bg-background px-3" /></label><label className="grid gap-2 text-sm">Suffix<input name="suffix" defaultValue={profile.suffix ?? ""} className="h-10 rounded-lg border bg-background px-3" /></label>{message ? <p className="text-sm text-muted-foreground">{message}</p> : null}<Button disabled={isPending}>Save changes</Button></form> : null}
    </section>
  )
}

export function AdminUsersPanel() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { clientPaginated<UserProfile>("/users").then((response) => setUsers(response.data)).catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load users")) }, [])
  return <section className="rounded-3xl border bg-card p-8"><h1 className="text-3xl font-semibold tracking-tight">Manage Users</h1><div className="mt-6"><AuthNotice error={error} /></div><div className="mt-6 overflow-hidden rounded-2xl border"><table className="w-full text-left text-sm"><thead className="bg-muted/50"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="p-3">{user.firstName} {user.lastName}</td><td className="p-3">{user.email}</td><td className="p-3">{user.role}</td><td className="p-3">{user.status}</td></tr>)}</tbody></table></div></section>
}

export function AdminResearchPanel() {
  const [papers, setPapers] = useState<ResearchSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  function load() { clientPaginated<ResearchSummary>("/research/pending").then((response) => setPapers(response.data)).catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load pending research")) }
  useEffect(load, [])
  function decide(id: string, action: "approve" | "reject") { startTransition(async () => { await clientAction(`/research/${id}/${action}`, "PATCH", action === "reject" ? { reason: "Rejected by administrator." } : undefined); load() }) }
  return <section className="rounded-3xl border bg-card p-8"><h1 className="text-3xl font-semibold tracking-tight">Manage Research</h1><div className="mt-6"><AuthNotice error={error} /></div><div className="mt-6 grid gap-3">{papers.map((paper) => <div key={paper.id} className="rounded-2xl border p-4"><h2 className="font-medium">{paper.title}</h2><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{paper.abstract}</p><div className="mt-4 flex gap-2"><Button disabled={isPending} onClick={() => decide(paper.id, "approve")}>Approve</Button><Button variant="outline" disabled={isPending} onClick={() => decide(paper.id, "reject")}>Reject</Button></div></div>)}</div></section>
}

export function TaxonomyManager({ title, endpoint }: { title: string; endpoint: string }) {
  const [items, setItems] = useState<Array<Category | Keyword>>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  function load() { clientEnvelope<Array<Category | Keyword>>(endpoint).then(setItems).catch((err: unknown) => setError(err instanceof Error ? err.message : `Unable to load ${title}`)) }
  useEffect(load, [endpoint, title])
  function create(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const name = new FormData(event.currentTarget).get("name"); startTransition(async () => { await clientAction(endpoint, "POST", { name }); event.currentTarget.reset(); load() }) }
  function remove(id: string) { startTransition(async () => { await clientAction(`${endpoint}/${id}`, "DELETE"); load() }) }
  return <section className="rounded-3xl border bg-card p-8"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><div className="mt-6"><AuthNotice error={error} /></div><form onSubmit={create} className="mt-6 flex max-w-xl gap-2"><input name="name" required className="h-10 flex-1 rounded-lg border bg-background px-3" placeholder="Name" /><Button disabled={isPending}>Create</Button></form><div className="mt-6 grid gap-2">{items.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3"><span>{item.name}</span><Button variant="outline" disabled={isPending} onClick={() => remove(item.id)}>Delete</Button></div>)}</div></section>
}
