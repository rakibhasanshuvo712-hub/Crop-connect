import { BuyerSidebar } from '@/components/buyer/buyer-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <BuyerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader role="buyer" />
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
