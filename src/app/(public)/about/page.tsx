import { Sprout, Target, ShieldCheck, Users, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { APP_CONFIG } from '@/lib/constants'

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="default" className="font-semibold">Our Mission</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Empowering Bangladeshi Farmers Through Direct Technology
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          CropConnect was conceived with a clear vision: eliminate unnecessary middlemen in agricultural supply chains so rural farmers receive the true value of their labor while urban and institutional buyers get fresh, authentic produce at fair prices.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Direct Farm-Gate Access</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            By connecting farmers in Dinajpur, Bogura, Pabna, and across Bangladesh directly with wholesale markets, super shops, and restaurants, we return 15-30% additional margin directly to farming families.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Farmer Verification & Trust</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every registered farmer profile is subject to National ID (NID) and agricultural landholding verification, protecting buyers against ghost listings and ensuring authentic origin traceability.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sprout className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Practical AI for Agriculture</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our Bangla-first AI assistant, automated listing generator, and market analytics solve everyday obstacles for rural farmers without requiring complex technological expertise.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-4">
        <h3 className="text-2xl font-bold">Ready to be part of the future of Bangladeshi agriculture?</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Whether you are a grower with harvests to sell or a business seeking dependable farm sourcing, CropConnect is built for you.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="default" asChild className="font-bold">
            <Link href="/auth/register">Get Started Free</Link>
          </Button>
          <Button variant="outline" asChild className="text-white border-slate-700 hover:bg-slate-800">
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
