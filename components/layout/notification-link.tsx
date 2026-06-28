"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { clientEnvelope } from "@/lib/client-api"

export function NotificationLink() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    clientEnvelope<{ count: number }>("/notifications/unread-count")
      .then((data) => setCount(data.count))
      .catch(() => {})
  }, [])

  return (
    <Link href="/dashboard/notifications" className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
      <span>Notifications</span>
      {count != null && count > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
