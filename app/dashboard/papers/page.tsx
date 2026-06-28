import { MyPapersPanel } from "@/components/features/protected-panels"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function PapersPage() {
  return <DashboardShell><MyPapersPanel /></DashboardShell>
}
