'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, User, Store, ShieldCheck, Menu, X, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/actions/auth'
import { NotificationBell } from './notification-bell'
import { useLanguage } from '@/context/language-context'

interface DashboardHeaderProps {
  role: 'farmer' | 'buyer' | 'admin'
  userName?: string
}

export function DashboardHeader({ role, userName }: DashboardHeaderProps) {
  const { language, setLanguage } = useLanguage()
  const [loggingOut, setLoggingOut] = useState(false)

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group sm:hidden">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sprout className="h-4 w-4" />
          </div>
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${roleTitle.color}`}>
              {roleTitle.bn}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">
              {userName || (role === 'farmer' ? 'Al-Amin Hossain' : role === 'admin' ? 'Administrator' : 'Shwapno Procurement')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
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
          className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Change Language"
        >
          {language === 'bn' ? '🇧🇩 বাংলা' : '🌐 EN'}
        </button>

        {/* Prominent High-Visibility Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
          title="কৃষিবাজার থেকে লগআউট"
        >
          <LogOut className="h-4 w-4 text-rose-600" />
          <span>{loggingOut ? 'Logging out...' : 'Log Out (লগআউট)'}</span>
        </button>
      </div>
    </header>
  )
}
