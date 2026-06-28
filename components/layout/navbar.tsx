import Link from "next/link"
import { BookOpen, Search } from "lucide-react"

import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/search", label: "Search" },
  { href: "/authors", label: "Authors" },
  { href: "/categories", label: "Categories" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          <span>NCF Research Nexus</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/search" aria-label="Search">
              <Search className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
