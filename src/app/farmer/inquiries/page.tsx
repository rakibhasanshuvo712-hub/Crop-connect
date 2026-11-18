'use client'

import { useState } from 'react'
import { MessageSquare, Phone, CheckCircle2, Clock, Mail, Send, ChevronRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Inquiry {
  id: string
  buyerName: string
  buyerType: string
  phone: string
  productName: string
  message: string
  date: string
  status: 'new' | 'replied'
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    buyerName: 'Shwapno Agro Procurement Team',
    buyerType: 'Super-Shop Chain',
    phone: '+880 1711-234567',
    productName: 'Aman Dhan (Miniket / আমন ধান)',
    message: 'We require 2 metric tons of Miniket paddy on a weekly basis for our Dhaka central distribution hub. Could you arrange certified burlap packaging and direct truck dispatch?',
    date: 'Today, 10:30 AM',
    status: 'new'
  },
  {
    id: 'inq-2',
    buyerName: 'Karwan Bazar Wholesalers Cooperative',
    buyerType: 'Wholesale Trade',
    phone: '+880 1819-876543',
    productName: 'Diamond Potato (ডায়মন্ড গোল আলু)',
    message: 'What is your best bulk rate if we procure the entire 1,200 kg batch in one shipment? Please confirm harvest moisture level.',
    date: 'Yesterday, 4:15 PM',
    status: 'new'
  },
  {
    id: 'inq-3',
    buyerName: 'Pran Food Processing Division',
    buyerType: 'Institutional Processor',
    phone: '+880 1912-345678',
    productName: 'Deshi Red Onion (দেশি তাহেরপুরী পেঁয়াজ)',
    message: 'Inquiring about delivery schedule for 800 kg. Can you deliver by Friday?',
    date: 'Nov 15, 2026',
    status: 'replied'
  }
]

export default function FarmerInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES)
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all')
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(INITIAL_INQUIRIES[0])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'new') return inq.status === 'new'
    if (filter === 'replied') return inq.status === 'replied'
    return true
  })

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !activeInquiry) return
    setSending(true)

    setTimeout(() => {
      setInquiries(inquiries.map(inq => inq.id === activeInquiry.id ? ({ ...inq, status: 'replied' }) : inq))
      if (activeInquiry) {
        setActiveInquiry({ ...activeInquiry, status: 'replied' })
      }
      setSending(false)
      setReplyText('')
      toast.success('Reply dispatched to buyer via SMS/In-App!')
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Buyer Inquiries & Leads (ক্রেতার বার্তা ও প্রশ্ন)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct communications from wholesalers, institutional buyers, and supermarket chains.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'new' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            New ({inquiries.filter(i => i.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'replied' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Replied ({inquiries.filter(i => i.status === 'replied').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: List of inquiries */}
        <div className="lg:col-span-5 space-y-3">
          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              No inquiries found in this view.
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const isSelected = activeInquiry?.id === inq.id
              return (
                <div
                  key={inq.id}
                  onClick={() => setActiveInquiry(inq)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {inq.buyerName}
                    </span>
                    <Badge variant={inq.status === 'new' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0">
                      {inq.status === 'new' ? 'New Lead' : 'Replied'}
                    </Badge>
                  </div>

                  <p className="text-[11px] font-semibold text-emerald-800 line-clamp-1 mb-1">
                    🌾 {inq.productName}
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {inq.message}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>{inq.buyerType}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {inq.date}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Right column: Active Inquiry Reader & Response */}
        <div className="lg:col-span-7">
          {activeInquiry ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{activeInquiry.buyerName}</h2>
                    <Badge variant="outline" className="text-[10px]">
                      {activeInquiry.buyerType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Phone className="h-3.5 w-3.5" />
                      {activeInquiry.phone}
                    </span>
                    <span>• {activeInquiry.date}</span>
                  </div>
                </div>

                <a
                  href={`tel:${activeInquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Buyer Directly</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Product Inquired
                </span>
                <p className="text-sm font-extrabold text-emerald-900">
                  {activeInquiry.productName}
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  "{activeInquiry.message}"
                </div>
              </div>

              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="font-bold text-xs text-slate-800 block">
                  Send In-App / SMS Response (উত্তর পাঠান)
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="e.g. Yes, we have certified burlap packaging available and can dispatch 2 tons by Thursday afternoon..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Notification will be sent to the buyer's CropConnect dashboard.
                  </span>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    {sending ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
              Select an inquiry on the left to read and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
