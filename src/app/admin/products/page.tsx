import { getProducts } from '@/lib/actions/products'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

export default async function AdminProductsPage() {
  const { products } = await getProducts({ limit: 50 })

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Product Listing Moderation (ফসল নিরীক্ষা)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Supervise agricultural listings, price boundaries, and quality descriptions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
            <tr>
              <th className="py-3 px-4">Produce</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price / Unit</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                <td className="py-3 px-4 capitalize">{p.category}</td>
                <td className="py-3 px-4 font-bold text-emerald-700">৳{p.price_per_unit} / {p.unit}</td>
                <td className="py-3 px-4">{p.quantity} {p.unit}</td>
                <td className="py-3 px-4">{p.district}, {p.division}</td>
                <td className="py-3 px-4">
                  <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className="capitalize text-[10px]">
                    {p.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
