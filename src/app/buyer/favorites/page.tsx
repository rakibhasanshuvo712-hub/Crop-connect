import Link from 'next/link'
import { Heart, Store, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { INITIAL_PRODUCTS } from '@/lib/seed-data'
import { ProductCard } from '@/components/marketplace/product-card'

export default function BuyerFavoritesPage() {
  const favoriteProducts = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]]

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Saved Products & Verified Farmers (সংরক্ষিত ফসল)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quickly re-order from your preferred agricultural producers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
