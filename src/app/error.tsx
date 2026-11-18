'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to client-side diagnostics if needed
    console.error('Application Error Boundary caught error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200/80 p-8 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            সাময়িক সমস্যা • Error
          </span>
          <h1 className="text-2xl font-black text-slate-900 pt-2">
            কিছু একটা ত্রুটি ঘটেছে
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Something went wrong while loading this page. Please try refreshing or return to the marketplace home.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>পুনরায় চেষ্টা করুন</span>
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-200 gap-2 font-bold text-slate-700"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>মূল পাতা</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
