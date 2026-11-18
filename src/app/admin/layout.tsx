import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader role="admin" />
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
