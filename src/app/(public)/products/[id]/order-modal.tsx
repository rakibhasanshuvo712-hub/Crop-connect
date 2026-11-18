'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, CheckCircle2, RefreshCw, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/lib/types/database'
import { placeOrder } from '@/lib/actions/orders'

interface OrderModalProps {
  product: Product
}

export function OrderModal({ product }: OrderModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(10)
  const [address, setAddress] = useState('')
  const [buyerNote, setBuyerNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ orderId: string; total: number } | null>(null)

  const estimatedTotal = Number(quantity || 0) * product.price_per_unit

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) {
      setError('Please provide a delivery address or drop point.')
      return
    }
    if (quantity <= 0 || quantity > product.quantity) {
      setError(`Quantity must be between 1 and ${product.quantity} ${product.unit}.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await placeOrder({
        productId: product.id,
        quantity: Number(quantity),
        deliveryAddress: address,
        buyerNote: buyerNote || undefined
      })

      if (res.success) {
        setSuccessData({ orderId: res.orderId!, total: res.total || estimatedTotal })
      } else {
        setError(res.error || 'Failed to submit order.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="default"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full font-bold shadow-lg shadow-emerald-700/20 text-base"
      >
        <ShoppingBag className="h-5 w-5" />
        <span>Place Purchase Order (ক্রয়াদেশ দিন)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {successData ? 'Order Submitted Successfully' : 'Confirm Purchase Request'}
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSuccessData(null)
                  setError(null)
                }}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {successData ? (
              <div className="space-y-4 py-3 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">অর্ডার সফলভাবে প্রেরিত হয়েছে!</h4>
                  <p className="text-xs text-slate-500">
                    Order Reference ID: <strong className="text-slate-800">{successData.orderId}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ordered Produce:</span>
                    <span className="font-semibold">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Quantity:</span>
                    <span className="font-semibold">{quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-emerald-700 text-sm">
                    <span>Estimated Total:</span>
                    <span>৳{successData.total.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  কৃষক অর্ডারটি অনুমোদন (Accept) করলে আপনি নোটিফিকেশন পাবেন এবং ডেলিভারির পূর্বে যোগাযোগ করা হবে।
                </p>

                <div className="pt-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/buyer/orders')
                    }}
                  >
                    View My Orders
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/marketplace')
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Produce & Rate overview */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
                  <div className="text-slate-500">
                    Unit Price: <strong>৳{product.price_per_unit}</strong> per {product.unit}
                  </div>
                </div>

                {/* Quantity input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Quantity ({product.unit})</span>
                    <span className="text-slate-400">Max available: {product.quantity}</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    className="text-sm font-semibold"
                  />
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Delivery Address / Drop Point (ডেলিভারির ঠিকানা)
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Kawran Bazar Wholesale Shed #4, or House 12, Road 5, Uttara..."
                    required
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Buyer note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Special Instructions / Note (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={buyerNote}
                    onChange={(e) => setBuyerNote(e.target.value)}
                    placeholder="e.g. Morning delivery preferred, jute sack packaging"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Dynamic Price Summary */}
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">Estimated Total Price:</span>
                    <span className="text-[10px] text-emerald-800">Payment on Delivery</span>
                  </div>
                  <div className="text-xl font-extrabold text-emerald-800">
                    ৳{estimatedTotal.toLocaleString()}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  disabled={loading}
                  className="w-full font-bold gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <span>Confirm Order (অর্ডার নিশ্চিত করুন)</span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
