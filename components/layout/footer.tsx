import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 Naga College Foundation Research Nexus.</p>
        <div className="flex gap-4">
          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>
          <Link href="/authors" className="hover:text-foreground">
            Authors
          </Link>
          <Link href="/categories" className="hover:text-foreground">
            Categories
          </Link>
        </div>
      </div>
    </footer>
  )
}
