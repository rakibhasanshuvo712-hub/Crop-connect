import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Scale,
  ShieldCheck,
  User,
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  ArrowLeft,
  Truck,
  Sparkles,
  Info,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { getProductById } from '@/lib/actions/products'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatBDT, formatDate } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { OrderModal } from './order-modal'
import { CropLocationMap } from '@/components/location/crop-location-map'
import { InquiryModal } from '@/components/marketplace/inquiry-modal'
import { ReportListingModal } from '@/components/marketplace/report-listing-modal'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
    return null
  }

  const categoryInfo = PRODUCT_CATEGORIES.find(c => c.id === product.category)
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace (বাজারে ফিরুন)</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Product Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-md">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
                <span>{categoryInfo?.icon}</span>
                <span>{categoryInfo?.name}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs">
                Active Crop
              </span>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{product.upazila ? `${product.upazila}, ` : ''}{product.district || 'Bangladesh'}, {product.division}</span>
                </span>
                {product.harvest_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Harvest Date: {formatDate(product.harvest_date)}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Listed: {formatDate(product.created_at)}</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Crop Description & Quality Details (বিবরণ)</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {product.description || 'Fresh agricultural harvest direct from farmer.'}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block">Available Stock</span>
                <span className="text-base font-bold text-slate-900">{product.quantity.toLocaleString()} {product.unit}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block">Unit Price</span>
                <span className="text-base font-bold text-emerald-700">৳{product.price_per_unit} / {product.unit}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block">Payment Method</span>
                <span className="text-xs font-bold text-slate-800">Cash on Delivery</span>
              </div>
            </div>

            {/* Location & Map info with Leaflet / OpenStreetMap */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Harvest Regional Origin (ফসল সংগ্রহের এলাকা)</span>
              </h3>
              <CropLocationMap
                district={product.district}
                division={product.division}
                upazila={product.upazila}
                title={product.name}
                height="220px"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Action & Farmer Profile */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Placement Action Box */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Farm Gate Asking Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-emerald-700">৳{product.price_per_unit}</span>
                <span className="text-sm font-semibold text-slate-500">/ {product.unit}</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium pt-1">
                ✓ No middleman commission • 100% Direct to Farmer
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-emerald-700" />
                <span>Stock in Storage: {product.quantity.toLocaleString()} {product.unit}</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Minimum order: 1 {product.unit}. Orders are handled sequentially on first-come basis.
              </p>
            </div>

            {/* Direct Order Form Modal Component */}
            <OrderModal product={product} />

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Security Guarantee</span>
              <span className="text-emerald-700 font-medium">Verified Agricultural Seller</span>
            </div>
          </div>

          {/* Farmer Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Farmer Profile</h3>
              {product.farmer_profile?.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>NID Verified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base shrink-0">
                {product.farmer?.full_name?.charAt(0) || 'F'}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 leading-tight">
                  {product.farmer_profile?.farm_name || product.farmer?.full_name || 'Registered Farmer'}
                </h4>
                <p className="text-xs text-slate-500">
                  {product.farmer?.full_name} • {product.district || 'Bangladesh'}
                </p>
              </div>
            </div>

            {product.farmer_profile?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{product.farmer_profile.bio}"
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Experience</span>
                <span className="font-bold text-slate-800">{product.farmer_profile?.years_of_experience || 10}+ Years</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Successful Sales</span>
                <span className="font-bold text-slate-800">{product.farmer_profile?.total_sales || 24}+ Completed</span>
              </div>
            </div>

            {/* Direct Connect Buttons: Phone & WhatsApp */}
            {(() => {
              const rawPhone = product.farmer?.phone || '01711002233'
              const cleanDigits = rawPhone.replace(/\D/g, '')
              const waDigits = cleanDigits.startsWith('88') ? cleanDigits : (cleanDigits.startsWith('0') ? '88' + cleanDigits : '880' + cleanDigits)
              return (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${rawPhone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs text-center"
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>কল করুন ({rawPhone})</span>
                  </a>
                  <a
                    href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি CropConnect থেকে আপনার '${product.name}' ফসলটি সম্পর্কে জানতে যোগাযোগ করছি।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors shadow-xs text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp চ্যাট</span>
                  </a>
                </div>
              )
            })()}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                href={`/farmers/${product.farmer_id || product.farmer?.id || 'farmer-1'}`}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View Full Farmer Profile (প্রোফাইল দেখুন) →
              </Link>

              <InquiryModal
                productId={product.id}
                productTitle={product.name}
                farmerId={product.farmer_id || product.farmer?.id || 'farmer-1'}
                farmerName={product.farmer?.full_name || 'Farmer'}
              />
            </div>

            <div className="pt-2 text-right">
              <ReportListingModal
                reportedItem={`${product.name} (Farmer: ${product.farmer?.full_name || 'Al-Amin'})`}
                reportedType="Product Listing"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
