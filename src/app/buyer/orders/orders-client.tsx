'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Order } from '@/lib/types/database'
import { ORDER_STATUS_DETAILS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { cancelOrder } from '@/lib/actions/orders'

interface BuyerOrdersClientProps {
  initialOrders: Order[]
}

export function BuyerOrdersClient({ initialOrders }: BuyerOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this pending order?')) return
    setCancellingId(orderId)

    try {
      const res = await cancelOrder(orderId)
      if (res.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
        )
      } else {
        alert(res.error || 'Failed to cancel order.')
      }
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <p className="text-sm font-bold text-slate-700">You haven't placed any orders yet.</p>
          <p className="text-xs text-slate-400">Browse the marketplace to find fresh crops directly from farmers.</p>
        </div>
      ) : (
        orders.map((o) => {
          const statusInfo = ORDER_STATUS_DETAILS[o.status] || ORDER_STATUS_DETAILS.pending

          return (
            <div
              key={o.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">Order #{o.id}</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                    {statusInfo.en} ({statusInfo.bn})
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Ordered on {formatDate(o.created_at)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Product details */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Produce Item</span>
                  <h4 className="font-bold text-slate-900 text-sm">{o.product?.name || 'Produce'}</h4>
                  <p className="text-slate-600">
                    Quantity: <strong>{o.quantity} {o.product?.unit || 'kg'}</strong>
                  </p>
                  <p className="text-emerald-700 font-extrabold text-sm">
                    Total: ৳{o.total_amount?.toLocaleString()} (৳{o.price_per_unit}/{o.product?.unit})
                  </p>
                </div>

                {/* Farmer Contact */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Producer / Farmer</span>
                  <div className="font-bold text-slate-800">{o.farmer?.full_name || 'Verified Farmer'}</div>
                  <div className="text-slate-500">{o.farmer?.phone || '+880 1711-223344'}</div>
                  <div className="text-[11px] text-slate-400">Payment: Cash on Delivery</div>
                </div>

                {/* Delivery details */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Delivery Location</span>
                  <div className="flex items-start gap-1 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{o.delivery_address || 'Address registered on order'}</span>
                  </div>
                  {o.farmer_note && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mt-1">
                      Farmer note: "{o.farmer_note}"
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/buyer/orders/${o.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <span>Track Order Status (অর্ডার অগ্রগতি দেখুন)</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                {o.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cancellingId === o.id}
                    onClick={() => handleCancel(o.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    {cancellingId === o.id ? 'Cancelling...' : 'Cancel Request (অর্ডার বাতিল)'}
                  </Button>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
