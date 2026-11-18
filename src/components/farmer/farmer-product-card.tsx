'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Edit3, Eye, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types/database'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { deleteProduct } from '@/lib/actions/products'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function FarmerProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)

  if (deleted) return null

  const category = PRODUCT_CATEGORIES.find(c => c.id === product.category)
  const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

  const isExpired = product.expiry_date ? new Date(product.expiry_date).getTime() < Date.now() : false

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      const res = await deleteProduct(product.id)
      if (res.success) {
        toast.success(`পণ্যটি সফলভাবে মুছে ফেলা হয়েছে ("${product.name}" deleted)`)
        setDeleted(true)
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to delete product')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred while deleting')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={`bg-white rounded-3xl border ${isExpired ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200/90'} overflow-hidden shadow-xs space-y-3 transition-all hover:shadow-sm`}>
      <div className="aspect-16/9 w-full bg-slate-100 relative">
        <img src={img} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant="default" className="text-xs bg-white/95 text-slate-900 font-bold backdrop-blur-xs">
            {category?.icon} {category?.name}
          </Badge>
          {isExpired ? (
            <Badge variant="destructive" className="text-[10px] bg-rose-600 text-white font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>মেয়াদ উত্তীর্ণ (Expired)</span>
            </Badge>
          ) : (
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="capitalize text-[10px]">
              {product.status}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h3>

        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-emerald-700 text-base">৳{product.price_per_unit} / {product.unit}</span>
          <span className="text-slate-500 font-medium">{product.quantity} {product.unit} in stock</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          <span>{product.upazila ? `${product.upazila}, ` : ''}{product.district || 'Dinajpur'}</span>
          {product.expiry_date && (
            <span className={`flex items-center gap-1 font-medium ${isExpired ? 'text-rose-600' : 'text-slate-500'}`}>
              <Clock className="h-3 w-3" />
              <span>মেয়াদ: {formatDate(product.expiry_date)}</span>
            </span>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <Link
            href={`/products/${product.id}`}
            className="text-xs text-slate-500 hover:text-slate-900 font-semibold inline-flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 text-xs font-bold text-emerald-800 border-emerald-200 hover:bg-emerald-50 px-2.5"
            >
              <Link href={`/farmer/products/edit/${product.id}`}>
                <Edit3 className="h-3 w-3 mr-1" />
                <span>Edit</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={deleting}
              onClick={handleDelete}
              className="h-7 text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50 px-2.5"
            >
              <Trash2 className="h-3 w-3 mr-1 text-rose-600" />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
