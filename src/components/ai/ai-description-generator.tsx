'use client'

import { useState } from 'react'
import { Sparkles, Check, RefreshCw, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCategory } from '@/lib/constants'
import { generateProductDescription } from '@/lib/actions/ai'

interface AIDescriptionGeneratorProps {
  productName: string
  category: ProductCategory
  quantity: number
  unit: string
  district?: string
  harvestDate?: string
  onApply: (desc: string) => void
}

export function AIDescriptionGenerator({
  productName,
  category,
  quantity,
  unit,
  district,
  harvestDate,
  onApply
}: AIDescriptionGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'bn' | 'en'>('bn')
  const [preview, setPreview] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)

  const handleGenerate = async () => {
    if (!productName.trim()) {
      alert('অনুগ্রহ করে প্রথমে ফসলের নাম লিখুন')
      return
    }

    setLoading(true)
    setApplied(false)

    try {
      const res = await generateProductDescription({
        productName,
        category,
        quantity: quantity || 100,
        unit: unit || 'kg',
        district,
        harvestDate,
        language: lang
      })
      setPreview(res.description)
    } catch {
      alert('বিবরণ তৈরি করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = () => {
    if (preview) {
      onApply(preview)
      setApplied(true)
      setTimeout(() => setApplied(false), 3000)
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>AI Product Description Assistant</span>
              <Badge variant="accent" className="text-[9px] py-0 px-1.5">Smart</Badge>
            </h4>
            <p className="text-[11px] text-slate-500">ফসল অনুযায়ী স্বয়ংক্রিয় প্রফেশনাল বিবরণ তৈরি করুন</p>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setLang('bn')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${lang === 'bn' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${lang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
          className="text-xs font-semibold gap-1.5"
        >
          {loading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <span>{loading ? 'জেনারেট হচ্ছে...' : 'Generate Description with AI'}</span>
        </Button>
      </div>

      {preview && (
        <div className="space-y-2 pt-2 border-t border-emerald-100">
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
            {preview}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>কৃষকের পর্যালোচনা আবশ্যক। প্রয়োজন অনুযায়ী নিচের বক্সে পরিবর্তন করতে পারবেন।</span>
            <Button
              type="button"
              variant={applied ? 'default' : 'outline'}
              size="sm"
              onClick={handleApplyClick}
              className="text-xs h-7 gap-1"
            >
              {applied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-white" />
                  <span>Applied!</span>
                </>
              ) : (
                <span>Use this Description</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
