import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { APP_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'যোগাযোগ ও সাপোর্ট — আমাদের সহায়তা কেন্দ্র | Contact Us',
  description: 'Get in touch with CropConnect Bangladesh for farmer registration assistance, dispute mediation, bulk enterprise orders, or general inquiries.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="default">Support & Inquiries</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Get in Touch with CropConnect
        </h1>
        <p className="text-sm text-slate-600">
          We are here to support farmers, wholesale buyers, retailers, and agricultural cooperatives across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Contact Channels</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Farmer Helpline (Toll-Free)</span>
                  <span>{APP_CONFIG.contactPhone}</span>
                  <span className="block text-slate-400 text-[11px]">Saturday – Thursday (8:00 AM – 8:00 PM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Support</span>
                  <span>{APP_CONFIG.contactEmail}</span>
                  <span className="block text-slate-400 text-[11px]">Typically responds within 4 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Headquarters</span>
                  <span>Kawran Bazar Wholesale Agri-Complex, Dhaka 1215, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Feedback</h3>
            <p className="text-xs text-slate-500">
              Have questions regarding bulk procurement, farmer onboarding, or technical assistance? Leave a message below.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name (নাম)</label>
                <Input placeholder="e.g. Md. Rafiqul Islam" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone Number (ফোন নম্বর)</label>
                <Input placeholder="e.g. +880 1711-000000" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address (ইমেইল)</label>
              <Input type="email" placeholder="you@domain.com" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Message / Inquiry Details</label>
              <textarea
                rows={4}
                placeholder="Write your message here..."
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <Button type="submit" variant="default" className="font-bold px-6">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
