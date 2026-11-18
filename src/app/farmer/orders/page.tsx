import { getFarmerOrders } from '@/lib/actions/orders'
import { FarmerOrdersClient } from './orders-client'

export default async function FarmerOrdersPage() {
  const orders = await getFarmerOrders()

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Buyer Purchase Orders (ক্রেতার ক্রয়াদেশ)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review incoming purchase requests, accept or reject orders, and update delivery progress.
        </p>
      </div>

      <FarmerOrdersClient initialOrders={orders} />
    </div>
  )
}
