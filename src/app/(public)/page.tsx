import Link from 'next/link'
import {
  Sprout,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Phone,
  MapPin,
  Bot,
  LineChart,
  Users,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/lib/actions/products'
import { HomeProductsFeed } from '@/components/marketplace/home-products-feed'
import { SmartMatchModal } from '@/components/ai/smart-match-modal'

export const revalidate = 60

export default async function HomePage() {
  // Fetch all active products
  const { products } = await getProducts({ limit: 100, sortBy: 'created_at' })

  // Sort by latest product first
  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'কৃষিবাজার (KrishiBazar)',
    alternateName: 'কৃষিবাজার বাংলাদেশ',
    url: 'https://krishibazar-app.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://krishibazar-app.vercel.app/marketplace?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'কৃষিবাজার বাংলাদেশ',
    url: 'https://krishibazar-app.vercel.app',
    logo: 'https://krishibazar-app.vercel.app/opengraph-image',
    description: 'AI-Powered Direct Agricultural Marketplace connecting farmers in Bangladesh directly with wholesale and retail buyers.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801711002233',
      contactType: 'customer service',
      areaServed: 'BD',
      availableLanguage: ['Bengali', 'English'],
    },
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-20">
      {/* Schema.org WebSite & Organization SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* 1. SIMPLE HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-b from-emerald-50/70 via-white to-[#fcfdfc] border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI-Powered Direct Agri-Commerce for Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.2]">
              From Farm to Market, <br />
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Without Barriers.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              বাংলাদেশি কৃষকদের সাথে পাইকারি ও খুচরা ক্রেতাদের সরাসরি সংযোগ। মধ্যস্বত্বভোগীদের দৌরাত্ম্য দূর করে কৃষকের ন্যায্যমূল্য ও ক্রেতার সাশ্রয়ী কেনাকাটা নিশ্চিত করি।
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button variant="default" size="default" asChild className="shadow-md shadow-emerald-700/20 font-bold">
                <Link href="/auth/register?role=farmer" className="flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  <span>Join as Farmer (কৃষক হিসেবে যুক্ত হোন)</span>
                </Link>
              </Button>

              <Button variant="outline" size="default" asChild className="font-bold border-slate-300">
                <Link href="/auth/register?role=buyer" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-600" />
                  <span>Join as Buyer (ক্রেতা হিসেবে যুক্ত হোন)</span>
                </Link>
              </Button>

              <div>
                <SmartMatchModal />
              </div>
            </div>

            {/* Platform highlights strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Direct Farmer Phone Contact
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-rose-500" />
                Specific Upazila & District Areas
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Admin Dispute Resolution Protection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIRECT PRODUCT SHOWCASE: ALL PRODUCTS, LATEST FIRST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeProductsFeed initialProducts={sortedProducts} />
      </section>

      {/* 3. QUICK ASSISTANCE & MARKET RATES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Need assistance with pricing or dispute resolution?</h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Check real-time daily mandi rates with our AI Market Insights, chat with our Bangla AI Assistant, or report any dispute for instant administrative mediation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Button variant="secondary" size="default" asChild className="font-bold bg-white text-emerald-900 hover:bg-emerald-50">
              <Link href="/farmer/market-insights" className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-emerald-700" />
                <span>Market Rates (বাজারদর)</span>
              </Link>
            </Button>

            <Button variant="outline" size="default" asChild className="font-bold text-white border-white/30 hover:bg-white/10">
              <Link href="/farmer/ai-assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-amber-300" />
                <span>AI Assistant (এআই সহকারী)</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
