import { getBuyerOrders } from '@/lib/actions/orders'
import { BuyerOrdersClient } from './orders-client'

export default async function BuyerOrdersPage() {
  const orders = await getBuyerOrders()

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          My Order History & Tracking (আমার অর্ডার)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your active orders, delivery progress, and past agricultural purchases.
        </p>
      </div>

      <BuyerOrdersClient initialOrders={orders} />
    </div>
  )
}
