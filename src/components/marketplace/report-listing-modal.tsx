'use client'

import { useState } from 'react'
import { AlertTriangle, Send, CheckCircle2, X, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitComplaint } from '@/lib/actions/reports'
import { toast } from 'sonner'

interface ReportListingModalProps {
  reportedItem: string
  reportedType?: 'Product Listing' | 'User Account' | 'Platform Issue'
}

export function ReportListingModal({
  reportedItem,
  reportedType = 'Product Listing'
}: ReportListingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reporterName, setReporterName] = useState('')
  const [reporterRole, setReporterRole] = useState<'Buyer' | 'Farmer' | 'Other'>('Buyer')
  const [phone, setPhone] = useState('')
  const [reasonCategory, setReasonCategory] = useState('Incorrect price or hidden markup')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const fullReason = `[${reasonCategory}] ${details}`

    try {
      const res = await submitComplaint({
        reportedItem,
        reportedType,
        reporterName: reporterName || 'Anonymous User',
        reporterRole,
        reason: fullReason,
        phone: phone || undefined
      })

      if (res.success) {
        setSubmitted(true)
        toast.success('অভিযোগ জমা নেওয়া হয়েছে। অ্যাডমিন শীঘ্রই ব্যবস্থা নিবেন।')
        setTimeout(() => {
          setIsOpen(false)
          setSubmitted(false)
          setDetails('')
        }, 2200)
      } else {
        toast.error('Failed to submit report')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
        title="Report issue with this listing or seller"
      >
        <Flag className="h-3.5 w-3.5 text-rose-500" />
        <span>Report Problem / অভিযোগ জানান</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  অভিযোগ সফলভাবে গ্রহণ করা হয়েছে
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  আপনার অভিযোগটি সরাসরি <strong>কৃষিবাজার Admin</strong> প্যানেলে পাঠানো হয়েছে। আমাদের টিম তদন্ত করে দ্রুত উপযুক্ত ব্যবস্থা গ্রহণ করবেন।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Submit Dispute / Complaint (অভিযোগ জমা দিন)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Regarding: <strong className="text-slate-800">{reportedItem}</strong>
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Name (আপনার নাম)</label>
                      <Input
                        required
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="e.g. Rahim Ahmed"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Role (আপনার পদবী)</label>
                      <select
                        value={reporterRole}
                        onChange={(e) => setReporterRole(e.target.value as any)}
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Buyer">Buyer (ক্রেতা)</option>
                        <option value="Farmer">Farmer (কৃষক)</option>
                        <option value="Other">General User (সাধারণ নাগরিক)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Phone Number (মোবাইল নম্বর)</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Complaint Category (অভিযোগের ধরণ)</label>
                    <select
                      value={reasonCategory}
                      onChange={(e) => setReasonCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Incorrect price or hidden markup">ভুল দাম বা গোপন অতিরিক্ত চার্জ (Incorrect price)</option>
                      <option value="Mismatch in crop freshness / quality">ফসলের মান বা সতেজতায় অমিল (Quality mismatch)</option>
                      <option value="Unresponsive seller / farmer">বিক্রেতার সাথে যোগাযোগ অসম্ভব (Unresponsive)</option>
                      <option value="Suspected fraud or fake listing">ভুয়া লিস্টিং বা প্রতারণার সন্দেহ (Suspected fraud)</option>
                      <option value="Delayed shipment / delivery dispute">ডেলিভারি বিলম্ব বা বিরোধ (Delivery issue)</option>
                      <option value="Other grievance">অন্যান্য সমস্যা (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Detailed Explanation (বিস্তারিত তথ্য)</label>
                    <textarea
                      required
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Explain what happened so our admin team can investigate..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    {submitting ? 'Submitting...' : 'Submit to Admin (অভিযোগ জমা দিন)'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
