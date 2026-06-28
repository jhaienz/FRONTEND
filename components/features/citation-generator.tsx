"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type CitationData = {
  authors: string
  year: string
  title: string
}

function formatCitation(data: CitationData, format: string): string {
  const { authors, year, title } = data
  switch (format) {
    case "MLA":
      return `${authors}. "${title}." ${year}.`
    case "Chicago":
      return `${authors}. ${year}. "${title}."`
    case "IEEE":
      return `${authors}, "${title}," ${year}.`
    default: // APA
      return `${authors}. (${year}). ${title}.`
  }
}

export function CitationGenerator({ authors, year, title }: CitationData) {
  const [format, setFormat] = useState("APA")
  const [copied, setCopied] = useState(false)

  const citation = formatCitation({ authors, year, title }, format)

  function copy() {
    void navigator.clipboard.writeText(citation).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="h-10 rounded-lg border bg-background px-3"
      >
        <option>APA</option>
        <option>MLA</option>
        <option>Chicago</option>
        <option>IEEE</option>
      </select>
      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        {citation}
      </div>
      <Button variant="outline" onClick={copy}>
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}
