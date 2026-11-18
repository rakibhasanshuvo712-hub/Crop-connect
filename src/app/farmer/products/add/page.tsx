'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, Check, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductCategory, PRODUCT_CATEGORIES, UNITS, UnitType, DIVISIONS, DISTRICTS, Division } from '@/lib/constants'
import { createProduct } from '@/lib/actions/products'
import { AICropClassifier } from '@/components/ai/ai-crop-classifier'
import { AIDescriptionGenerator } from '@/components/ai/ai-description-generator'

export default function AddProductPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('rice')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState<number>(500)
  const [unit, setUnit] = useState<UnitType>('kg')
  const [pricePerUnit, setPricePerUnit] = useState<number>(68)
  const [harvestDate, setHarvestDate] = useState('2026-11-15')
  const [division, setDivision] = useState<Division>('Rangpur')
  const [district, setDistrict] = useState('Dinajpur')
  const [upazila, setUpazila] = useState('Birol')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a crop title/name.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await createProduct({
        name,
        category,
        description,
        quantity: Number(quantity),
        unit,
        price_per_unit: Number(pricePerUnit),
        harvest_date: harvestDate,
        division,
        district,
        upazila,
        image_urls: imageUrl ? [imageUrl] : undefined
      })

      if (res.success) {
        router.push('/farmer/products')
      } else {
        setError(res.error || 'Failed to list product.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/farmer/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Products</span>
        </Link>
      </div>

      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Add New Agricultural Crop (নতুন ফসল যোগ করুন)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish your crop listing with direct farm gate pricing. Utilize AI tools for category detection and smart descriptions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: AI Agricultural Image Classifier */}
        <AICropClassifier
          onCategoryDetected={(cat) => setCategory(cat)}
          onImageUploaded={(url) => setImageUrl(url)}
        />

        {/* Step 2: Crop Basics */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Crop Details (ফসলের বিবরণ)</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Crop Name / Variety (ফসলের নাম ও জাত)</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Miniket Aman Rice (মিনিকেট চাল)"
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Category (ক্যাটাগরি)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs h-10 rounded-xl border border-slate-200 bg-white px-3"
              >
                {PRODUCT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.nameBn})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Harvest Date (ফসল তোলার তারিখ)</label>
              <Input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* Step 3: AI Product Description Assistant */}
        <AIDescriptionGenerator
          productName={name}
          category={category}
          quantity={quantity}
          unit={unit}
          district={district}
          harvestDate={harvestDate}
          onApply={(desc) => setDescription(desc)}
        />

        {/* Manual Description Text Area */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-xs">
          <label className="text-xs font-semibold text-slate-700 block">
            Product Description (বিস্তারিত বিবরণ)
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write quality details, organic certifications, storage conditions..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Step 4: Quantity & Pricing */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Stock & Pricing (মজুত ও মূল্য)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Available Quantity (পরিমাণ)</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="text-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Unit of Measurement (একক)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full text-xs h-10 rounded-xl border border-slate-200 bg-white px-3"
              >
                {UNITS.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Price per Unit (৳ প্রতি একক)</label>
              <Input
                type="number"
                min={1}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                required
                className="text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Location Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Geographic Location (উৎপাদনস্থল)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Division (বিভাগ)</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="w-full text-xs h-10 rounded-xl border border-slate-200 bg-white px-3"
              >
                {DIVISIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">District (জেলা)</label>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Upazila (উপজেলা)</label>
              <Input
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                required
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/farmer/products">Cancel</Link>
          </Button>
          <Button type="submit" variant="default" disabled={loading} className="font-bold px-8">
            {loading ? 'Publishing Crop...' : 'Publish Listing (পণ্য প্রকাশ করুন)'}
          </Button>
        </div>
      </form>
    </div>
  )
}
