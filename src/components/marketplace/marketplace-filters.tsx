'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Filter, X, Search, RotateCcw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PRODUCT_CATEGORIES, DIVISIONS, DISTRICTS, Division } from '@/lib/constants'

export function MarketplaceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || 'all'
  const currentDivision = (searchParams.get('division') || 'all') as Division | 'all'
  const currentDistrict = searchParams.get('district') || 'all'
  const currentSearch = searchParams.get('search') || ''
  const currentSort = searchParams.get('sortBy') || 'latest'
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const [search, setSearch] = useState(currentSearch)
  const [division, setDivision] = useState(currentDivision)
  const [district, setDistrict] = useState(currentDistrict)
  const [minPrice, setMinPrice] = useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice)
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const handleApply = (newParams?: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newParams) {
      Object.entries(newParams).forEach(([k, v]) => {
        if (v && v !== 'all') params.set(k, v)
        else params.delete(k)
      })
    } else {
      if (search) params.set('search', search)
      else params.delete('search')

      if (division && division !== 'all') params.set('division', division)
      else params.delete('division')

      if (district && district !== 'all') params.set('district', district)
      else params.delete('district')

      if (minPrice) params.set('minPrice', minPrice)
      else params.delete('minPrice')

      if (maxPrice) params.set('maxPrice', maxPrice)
      else params.delete('maxPrice')
    }

    router.push(`/marketplace?${params.toString()}`)
  }

  const handleCategoryClick = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (catId === 'all') params.delete('category')
    else params.set('category', catId)
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch('')
    setDivision('all')
    setDistrict('all')
    setMinPrice('')
    setMaxPrice('')
    router.push('/marketplace')
  }

  const availableDistricts = division !== 'all' ? DISTRICTS[division as Division] || [] : []

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center gap-2 text-left cursor-pointer lg:cursor-default w-full justify-between lg:justify-start"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Filters & Sorting (ফিল্টার)</h3>
            {(currentCategory !== 'all' || currentDivision !== 'all' || currentSearch || currentMinPrice || currentMaxPrice) && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold lg:hidden">
            <span>{mobileExpanded ? 'Hide' : 'Show'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <button
          onClick={handleReset}
          className="hidden lg:flex text-xs text-slate-500 hover:text-emerald-700 items-center gap-1 cursor-pointer shrink-0"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className={`${mobileExpanded ? 'block' : 'hidden lg:block'} space-y-6 pt-4`}>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Search Crop / Produce</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="e.g. Miniket, Potato, Onion..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Categories Horizontal / Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Product Category</label>
        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              currentCategory === 'all'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories (সকল পণ্য)</span>
          </button>
          {PRODUCT_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(c.id)}
              className={`text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                currentCategory === c.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </span>
              <span className="text-[10px] opacity-75">{c.nameBn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Division Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Division (বিভাগ)</label>
        <select
          value={division}
          onChange={(e) => {
            setDivision(e.target.value as any)
            setDistrict('all')
          }}
          className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="all">All Divisions (সমগ্র বাংলাদেশ)</option>
          {DIVISIONS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* District Selector */}
      {availableDistricts.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">District (জেলা)</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Districts in {division}</option>
            {availableDistricts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Price Range (৳/unit)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min ৳"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="text-xs"
          />
          <Input
            type="number"
            placeholder="Max ৳"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Sort By</label>
        <select
          value={currentSort}
          onChange={(e) => handleApply({ sortBy: e.target.value })}
          className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="latest">Latest Listings (নতুন ফসল)</option>
          <option value="price_asc">Price: Low to High (কম দাম)</option>
          <option value="price_desc">Price: High to Low (বেশি দাম)</option>
          <option value="popular">Most Viewed (জনপ্রিয়)</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="lg:hidden w-1/3 text-xs"
        >
          Reset
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => { handleApply(); setMobileExpanded(false); }}
          className="w-full flex-1"
        >
          Apply Filters (ফিল্টার প্রয়োগ)
        </Button>
      </div>
      </div>
    </div>
  )
}
