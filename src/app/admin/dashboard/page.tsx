import Link from 'next/link'
import {
  Users,
  Sprout,
  Package,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPlatformStats, getPendingFarmerVerifications } from '@/lib/actions/admin'

export default async function AdminDashboardPage() {
  const stats = await getPlatformStats()
  const pendingFarmers = await getPendingFarmerVerifications()

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Admin Control Center (অ্যাডমিন প্যানেল)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor marketplace transactions, verify farmer credentials, and supervise listings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Users</span>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-500">{stats.totalFarmers} Farmers • {stats.totalBuyers} Buyers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Active Listings</span>
          <div className="text-3xl font-extrabold text-emerald-700">{stats.activeProducts}</div>
          <p className="text-[11px] text-emerald-700">Verified agricultural stock</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Verifications</span>
          <div className="text-3xl font-extrabold text-amber-600">{stats.pendingVerifications}</div>
          <p className="text-[11px] text-slate-500">NID / land documents to review</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Platform GMV</span>
          <div className="text-3xl font-extrabold text-purple-700">৳{stats.totalGMV.toLocaleString()}</div>
          <p className="text-[11px] text-purple-700">Total trade value facilitated</p>
        </div>
      </div>

      {/* Pending Verifications Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Pending Farmer Verifications (অনুমোদনের অপেক্ষায় কৃষক)
          </h3>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href="/admin/farmers">Manage All</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Farm / Land</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">NID Reference</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingFarmers.map((f: any) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{f.profile?.full_name || 'Farmer'}</td>
                  <td className="py-3 px-4">{f.farm_name} ({f.land_size} Acres)</td>
                  <td className="py-3 px-4">{f.district}, {f.division}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{f.nid_number}</td>
                  <td className="py-3 px-4">
                    <Badge variant={f.verification_status === 'approved' ? 'default' : 'accent'} className="capitalize text-[10px]">
                      {f.verification_status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" asChild className="h-7 text-xs">
                      <Link href="/admin/farmers">Review</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
