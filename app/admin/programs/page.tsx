import { TaxonomyManager } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminProgramsPage() {
  return <DashboardShell admin><TaxonomyManager title="Manage Programs" endpoint="/programs" /></DashboardShell>
}
