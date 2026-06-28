export function DashboardPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-3xl border bg-card p-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {['Total Papers', 'Views', 'Downloads'].map((label) => (
          <div key={label} className="rounded-2xl border bg-background p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">--</p>
          </div>
        ))}
      </div>
    </section>
  )
}
