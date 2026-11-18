'use client'

import { useState } from 'react'
import { MessageSquare, Send, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface InquiryModalProps {
  productId?: string
  productTitle?: string
  farmerId: string
  farmerName: string
}

export function InquiryModal({
  productId,
  productTitle,
  farmerId,
  farmerName
}: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [buyerName, setBuyerName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Simulate sending inquiry to database
    setTimeout(() => {
      setSending(false)
      setSent(true)
      toast.success('Inquiry sent successfully to the farmer!')
      setTimeout(() => {
        setIsOpen(false)
        setSent(false)
        setMessage('')
      }, 1800)
    }, 800)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 cursor-pointer font-bold"
      >
        <MessageSquare className="h-4 w-4 text-emerald-700" />
        <span>Contact Farmer (কৃষককে বার্তা পাঠান)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            {sent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">বার্তা সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-xs text-slate-500">
                  কৃষক {farmerName} আপনার বার্তাটি পেয়েছেন। তিনি শীঘ্রই যোগাযোগ করবেন।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Send Inquiry to {farmerName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {productTitle ? `Regarding: ${productTitle}` : 'Direct message to verified producer'}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Name / Organization</label>
                    <Input
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Rahim Agro / Shwapno Sourcing"
                      className="bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Phone Number</label>
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1712-XXXXXX"
                      className="bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message / Requirements</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about harvest delivery, packaging, or bulk discounts..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={sending} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                    <Send className="h-4 w-4 mr-1.5" />
                    {sending ? 'Sending...' : 'Send Message'}
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
