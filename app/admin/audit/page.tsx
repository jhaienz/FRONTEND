import { AuditLogPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminAuditPage() {
  return <DashboardShell admin><AuditLogPanel /></DashboardShell>
}
