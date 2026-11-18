'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Sprout, ShoppingBag, Bot, LineChart, Menu, X, User, LogIn, ShieldCheck, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { APP_CONFIG } from '@/lib/constants'
import { NotificationBell } from './notification-bell'
import { useLanguage } from '@/context/language-context'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser(user)
          supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
              if (data?.role) setRole(data.role)
            })
        }
      })
    } catch {
      // offline / demo mode
    }
  }, [])

  const dashboardHref = role === 'farmer' ? '/farmer/dashboard' : role === 'admin' ? '/admin/dashboard' : '/buyer/dashboard'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">{APP_CONFIG.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 uppercase">BD</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">AI Agricultural Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>Marketplace (বাজার)</span>
            </Link>

            <Link
              href="/farmer/market-insights"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <LineChart className="h-4 w-4 text-emerald-600" />
              <span>Market Rates (বাজারদর)</span>
            </Link>

            <Link
              href="/farmer/ai-assistant"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Bot className="h-4 w-4 text-emerald-600" />
              <span>AI Assistant (এআই সহকারী)</span>
              <Badge variant="accent" className="text-[9px] px-1.5 py-0 h-4">New</Badge>
            </Link>

            <Link
              href="/about"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Language toggle badge */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Change Language (ভাষা পরিবর্তন)"
            >
              <span>{language === 'bn' ? '🇧🇩 বাংলা' : '🌐 EN'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" asChild>
                  <Link href={dashboardHref} className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="capitalize">{role || 'Dashboard'}</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login" className="flex items-center gap-1.5 text-slate-700">
                    <LogIn className="h-4 w-4 text-slate-500" />
                    <span>Sign In</span>
                  </Link>
                </Button>

                <Button variant="default" size="sm" asChild>
                  <Link href="/auth/register" className="flex items-center gap-1">
                    <span>Register</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            <Link
              href="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-emerald-50"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>Marketplace (বাজার)</span>
            </Link>

            <Link
              href="/farmer/market-insights"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-emerald-50"
            >
              <LineChart className="h-4 w-4 text-emerald-600" />
              <span>Market Rates (বাজারদর)</span>
            </Link>

            <Link
              href="/farmer/ai-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-emerald-50"
            >
              <Bot className="h-4 w-4 text-emerald-600" />
              <span>AI Assistant (কৃষি এআই)</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              About CropConnect
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact Support
            </Link>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              </Button>
              <Button variant="default" size="sm" className="w-full" asChild>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
