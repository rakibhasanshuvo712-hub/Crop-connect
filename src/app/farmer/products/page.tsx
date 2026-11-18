import Link from 'next/link'
import { PlusCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFarmerProducts } from '@/lib/actions/products'
import { FarmerProductCard } from '@/components/farmer/farmer-product-card'

export default async function FarmerProductsPage() {
  const products = await getFarmerProducts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Crop Listings (আমার ফসল)</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active listings, edit details, set expiry dates, or delete produce.</p>
        </div>

        <Button variant="default" size="sm" asChild className="gap-1 font-bold">
          <Link href="/farmer/products/add">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Crop</span>
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Package className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">No crop listings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You haven't listed any crops yet. Start selling directly to buyers.</p>
          <Button variant="default" size="sm" asChild className="mt-2">
            <Link href="/farmer/products/add">Add First Crop</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <FarmerProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
