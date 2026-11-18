'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ShieldCheck, Scale, Calendar, Eye, ArrowUpRight } from 'lucide-react'
import { Product } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatBDT, formatDate } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const categoryInfo = PRODUCT_CATEGORIES.find(c => c.id === product.category)
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

  return (
    <Card className="group overflow-hidden border border-slate-200/90 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Category Tag */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
              <span>{categoryInfo?.icon || '📦'}</span>
              <span>{categoryInfo?.name || product.category}</span>
            </span>
          </div>

          {/* Verification Badge if farmer is verified */}
          {product.farmer_profile?.is_verified && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Farmer</span>
              </span>
            </div>
          )}

          {/* Stock remaining pill */}
          <div className="absolute bottom-2 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
              <Scale className="h-3 w-3" />
              <span>{product.quantity.toLocaleString()} {product.unit} available</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          {/* Location & Harvest */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
              <MapPin className="h-3 w-3 text-emerald-600" />
              <span>{product.district || 'Bangladesh'}, {product.division || ''}</span>
            </div>
            {product.harvest_date && (
              <span className="text-[11px] text-slate-400">
                Harvest: {formatDate(product.harvest_date)}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="font-bold text-base text-slate-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description || 'Fresh agricultural produce directly from registered farmer.'}
          </p>

          {/* Farmer credit */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-[10px] font-bold shrink-0">
              {product.farmer?.full_name?.charAt(0) || 'F'}
            </div>
            <div className="text-xs truncate">
              <span className="text-slate-500">Farmer: </span>
              <span className="font-semibold text-slate-800">{product.farmer_profile?.farm_name || product.farmer?.full_name || 'Verified Producer'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Order Action */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Direct Farm Price</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-extrabold text-emerald-700">৳{product.price_per_unit}</span>
            <span className="text-xs text-slate-500 font-medium">/{product.unit}</span>
          </div>
        </div>

        <Button variant="default" size="sm" asChild className="gap-1 rounded-xl">
          <Link href={`/products/${product.id}`}>
            <span>View & Order</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
