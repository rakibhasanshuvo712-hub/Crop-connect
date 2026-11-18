'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  MessageSquare,
  Bot,
  LineChart,
  Settings,
  LogOut,
  Sprout,
  ShieldCheck
} from 'lucide-react'
import { signOutUser } from '@/lib/actions/auth'

export function FarmerSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/farmer/products', label: 'My Crop Listings', icon: Package },
    { href: '/farmer/products/add', label: 'Add New Crop', icon: PlusCircle },
    { href: '/farmer/orders', label: 'Buyer Orders', icon: ShoppingBag },
    { href: '/farmer/inquiries', label: 'Buyer Inquiries', icon: MessageSquare },
    { href: '/farmer/ai-assistant', label: 'AI Crop Assistant', icon: Bot, badge: 'AI' },
    { href: '/farmer/market-insights', label: 'Market Price Insights', icon: LineChart },
    { href: '/farmer/settings', label: 'Profile & Verification', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight">কৃষিবাজার</span>
            <span className="block text-[10px] text-emerald-400 font-medium">Farmer Portal (কৃষক)</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sign out */}
      <div className="pt-4 border-t border-slate-900">
        <button
          onClick={() => signOutUser()}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/60 hover:text-white transition-colors cursor-pointer shadow-xs"
        >
          <LogOut className="h-4 w-4 text-rose-400" />
          <span>Log Out (লগআউট)</span>
        </button>
      </div>
    </aside>
  )
}
