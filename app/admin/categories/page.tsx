import { TaxonomyManager } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminCategoriesPage() {
  return <DashboardShell admin><TaxonomyManager title="Manage Categories" endpoint="/categories" /></DashboardShell>
}
