import { FarmerSidebar } from '@/components/farmer/farmer-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <FarmerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader role="farmer" />
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
