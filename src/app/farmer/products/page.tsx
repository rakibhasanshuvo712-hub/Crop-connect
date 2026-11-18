import Link from 'next/link'
import { PlusCircle, Package, MapPin, Scale, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getFarmerProducts } from '@/lib/actions/products'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

export default async function FarmerProductsPage() {
  const products = await getFarmerProducts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Crop Listings (আমার ফসল)</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active listings, quantities, and asking rates.</p>
        </div>

        <Button variant="default" size="sm" asChild className="gap-1 font-bold">
          <Link href="/farmer/products/add">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Crop</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const category = PRODUCT_CATEGORIES.find(c => c.id === p.category)
          const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

          return (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs space-y-3">
              <div className="aspect-16/9 w-full bg-slate-100 relative">
                <img src={img} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant="default" className="text-xs bg-white/95 text-slate-900 font-bold">
                    {category?.icon} {category?.name}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className="capitalize text-[10px]">
                    {p.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-700 text-base">৳{p.price_per_unit} / {p.unit}</span>
                  <span className="text-slate-500 font-medium">{p.quantity} {p.unit} in stock</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>{p.district || 'Dinajpur'}</span>
                  <span>{p.view_count || 120} views</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                  >
                    View Listing
                  </Link>
                  <Button variant="outline" size="sm" asChild className="h-7 text-xs font-bold text-emerald-800 border-emerald-200 hover:bg-emerald-50">
                    <Link href={`/farmer/products/edit/${p.id}`}>
                      Edit Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
