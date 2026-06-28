import { AdminResearchPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminResearchPage() {
  return <DashboardShell admin><AdminResearchPanel /></DashboardShell>
}
