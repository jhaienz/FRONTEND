import { AnalyticsPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminPage() {
  return <DashboardShell admin><AnalyticsPanel admin /></DashboardShell>
}
