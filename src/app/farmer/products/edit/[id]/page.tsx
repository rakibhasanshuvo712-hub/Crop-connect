'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Sparkles, Upload, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_CATEGORIES, ProductCategory, UNITS, UnitType, DIVISIONS, Division, DISTRICTS, getUpazilasForDistrict } from '@/lib/constants'
import { updateProduct, deleteProduct } from '@/lib/actions/products'
import { INITIAL_PRODUCTS } from '@/lib/seed-data'
import { AIDescriptionGenerator } from '@/components/ai/ai-description-generator'
import { toast } from 'sonner'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const { id } = use(params)

  const existingProduct = INITIAL_PRODUCTS.find(p => p.id === id) || INITIAL_PRODUCTS[0]

  const [name, setName] = useState(existingProduct.name)
  const [category, setCategory] = useState<ProductCategory>(existingProduct.category as ProductCategory)
  const [description, setDescription] = useState(existingProduct.description || '')
  const [quantity, setQuantity] = useState(existingProduct.quantity)
  const [unit, setUnit] = useState<UnitType>(existingProduct.unit as UnitType)
  const [pricePerUnit, setPricePerUnit] = useState(existingProduct.price_per_unit)
  const [harvestDate, setHarvestDate] = useState(existingProduct.harvest_date || '')
  const [availabilityDate, setAvailabilityDate] = useState(existingProduct.availability_date || '')
  const [expiryDate, setExpiryDate] = useState(existingProduct.expiry_date || '')
  const [division, setDivision] = useState<Division>((existingProduct.division as Division) || 'Rangpur')
  const [district, setDistrict] = useState(existingProduct.district || 'Dinajpur')
  const [upazila, setUpazila] = useState(existingProduct.upazila || (getUpazilasForDistrict(existingProduct.district || 'Dinajpur')[0] || ''))
  const [imageUrl, setImageUrl] = useState(existingProduct.images?.[0]?.url || '')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await updateProduct(id, {
        name,
        category,
        description,
        quantity: Number(quantity),
        unit,
        price_per_unit: Number(pricePerUnit),
        harvest_date: harvestDate || undefined,
        availability_date: availabilityDate || undefined,
        expiry_date: expiryDate || undefined,
        division,
        district,
        upazila: upazila || undefined,
      })

      if (res.success) {
        toast.success('Product listing updated successfully! (ফসল হালনাগাদ সম্পন্ন)')
        router.push('/farmer/products')
      } else {
        toast.error(res.error || 'Failed to update product')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this produce listing?')) return
    setDeleting(true)
    try {
      const res = await deleteProduct(id)
      if (res.success) {
        toast.success('Product deleted')
        router.push('/farmer/products')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/farmer/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Products (আমার ফসলসমূহ)</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            Edit Harvest Listing (ফসল তথ্য সম্পাদনা)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update quantity, pricing, harvest date, and crop descriptions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          {deleting ? 'Deleting...' : 'Delete Listing'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Crop Classification & Name (ফসলের বিবরণ ও নাম)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Name (ফসলের নাম)</label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Miniket Rice / Diamond Potato"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category (ক্যাটাগরি)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({cat.nameBn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="font-bold text-slate-700 block mb-1 text-xs">
              Detailed Description (বিস্তারিত বিবরণ)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="pt-2">
              <AIDescriptionGenerator
                productName={name}
                category={category}
                quantity={quantity}
                unit={unit}
                district={district}
                harvestDate={harvestDate}
                onApply={(desc) => setDescription(desc)}
              />
            </div>
          </div>
        </div>

        {/* Quantity & Pricing */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Quantity & Pricing (পরিমাণ ও মূল্য)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Available Quantity (মজুদ পরিমাণ)</label>
              <Input
                required
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit of Measurement (একক)</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Price per Unit (৳ প্রতি একক মূল্য)</label>
              <Input
                required
                type="number"
                min="1"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Harvest Date & Location */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Harvest Date, Expiry & Location (তারিখ, মেয়াদ ও অবস্থান)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Harvest Date (ফসল তোলার তারিখ)</label>
              <Input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Expected Availability Till</label>
              <Input
                type="date"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Listing Expiry Date (মেয়াদ উত্তীর্ণের তারিখ)
              </label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                মেয়াদ শেষ হলে স্বয়ংক্রিয়ভাবে মার্কেটপ্লেস থেকে লুকানো হবে
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Division (বিভাগ)</label>
              <select
                value={division}
                onChange={(e) => {
                  const div = e.target.value as Division
                  setDivision(div)
                  const dists = DISTRICTS[div] || []
                  const firstDist = dists[0] || 'Dinajpur'
                  setDistrict(firstDist)
                  const upzs = getUpazilasForDistrict(firstDist)
                  setUpazila(upzs[0] || '')
                }}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">District (জেলা)</label>
              <select
                value={district}
                onChange={(e) => {
                  const dist = e.target.value
                  setDistrict(dist)
                  const upzs = getUpazilasForDistrict(dist)
                  setUpazila(upzs[0] || '')
                }}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DISTRICTS[division]?.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Upazila (উপজেলা)</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {getUpazilasForDistrict(district).map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {loading ? 'Saving Changes...' : 'Save & Update Listing'}
          </Button>
        </div>
      </form>
    </div>
  )
}
