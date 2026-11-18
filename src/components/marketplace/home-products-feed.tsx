'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Sparkles, Sprout, Filter, Phone, MapPin } from 'lucide-react'
import { Product } from '@/lib/types/database'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { ProductCard } from '@/components/marketplace/product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface HomeProductsFeedProps {
  initialProducts: Product[]
}

export function HomeProductsFeed({ initialProducts }: HomeProductsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter products: latest products are already first
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category check
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false
      }

      // Search query check (crop name, district, upazila, farmer name, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(q)
        const matchesDesc = product.description?.toLowerCase().includes(q)
        const matchesDistrict = product.district?.toLowerCase().includes(q)
        const matchesUpazila = product.upazila?.toLowerCase().includes(q)
        const matchesFarmer = product.farmer?.full_name?.toLowerCase().includes(q) || product.farmer_profile?.farm_name?.toLowerCase().includes(q)
        const matchesPhone = product.farmer?.phone?.includes(q)

        return matchesName || matchesDesc || matchesDistrict || matchesUpazila || matchesFarmer || matchesPhone
      }

      return true
    })
  }, [initialProducts, selectedCategory, searchQuery])

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>All Farm Products (সকল কৃষিপণ্য)</span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Latest First (নতুন আগে)
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing all {filteredProducts.length} verified listings directly from local farmers across Bangladesh.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, area, or farmer..."
              className="pl-10 h-10 text-xs rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌾 All Crops ({initialProducts.length})
          </button>

          {PRODUCT_CATEGORIES.map((cat) => {
            const count = initialProducts.filter(p => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Sprout className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No agricultural produce matched your search</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or select "All Crops" to view all available farm listings.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSelectedCategory('all'); setSearchQuery('') }}
            className="mt-2"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
