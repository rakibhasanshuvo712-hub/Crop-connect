'use client'

import { useState } from 'react'
import { Sparkles, MapPin, Scale, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ProductCategory, PRODUCT_CATEGORIES, DIVISIONS, Division } from '@/lib/constants'
import { getSmartMatches } from '@/lib/actions/ai'
import { INITIAL_PRODUCTS } from '@/lib/actions/products'
import Link from 'next/link'

export function SmartMatchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<ProductCategory>('rice')
  const [quantity, setQuantity] = useState(500)
  const [maxPrice, setMaxPrice] = useState(75)
  const [division, setDivision] = useState<Division | 'all'>('Rangpur')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<Array<{ product: any; matchScore: number; matchReasons: string[] }>>([])
  const [searched, setSearched] = useState(false)

  const handleMatch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const results = await getSmartMatches(
        {
          category,
          quantity: Number(quantity),
          maxPrice: Number(maxPrice),
          division: division !== 'all' ? division : undefined
        },
        INITIAL_PRODUCTS
      )
      setMatches(results)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="accent"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-1.5 shadow-md font-bold"
      >
        <Sparkles className="h-4 w-4" />
        <span>Smart Match AI (স্মার্ট সংযোগ)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">AI Buyer-Farmer Smart Matching</h3>
                  <p className="text-xs text-slate-500">আপনার ক্রয় চাহিদা অনুযায়ী সরাসরি সেরা ভেরিফাইড কৃষকদের খুঁজুন</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Criteria Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Crop Category (ফসলের ধরন)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-2.5"
                >
                  {PRODUCT_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.nameBn})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Preferred Division (কাঙ্ক্ষিত বিভাগ)</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-2.5"
                >
                  <option value="all">Any Division (যে কোনো বিভাগ)</option>
                  {DIVISIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Required Quantity (পরিমাণ)</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="e.g. 500"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Max Budget (সর্বোচ্চ বাজেট ৳/একক)</label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="e.g. 75"
                  className="text-xs h-9"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button
                  variant="default"
                  size="default"
                  onClick={handleMatch}
                  disabled={loading}
                  className="w-full font-bold gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Find Smart Matches (কৃষক ম্যাচ করুন)</span>
                </Button>
              </div>
            </div>

            {/* Match Results */}
            {searched && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recommended Matches ({matches.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">Sorted by AI Match Score</span>
                </div>

                {matches.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-sm font-semibold text-slate-600">No exact matches found for this specific combination.</p>
                    <p className="text-xs text-slate-400 mt-1">Try expanding budget or selecting 'Any Division'.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/40 via-white to-white hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{item.product.name}</span>
                            <Badge variant="success" className="text-xs font-bold">
                              {item.matchScore}% Match
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-emerald-800">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                              {item.product.district}, {item.product.division}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-slate-800">৳{item.product.price_per_unit}/{item.product.unit}</span>
                            <span>•</span>
                            <span>{item.product.quantity} {item.product.unit} in stock</span>
                          </div>

                          {/* Reasons list */}
                          <div className="space-y-1 pt-1">
                            {item.matchReasons.map((r, rIdx) => (
                              <div key={rIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button variant="default" size="sm" asChild className="shrink-0 gap-1 rounded-xl">
                          <Link href={`/products/${item.product.id}`} onClick={() => setIsOpen(false)}>
                            <span>View & Order</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
