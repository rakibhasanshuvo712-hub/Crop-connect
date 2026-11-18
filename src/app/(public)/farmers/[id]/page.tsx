import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, MapPin, Award, Phone, Calendar, ArrowLeft, Star, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { INITIAL_PRODUCTS } from '@/lib/seed-data'
import { ProductCard } from '@/components/marketplace/product-card'
import { CropLocationMap } from '@/components/location/crop-location-map'
import { InquiryModal } from '@/components/marketplace/inquiry-modal'

interface FarmerProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function FarmerProfilePage({ params }: FarmerProfilePageProps) {
  const { id } = await params

  // Match farmer from seed data products
  const product = INITIAL_PRODUCTS.find(p => p.farmer_id === id || p.farmer?.id === id) || INITIAL_PRODUCTS[0]
  const farmer = product.farmer

  if (!farmer) {
    notFound()
  }

  // Find all products by this farmer
  const farmerProducts = INITIAL_PRODUCTS.filter(p => p.farmer_id === farmer.id || p.farmer?.id === farmer.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace (বাজারে ফিরে যান)</span>
        </Link>
      </div>

      {/* Farmer Hero Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0">
              {farmer.full_name?.charAt(0) || 'F'}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{farmer.full_name}</h1>
                {product.farmer_profile?.is_verified && (
                  <Badge variant="success" className="flex items-center gap-1 text-xs px-2.5 py-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>NID Verified Producer</span>
                  </Badge>
                )}
              </div>

              <p className="text-sm font-semibold text-emerald-800">
                {product.farmer_profile?.farm_name || 'Golden Harvest Agro Farm (কৃষি খামার)'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {product.upazila ? `${product.upazila}, ` : ''}{product.district}, {product.division}
                </span>

                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  4.9 (48 Verified Orders)
                </span>

                <span className="flex items-center gap-1 text-slate-600">
                  <Calendar className="h-3.5 w-3.5" />
                  12 Years Farming Experience
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <InquiryModal
              farmerId={farmer.id}
              farmerName={farmer.full_name}
            />
          </div>
        </div>

        {/* Bio & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">About the Producer (কৃষকের পরিচিতি)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              স্বত্বাধিকারী {farmer.full_name}, {product.district} জেলার একজন অভিজ্ঞ এবং বিশ্বস্ত কৃষক। 
              তিনি রাসায়নিক কীটনাশকমুক্ত আধুনিক ও টেকসই কৃষি পদ্ধতিতে উচ্চমানের ফসল উৎপাদন করেন। 
              ক্রপকানেক্টের মাধ্যমে সরাসরি পাইকারি ও খুচরা ক্রেতাদের কাছে গুণগত মানের কৃষিপণ্য সরবরাহ করে থাকেন।
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-900">100% Direct Farmer</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <Award className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-900">Safe Harvest Certified</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-900">Bulk Ready Supply</span>
              </div>
            </div>
          </div>

          {/* Regional Location Map */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Farm Region (খামার এলাকা)</h3>
            <CropLocationMap
              district={product.district}
              division={product.division}
              upazila={product.upazila}
              title={`${farmer.full_name}'s Farm`}
              height="200px"
            />
          </div>
        </div>
      </div>

      {/* Active Harvest Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Active Produce by this Farmer (কৃষকের বর্তমান ফসলসমূহ)
            </h2>
            <p className="text-xs text-slate-500">
              Showing {farmerProducts.length} certified crop listings available for purchase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
