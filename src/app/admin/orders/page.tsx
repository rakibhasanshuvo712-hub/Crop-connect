import { getFarmerOrders } from '@/lib/actions/orders'
import { ORDER_STATUS_DETAILS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export default async function AdminOrdersPage() {
  const orders = await getFarmerOrders()

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Platform Transactions & Order Monitoring (লেনদেন নিরীক্ষা)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete audit log of all trade orders placed across Bangladesh on CropConnect.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Produce</th>
              <th className="py-3 px-4">Farmer</th>
              <th className="py-3 px-4">Buyer</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => {
              const statusInfo = ORDER_STATUS_DETAILS[o.status] || ORDER_STATUS_DETAILS.pending
              return (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold">{o.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{o.product?.name || 'Produce'}</td>
                  <td className="py-3 px-4">{o.farmer?.full_name || 'Farmer'}</td>
                  <td className="py-3 px-4">{o.buyer?.full_name || 'Buyer'}</td>
                  <td className="py-3 px-4">{o.quantity} {o.product?.unit || 'kg'}</td>
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
  )
}
