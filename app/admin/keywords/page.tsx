import { TaxonomyManager } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminKeywordsPage() {
  return <DashboardShell admin><TaxonomyManager title="Manage Keywords" endpoint="/keywords" /></DashboardShell>
}
