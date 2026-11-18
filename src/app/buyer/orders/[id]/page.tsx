'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, XCircle, AlertCircle, Phone, MapPin, ShieldCheck, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ORDER_STATUS_DETAILS, OrderStatus } from '@/lib/constants'
import { INITIAL_ORDERS } from '@/lib/seed-data'
import { formatBDT, formatDate } from '@/lib/utils'
import { cancelOrder } from '@/lib/actions/orders'
import { toast } from 'sonner'

interface BuyerOrderDetailPageProps {
  params: Promise<{ id: string }>
}

const TIMELINE_STEPS: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'ready_for_delivery',
  'delivered'
]

export default function BuyerOrderDetailPage({ params }: BuyerOrderDetailPageProps) {
  const { id } = use(params)
  const order = INITIAL_ORDERS.find(o => o.id === id) || INITIAL_ORDERS[0]
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status as OrderStatus)
  const [cancelling, setCancelling] = useState(false)

  const statusInfo = ORDER_STATUS_DETAILS[currentStatus] || ORDER_STATUS_DETAILS.pending

  const currentStepIndex = TIMELINE_STEPS.indexOf(currentStatus)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    try {
      const res = await cancelOrder(order.id)
      if (res.success) {
        setCurrentStatus('cancelled')
        toast.success('Order cancelled successfully')
      } else {
        toast.error(res.error || 'Failed to cancel order')
      }
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/buyer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Orders (অর্ডার তালিকায় ফিরুন)</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                Order #{order.id}
              </h1>
              <Badge variant={statusInfo.badgeVariant} className="text-xs">
                {statusInfo.en} ({statusInfo.bn})
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {formatDate(order.created_at)} • Direct Farm Purchase
            </p>
          </div>

          {currentStatus === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              disabled={cancelling}
              onClick={handleCancel}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              {cancelling ? 'Cancelling...' : 'Cancel Request'}
            </Button>
          )}
        </div>
      </div>

      {/* Delivery Progress Tracker Stepper */}
      {currentStatus !== 'cancelled' && currentStatus !== 'rejected' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900">
            Fulfillment Progress (অর্ডার অগ্রগতি)
          </h2>

          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0 hidden sm:block" />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {TIMELINE_STEPS.map((step, idx) => {
                const stepDetails = ORDER_STATUS_DETAILS[step]
                const isPassed = currentStepIndex >= idx
                const isCurrent = currentStepIndex === idx

                return (
                  <div key={step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                          : isPassed
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                    </div>

                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {stepDetails.en}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {stepDetails.bn}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order Item & Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Crop details */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Purchased Harvest Item
            </h2>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shrink-0">
                🌾
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {order.product?.name || 'Aman Dhan (Miniket)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Category: {order.product?.category || 'Rice'} • Direct from field
                </p>
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="font-semibold text-slate-700">
                    Qty: <strong>{order.quantity} {order.product?.unit || 'kg'}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">
                    Rate: <strong>{formatBDT(order.price_per_unit)} / {order.product?.unit || 'kg'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Delivery Method</span>
              <span className="font-bold text-slate-800">Direct Farmer Farmgate Dispatch / Pickup</span>
            </div>
          </div>

          {/* Farmer Contact Info */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Farmer & Origin Information
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {order.farmer?.full_name?.charAt(0) || 'F'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{order.farmer?.full_name || 'Al-Amin Hossain'}</p>
                <p className="text-[11px] text-slate-500">{order.product?.farmer_profile?.farm_name || 'Golden Harvest Agro Farm'}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Region: Dinajpur, Rangpur Division</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Phone: +880 1712-345678</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Cash on Delivery Notice */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Payment Summary (মূল্য বিবরণ)
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({order.quantity} {order.product?.unit || 'kg'})</span>
                <span className="font-semibold text-slate-900">{formatBDT(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Commission</span>
                <span className="font-bold text-emerald-700">৳0 (Free Open Beta)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Middleman Markup</span>
                <span className="font-bold text-emerald-700">৳0 (Direct to Farmer)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Estimated Total</span>
                <span className="text-emerald-700 text-lg">{formatBDT(order.total_amount)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <span>Cash on Delivery / Offline Arrangement</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Payment is made directly to the farmer upon physical inspection and weight verification of the harvest at loading or delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
