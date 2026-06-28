import { SettingsPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function SettingsPage() {
  return <DashboardShell><SettingsPanel /></DashboardShell>
}
