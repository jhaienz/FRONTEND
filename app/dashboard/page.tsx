import { AnalyticsPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function DashboardPage() {
  return <DashboardShell><AnalyticsPanel /></DashboardShell>
}
