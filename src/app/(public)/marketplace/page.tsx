import { Suspense } from 'react'
import { getProducts } from '@/lib/actions/products'
import { ProductCard } from '@/components/marketplace/product-card'
import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters'
import { SmartMatchModal } from '@/components/ai/smart-match-modal'
import { ShoppingBag, PackageOpen, Sparkles } from 'lucide-react'

interface MarketplacePageProps {
  searchParams: Promise<{
    category?: string
    district?: string
    division?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
  }>
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolvedParams = await searchParams

  const { products, count } = await getProducts({
    category: resolvedParams.category,
    district: resolvedParams.district,
    division: resolvedParams.division,
    search: resolvedParams.search,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    sortBy: resolvedParams.sortBy
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <ShoppingBag className="h-4 w-4" />
            <span>National Agricultural Marketplace (জাতীয় কৃষি বাজার)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Browse Harvests & Agricultural Produce
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-900">{count}</strong> active crop listings from verified farmers across Bangladesh
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SmartMatchModal />
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />}>
            <MarketplaceFilters />
          </Suspense>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <PackageOpen className="h-16 w-16 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">কোনো ফসল পাওয়া যায়নি (No Produce Found)</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  আপনার নির্বাচিত ফিল্টার বা অনুসন্ধানের সাথে মিল রেখে কোনো ফসল পাওয়া যায়নি। অন্য ক্যাটাগরি বা জেলা নির্বাচন করে পুনরায় অনুসন্ধান করুন।
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
