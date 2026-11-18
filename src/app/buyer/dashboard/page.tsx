import Link from 'next/link'
import { ShoppingBag, Truck, CheckCircle2, Heart, ArrowRight, Store, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBuyerOrders } from '@/lib/actions/orders'
import { ORDER_STATUS_DETAILS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { SmartMatchModal } from '@/components/ai/smart-match-modal'

export default async function BuyerDashboardPage() {
  const orders = await getBuyerOrders()
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'rejected')
  const completedOrders = orders.filter(o => o.status === 'delivered')
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0) + 32000

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Buyer Dashboard (ক্রেতা ড্যাশবোর্ড)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active agricultural orders, manage farm purchases, and find verified produce.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SmartMatchModal />
          <Button variant="default" size="sm" asChild className="gap-1 font-bold">
            <Link href="/marketplace">
              <Store className="h-4 w-4" />
              <span>Browse Marketplace</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active In-Transit Orders</span>
            <Truck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{activeOrders.length}</div>
          <p className="text-[11px] text-slate-400">Processing or out for delivery</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Completed Orders</span>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{completedOrders.length}</div>
          <p className="text-[11px] text-slate-400">Delivered & verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Farm Purchases</span>
            <ShoppingBag className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">৳{totalSpent.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Estimated 20% saved vs middlemen</p>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Recent Purchase Orders (সাম্প্রতিক অর্ডার)</h3>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href="/buyer/orders">View Order History</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Produce</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((o) => {
                const statusInfo = ORDER_STATUS_DETAILS[o.status] || ORDER_STATUS_DETAILS.pending
                return (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{o.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{o.product?.name || 'Agricultural Produce'}</td>
                    <td className="py-3 px-4 text-slate-600">{o.farmer?.full_name || 'Verified Farmer'}</td>
                    <td className="py-3 px-4 font-medium">{o.quantity} {o.product?.unit || 'kg'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">৳{o.total_amount?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusInfo.color}`}>
                        {statusInfo.en}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(o.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
