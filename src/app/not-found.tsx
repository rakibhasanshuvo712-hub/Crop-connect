import Link from 'next/link'
import { Home, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100 shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-slate-900 pt-2">
            পৃষ্ঠাটি পাওয়া যায়নি
          </h1>
          <p className="text-sm text-slate-600">
            Page Not Found. The agricultural listing or page you are looking for has been moved or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="flex-1">
            <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold">
              <Home className="w-4 h-4" />
              <span>হোমপেজে যান</span>
            </Button>
          </Link>
          <Link href="/marketplace" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl border-slate-200 gap-2 font-bold text-slate-700">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>বাজার দেখুন</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
