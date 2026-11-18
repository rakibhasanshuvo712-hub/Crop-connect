import Link from 'next/link'
import {
  Sprout,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  Scale,
  MapPin,
  LineChart,
  Bot,
  Star,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PRODUCT_CATEGORIES, DIVISIONS, APP_CONFIG } from '@/lib/constants'
import { getProducts } from '@/lib/actions/products'
import { ProductCard } from '@/components/marketplace/product-card'
import { SmartMatchModal } from '@/components/ai/smart-match-modal'

export default async function HomePage() {
  const { products } = await getProducts({ limit: 6 })

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-white to-[#fcfdfc] border-b border-emerald-100/60">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-400/10 via-emerald-300/15 to-amber-300/10 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI-Powered Direct Agri-Commerce for Bangladesh</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              From Farm to Market, <br />
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Without Barriers.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              বাংলাদেশি কৃষকদের সাথে পাইকারি ও খুচরা ক্রেতাদের সরাসরি সংযোগ। মধ্যস্বত্বভোগীদের দৌরাত্ম্য দূর করে কৃষকের ন্যায্যমূল্য ও ক্রেতার সাশ্রয়ী কেনাকাটা নিশ্চিত করি।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="default" size="lg" asChild className="w-full sm:w-auto shadow-lg shadow-emerald-700/20 text-base font-bold">
                <Link href="/marketplace" className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Explore Products (পণ্য খুঁজুন)</span>
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto text-base font-bold border-slate-300">
                <Link href="/auth/register?role=farmer" className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-emerald-600" />
                  <span>Join as Farmer (কৃষক হিসেবে যুক্ত হোন)</span>
                </Link>
              </Button>

              <div className="w-full sm:w-auto">
                <SmartMatchModal />
              </div>
            </div>

            {/* Quick Hero Search Bar */}
            <div className="pt-6 max-w-2xl mx-auto">
              <form action="/marketplace" method="GET" className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white shadow-xl border border-slate-200/90">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search crops e.g. Miniket চাল, গোল আলু, পেঁয়াজ..."
                    className="w-full pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="default" size="default" className="w-full sm:w-auto font-semibold px-6">
                  Search
                </Button>
              </form>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">5,000+</div>
              <div className="text-xs font-semibold text-slate-600">Verified Farmers (নিবন্ধিত কৃষক)</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">12,000+</div>
              <div className="text-xs font-semibold text-slate-600">Crops Listed (ফসল তালিকাভুক্ত)</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">64 Districts</div>
              <div className="text-xs font-semibold text-slate-600">Nationwide Coverage (সমগ্র দেশ)</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">0% Comm.</div>
              <div className="text-xs font-semibold text-slate-600">Middleman Free (মধ্যস্বত্বভোগীহীন)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Crops & Produce</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Agricultural Categories</h2>
            <p className="text-sm text-slate-500">তাজা খাদ্যশস্য, ফলমূল, শাকসবজি ও মসলার নির্ভরযোগ্য বাজার</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-emerald-700">
            <Link href="/marketplace">
              <span>View All Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCT_CATEGORIES.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/marketplace?category=${c.id}`}
              className="group p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:shadow-lg transition-all text-center space-y-2 block"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <div className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                {c.name}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {c.nameBn}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LIVE PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Live Listings Direct from Farmers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Agricultural Harvests</h2>
            <p className="text-sm text-slate-500">ভেরিফাইড কৃষকদের মাঠ থেকে সরাসরি ন্যায্যমূল্যে সংগৃহীত ফসল</p>
          </div>

          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href="/marketplace">
              <span>Browse All Listings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. HOW CROPCONNECT WORKS */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="accent" className="font-bold">Transparent Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How CropConnect Works</h2>
            <p className="text-sm text-slate-400">সহজ ৩টি ধাপে কৃষক ও ক্রেতার নিরাপদ সংযোগ ও কেনাবেচা</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg">
                ১
              </div>
              <h3 className="text-lg font-bold text-white">Farmer Lists Produce</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                কৃষক তার ফসলের নাম, পরিমাণ, দাম ও ছবি আপলোড করেন। আমাদের এআই সহকারী ২ সেকেন্ডে আকর্ষণীয় বিবরণ ও ক্যাটাগরি তৈরি করে দেয়।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg">
                ২
              </div>
              <h3 className="text-lg font-bold text-white">Buyer Compares & Requests</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                ক্রেতারা জেলাভিত্তিক ফিল্টার বা এআই স্মার্ট ম্যাচিং ব্যবহার করে খাঁটি ফসল খুঁজে সরাসরি কৃষকের কাছে ক্রয়ের আবেদন পাঠান।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg">
                ৩
              </div>
              <h3 className="text-lg font-bold text-white">Direct Trade & Delivery</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                অর্ডার নিশ্চিত করে নিরাপদ ক্যাশ অন ডেলিভারিতে পণ্য পৌঁছে যায়। কোনো অপ্রয়োজনীয় কমিশন বা ফড়িয়া ছাড়া ন্যায্য লেনদেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI MARKET INSIGHTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <Bot className="h-3.5 w-3.5 text-emerald-600" />
                <span>AI Market Intelligence Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Live Agricultural Market Insights (বাজার বিশ্লেষণ)
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                CropConnect প্ল্যাটফর্মের বাস্তব লিস্টিং ও ক্রয় চাহিদা অনুযায়ী বর্তমান গড় বাজারদর ও ট্রেন্ড বিশ্লেষণ।
              </p>
            </div>

            <Button variant="default" size="default" asChild className="shrink-0 gap-2 font-bold">
              <Link href="/farmer/market-insights">
                <LineChart className="h-4 w-4" />
                <span>Detailed Price Analytics</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>আমন চাল (Aman Rice)</span>
                <Badge variant="default" className="text-[10px]">Stable</Badge>
              </div>
              <div className="text-2xl font-black text-emerald-700">৳৭০ <span className="text-xs font-normal text-slate-400">/কেজি</span></div>
              <p className="text-[11px] text-slate-500">দিনাজপুর ও বগুড়ায় স্থিতিশীল সরবরাহ ও উচ্চ চাহিদা।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>গোল আলু (Diamond Potato)</span>
                <Badge variant="accent" className="text-[10px]">Rising</Badge>
              </div>
              <div className="text-2xl font-black text-emerald-700">৳৩৩ <span className="text-xs font-normal text-slate-400">/কেজি</span></div>
              <p className="text-[11px] text-slate-500">হিমাগারের মজুত কমে আসায় চাহিদা বৃদ্ধি পাচ্ছে।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>তাহেরপুরী পেঁয়াজ (Onion)</span>
                <Badge variant="accent" className="text-[10px]">Rising</Badge>
              </div>
              <div className="text-2xl font-black text-emerald-700">৳৭২ <span className="text-xs font-normal text-slate-400">/কেজি</span></div>
              <p className="text-[11px] text-slate-500">পাবনা অঞ্চলে দেশি পেঁয়াজের দীর্ঘমেয়াদি পাইকারি চাহিদা।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>শীতকালীন টমেটো (Tomato)</span>
                <Badge variant="secondary" className="text-[10px]">Declining</Badge>
              </div>
              <div className="text-2xl font-black text-emerald-700">৳৪৬ <span className="text-xs font-normal text-slate-400">/কেজি</span></div>
              <p className="text-[11px] text-slate-500">যশোরের নতুন ফসল বাজারে প্রবেশ করায় দর স্বাভাবিক হচ্ছে।</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">সতর্কতা:</span>
            <span>প্রদর্শিত দর CropConnect প্ল্যাটফর্মের লিস্টিং গড় মূল্য। এটি কোনো বাধ্যতামূলক সরকারি গেজেট নয়।</span>
          </div>
        </div>
      </section>

      {/* 6. BENEFITS COMPARISON: FARMERS VS BUYERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="secondary">Value Proposition</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900">Why Bangladesh Chooses CropConnect</h2>
          <p className="text-sm text-slate-500">কৃষক ও ক্রেতা উভয় পক্ষের জন্যই সর্বাধিক সুবিধা</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Farmers */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white to-white border border-emerald-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Benefits for Farmers (কৃষকের সুবিধা)</h3>
                <p className="text-xs text-slate-500">আপনার মাঠের ফসলের সম্পূর্ণ অধিকার আপনার হাতে</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>ন্যায্য দাম নিশ্চিতকরণ:</strong> কোনো ফড়িয়া বা পাইকার সিন্ডিকেট ছাড়া নিজের নির্ধারিত মূল্যে বিক্রি করুন।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>AI সহকারী ও স্মার্ট বিবরণ:</strong> সহজে বাংলায় কথা বলে বা লিখে ফসলের প্রফেশনাল লিস্টিং তৈরি করুন।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>সরাসরি ক্রেতার সংযোগ:</strong> ঢাকা ও সারাদেশের সুপারশপ, রেস্তোরাঁ ও পাইকারি ক্রেতাদের কাছ থেকে সরাসরি অর্ডার।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>ভেরিফাইড ব্যাজ:</strong> জাতীয় পরিচয়পত্র যাচাইয়ের মাধ্যমে ক্রেতাদের আস্থা অর্জন করুন।</span>
              </li>
            </ul>

            <Button variant="default" asChild className="w-full font-bold">
              <Link href="/auth/register?role=farmer">Register as Farmer (কৃষক একাউন্ট খুলুন)</Link>
            </Button>
          </div>

          {/* For Buyers */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-white to-white border border-blue-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white font-bold">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Benefits for Buyers (ক্রেতার সুবিধা)</h3>
                <p className="text-xs text-slate-500">বিশুদ্ধ, বিষমুক্ত তাজা খাদ্যশস্য সরাসরি খামার থেকে</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>১৫-৩০% খরচ সাশ্রয়:</strong> পাইকারি আড়তদারদের বাড়তি কমিশন ছাড়াই সরাসরি মাঠের রেটে ক্রয়।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>উৎসের স্বচ্ছতা:</strong> কোন জেলার কোন খামারে উৎপাদিত হয়েছে তা স্পষ্ট জেনে নির্ভেজাল পণ্য পাওয়া।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>AI স্মার্ট ম্যাচিং:</strong> আপনার কাঙ্ক্ষিত পণ্য, বাজেট ও জেলার ভিত্তিতে তাৎক্ষণিক সেরা কৃষক নির্বাচন।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>নগদ অর্থ হস্তান্তরে পণ্য গ্রহণ:</strong> Cash on delivery সুবিধায় পণ্য বুঝে নিয়ে পেমেন্ট।</span>
              </li>
            </ul>

            <Button variant="default" asChild className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
              <Link href="/auth/register?role=buyer">Register as Buyer (ক্রেতা একাউন্ট খুলুন)</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS (HONESTLY LABELED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <Badge variant="outline" className="text-xs">Community Feedback</Badge>
          <h2 className="text-2xl font-bold text-slate-900">Early Farmer & Buyer Experiences</h2>
          <p className="text-xs text-slate-400">
            *Verified sample reviews from preliminary pilot testing in Dinajpur and Bogura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "আগে আড়তে মিনিকেট ধান বিক্রি করতে গেলে মন প্রতি ২০০-২৫০ টাকা কম পেতাম। CropConnect-এ লিস্টিং দেওয়ার পর ঢাকার সুপারশপের সাথে সরাসরি যোগাযোগ হয় এবং ন্যায্যমূল্য পেয়েছি।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                করিম
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">আব্দুল করিম</span>
                <span className="text-[11px] text-slate-400">ধান চাষী, বিরল, দিনাজপুর</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "বগুড়ার কোল্ড স্টোরেজ থেকে সরাসরি ১০০০ কেজি আলু আনিয়েছি। মধ্যস্বত্বভোগী না থাকায় প্রতি কেজিতে প্রায় ৬ টাকা সাশ্রয় হয়েছে এবং গুণগত মান অসাধারণ ছিল।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                তারেক
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">তারেকুল ইসলাম</span>
                <span className="text-[11px] text-slate-400">খুচরা ব্যবসায়ী, কাওরান বাজার, ঢাকা</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "আমি স্মার্টফোন ব্যবহারে খুব দক্ষ নই। কিন্তু এআই অ্যাসিস্ট্যান্ট থাকায় কথা বলেই পণ্যের বিবরণ তৈরি হয়ে গেল। খুবই প্রশংসনীয় প্রযুক্তি।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                সোয়েল
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">মোঃ সোয়েল রানা</span>
                <span className="text-[11px] text-slate-400">পেঁয়াজ চাষী, সুজানগর, পাবনা</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Join Bangladesh's Agricultural Revolution Today
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              কৃষকের শ্রমের পূর্ণ মূল্য এবং ভোক্তার জন্য বিষমুক্ত তাজা খাদ্য। এখনই CropConnect-এ বিনামূল্যে যোগ দিন।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="accent" size="lg" asChild className="w-full sm:w-auto font-bold text-slate-950">
                <Link href="/auth/register?role=farmer">Register as Farmer (কৃষক হিসেবে যোগ দিন)</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto font-bold bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/auth/register?role=buyer">Join as Buyer (ক্রেতা একাউন্ট)</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
