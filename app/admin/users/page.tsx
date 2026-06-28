import { AdminUsersPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminUsersPage() {
  return <DashboardShell admin><AdminUsersPanel /></DashboardShell>
}
