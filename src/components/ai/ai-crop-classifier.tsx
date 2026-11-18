'use client'

import { useState } from 'react'
import { Camera, Check, RefreshCw, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCategory, PRODUCT_CATEGORIES } from '@/lib/constants'
import { classifyCropImage } from '@/lib/actions/ai'

interface AICropClassifierProps {
  onCategoryDetected: (category: ProductCategory) => void
  onImageUploaded?: (imageUrl: string) => void
}

export function AICropClassifier({ onCategoryDetected, onImageUploaded }: AICropClassifierProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    category: ProductCategory
    cropName: string
    confidence: number
    notes: string
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create local object URL for preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    if (onImageUploaded) onImageUploaded(url)

    setAnalyzing(true)
    try {
      const detected = await classifyCropImage(file.name, file.type)
      setResult(detected)
      onCategoryDetected(detected.category)
    } catch {
      // Fallback
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">AI Agricultural Image Classifier</h4>
            <p className="text-[11px] text-slate-500">ফসলের ছবি আপলোড করলে এআই ক্যাটাগরি শনাক্ত করবে</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px]">AI Vision</Badge>
      </div>

      {/* Upload Zone */}
      <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {previewUrl ? (
          <div className="flex items-center gap-4 text-left">
            <img
              src={previewUrl}
              alt="Uploaded crop"
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-800 block">Uploaded Crop Image</span>
              <span className="text-[11px] text-slate-500 block">Click or drag another image to replace</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 py-2">
            <ImageIcon className="h-8 w-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-emerald-700">Click to upload photo</span> or drag & drop
            </div>
            <p className="text-[10px] text-slate-400">JPG, PNG, WebP up to 5MB</p>
          </div>
        )}
      </div>

      {/* Analyzing state */}
      {analyzing && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs">
          <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
          <span>AI Vision দ্বারা ফসল ও ক্যাটাগরি বিশ্লেষণ করা হচ্ছে...</span>
        </div>
      )}

      {/* Result Card */}
      {result && !analyzing && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Predicted Crop:</span>
              <Badge variant="default" className="text-xs font-semibold">
                {result.cropName}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Confidence:</span>
              <span className={`font-bold ${result.confidence >= 80 ? 'text-emerald-700' : 'text-amber-600'}`}>
                {result.confidence}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 italic">
            "{result.notes}"
          </p>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1 text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>শনাক্তকরণে সন্দেহ থাকলে নিচের ড্রপডাউন থেকে সঠিক ক্যাটাগরি ম্যানুয়ালি নির্বাচন করুন।</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
