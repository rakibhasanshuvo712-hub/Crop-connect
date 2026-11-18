import Link from 'next/link'
import { Sprout, Phone, Mail, MapPin, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { APP_CONFIG, PRODUCT_CATEGORIES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white">{APP_CONFIG.name}</span>
                <span className="text-[10px] ml-1.5 font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 uppercase">BD</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {APP_CONFIG.taglineBn}
              <br />
              {APP_CONFIG.description}
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Agricultural Hub, Kawran Bazar & Farmgate, Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Helpline: +880 1700-000000 (Toll-Free Agri Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>support@cropconnect.bd</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Categories (ক্যাটাগরি)</h4>
            <ul className="space-y-2 text-sm">
              {PRODUCT_CATEGORIES.slice(0, 6).map(c => (
                <li key={c.id}>
                  <Link href={`/marketplace?category=${c.id}`} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span>{c.icon}</span>
                    <span>{c.name} ({c.nameBn})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Portals (পোর্টাল)</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/farmer/dashboard" className="hover:text-emerald-400 transition-colors">
                  Farmer Dashboard (কৃষক পোর্টাল)
                </Link>
              </li>
              <li>
                <Link href="/buyer/dashboard" className="hover:text-emerald-400 transition-colors">
                  Buyer Dashboard (ক্রেতা পোর্টাল)
                </Link>
              </li>
              <li>
                <Link href="/farmer/products/add" className="hover:text-emerald-400 transition-colors">
                  Add Crop Listing (ফসল যোগ করুন)
                </Link>
              </li>
              <li>
                <Link href="/farmer/ai-assistant" className="hover:text-emerald-400 transition-colors">
                  AI Bangla Assistant (এআই সহকারী)
                </Link>
              </li>
              <li>
                <Link href="/farmer/market-insights" className="hover:text-emerald-400 transition-colors">
                  Price Trends (বাজারদর অ্যানালিটিক্স)
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
                  Admin Verification (অ্যাডমিন)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Trust & Safety</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>NID & Land Record Verification for Authentic Farmers</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero Middleman Markups — 100% Direct Transactions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cash On Delivery / Offline Payment Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name} Bangladesh. Built for fair agriculture and empowering rural farmers.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Trade</Link>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for Bangladesh
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
