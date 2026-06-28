import { TaxonomyManager } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminInstitutionsPage() {
  return <DashboardShell admin><TaxonomyManager title="Manage Institutions" endpoint="/institutions" /></DashboardShell>
}
