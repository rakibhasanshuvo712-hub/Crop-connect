'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LogOut,
  User,
  Store,
  ShieldCheck,
  Menu,
  X,
  Sprout,
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  MessageSquare,
  Bot,
  LineChart,
  Settings,
  Heart,
  Users,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/actions/auth'
import { NotificationBell } from './notification-bell'
import { useLanguage } from '@/context/language-context'

interface DashboardHeaderProps {
  role: 'farmer' | 'buyer' | 'admin'
  userName?: string
}

export function DashboardHeader({ role, userName }: DashboardHeaderProps) {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOutUser()
  }

  const roleTitle =
    role === 'farmer'
      ? { en: 'Farmer Portal', bn: 'কৃষক প্যানেল', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
      : role === 'admin'
      ? { en: 'Admin Portal', bn: 'প্রশাসক প্যানেল', color: 'text-purple-700 bg-purple-50 border-purple-200' }
      : { en: 'Buyer Portal', bn: 'ক্রেতা প্যানেল', color: 'text-blue-700 bg-blue-50 border-blue-200' }

  const farmerLinks = [
    { href: '/farmer/dashboard', label: 'Dashboard (ড্যাশবোর্ড)', icon: LayoutDashboard },
    { href: '/farmer/products', label: 'My Crops (আমার ফসল)', icon: Package },
    { href: '/farmer/products/add', label: 'Add New Crop (ফসল যোগ)', icon: PlusCircle },
    { href: '/farmer/orders', label: 'Buyer Orders (ক্রয়াদেশ)', icon: ShoppingBag },
    { href: '/farmer/inquiries', label: 'Buyer Inquiries (বার্তা)', icon: MessageSquare },
    { href: '/farmer/ai-assistant', label: 'AI Crop Assistant (কৃষি এআই)', icon: Bot },
    { href: '/farmer/market-insights', label: 'Market Rates (বাজারদর)', icon: LineChart },
    { href: '/farmer/settings', label: 'Profile & Verification (ভেরিফিকেশন)', icon: Settings },
  ]

  const buyerLinks = [
    { href: '/buyer/dashboard', label: 'Buyer Dashboard (ড্যাশবোর্ড)', icon: LayoutDashboard },
    { href: '/buyer/orders', label: 'My Orders (আমার অর্ডার)', icon: ShoppingBag },
    { href: '/buyer/favorites', label: 'Saved Products (পছন্দের তালিকা)', icon: Heart },
    { href: '/marketplace', label: 'Browse Marketplace (বাজার দেখুন)', icon: Store },
    { href: '/buyer/settings', label: 'Account Settings (সেটিংস)', icon: Settings },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Overview (সংক্ষিপ্ত চিত্র)', icon: ShieldAlert },
    { href: '/admin/users', label: 'User Management (ইউজার ব্যবস্থাপনা)', icon: Users },
    { href: '/admin/farmers', label: 'Farmer Verifications (কৃষক যাচাই)', icon: CheckCircle2 },
    { href: '/admin/products', label: 'Listing Moderation (লিস্টিং)', icon: Package },
    { href: '/admin/orders', label: 'Transactions (লেনদেন)', icon: ShoppingBag },
    { href: '/admin/reports', label: 'Disputes & Reports (বিরোধ সমাধান)', icon: ShieldAlert },
  ]

  const links = role === 'farmer' ? farmerLinks : role === 'admin' ? adminLinks : buyerLinks

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 hidden xs:inline sm:hidden">কৃষিবাজার</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${roleTitle.color}`}>
                {roleTitle.bn}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs font-bold text-slate-700 hidden md:inline truncate max-w-[150px]">
                {userName || (role === 'farmer' ? 'Al-Amin Hossain' : role === 'admin' ? 'Administrator' : 'Shwapno Procurement')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick link to public marketplace */}
          <Link
            href="/marketplace"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <Store className="h-3.5 w-3.5 text-emerald-600" />
            <span>Marketplace (বাজার)</span>
          </Link>

          {/* Notifications */}
          <NotificationBell />

          {/* Language switch */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Change Language"
          >
            <span>{language === 'bn' ? '🇧🇩' : '🌐'}</span>
            <span className="hidden sm:inline ml-1">{language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Prominent High-Visibility Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            title="কৃষিবাজার থেকে লগআউট"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600" />
            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Log Out (লগআউট)'}</span>
            <span className="sm:hidden text-[11px]">Exit</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation for Dashboard */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-slate-950 text-slate-200 h-full flex flex-col justify-between p-4 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">কৃষিবাজার</span>
                    <span className="block text-[9px] text-emerald-400 font-medium">{roleTitle.bn}</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
                {links.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? role === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                href="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-950/50"
              >
                <Store className="h-4 w-4" />
                <span>Go to Marketplace (বাজার)</span>
              </Link>

              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-900/60 text-xs font-bold hover:bg-rose-900/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out (লগআউট)</span>
              </button>
            </div>
          </div>

          {/* Click outside backdrop to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  )
}
