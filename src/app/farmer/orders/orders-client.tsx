'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Order } from '@/lib/types/database'
import { OrderStatus, ORDER_STATUS_DETAILS } from '@/lib/constants'
import { updateOrderStatus } from '@/lib/actions/orders'
import { formatDate } from '@/lib/utils'

interface FarmerOrdersClientProps {
  initialOrders: Order[]
}

export function FarmerOrdersClient({ initialOrders }: FarmerOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filter, setFilter] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await updateOrderStatus(orderId, newStatus)
      if (res.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'accepted', 'preparing', 'ready_for_delivery', 'delivered', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer capitalize ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.replace(/_/g, ' ')} ({tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length})
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <p className="text-sm font-bold text-slate-700">No orders found in this status category.</p>
          <p className="text-xs text-slate-400">Incoming buyer purchase requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((o) => {
            const statusInfo = ORDER_STATUS_DETAILS[o.status] || ORDER_STATUS_DETAILS.pending
            const isUpdating = updatingId === o.id

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
                    Placed: {formatDate(o.created_at)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Produce details */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Produce Ordered</span>
                    <h4 className="font-bold text-slate-900 text-sm">{o.product?.name || 'Agricultural Crop'}</h4>
                    <p className="text-slate-600">
                      Quantity: <strong>{o.quantity} {o.product?.unit || 'kg'}</strong>
                    </p>
                    <p className="text-emerald-700 font-extrabold text-sm">
                      Total: ৳{o.total_amount?.toLocaleString()} (৳{o.price_per_unit}/{o.product?.unit})
                    </p>
                  </div>

                  {/* Buyer & Contact */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Buyer Information</span>
                    <div className="font-bold text-slate-800">{o.buyer?.full_name || 'Verified Buyer'}</div>
                    {o.buyer?.phone && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{o.buyer.phone}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500">Payment: Cash On Delivery</div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Delivery Destination</span>
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{o.delivery_address || 'Address provided upon confirmation'}</span>
                    </div>
                    {o.buyer_note && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        Note: "{o.buyer_note}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Status Actions (স্ট্যাটাস পরিবর্তন):
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {o.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(o.id, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Accept Order (গ্রহণ করুন)</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(o.id, 'rejected')}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Decline (প্রত্যাখ্যান)</span>
                        </Button>
                      </>
                    )}

                    {o.status === 'accepted' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(o.id, 'preparing')}
                        className="font-bold"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Mark Preparing (প্যাকিং চলছে)</span>
                      </Button>
                    )}

                    {o.status === 'preparing' && (
                      <Button
                        variant="default"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(o.id, 'ready_for_delivery')}
                        className="bg-purple-600 hover:bg-purple-700 font-bold"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Ready for Delivery (ডেলিভারির জন্য প্রস্তুত)</span>
                      </Button>
                    )}

                    {o.status === 'ready_for_delivery' && (
                      <Button
                        variant="default"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(o.id, 'delivered')}
                        className="bg-emerald-700 hover:bg-emerald-800 font-bold"
                      >
                        <PackageCheck className="h-3.5 w-3.5" />
                        <span>Mark Delivered (সফলভাবে সম্পন্ন)</span>
                      </Button>
                    )}

                    {o.status === 'delivered' && (
                      <Badge variant="default" className="text-xs font-bold bg-emerald-600 text-white">
                        ✓ Completed & Paid
                      </Badge>
                    )}

                    {o.status === 'rejected' && (
                      <Badge variant="destructive" className="text-xs">
                        Declined
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
