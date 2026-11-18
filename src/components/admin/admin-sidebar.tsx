'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Package,
  ShoppingBag,
  LogOut,
  Sprout
} from 'lucide-react'
import { signOutUser } from '@/lib/actions/auth'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin/dashboard', label: 'Admin Overview', icon: ShieldAlert },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/farmers', label: 'Farmer Verifications', icon: CheckCircle2 },
    { href: '/admin/products', label: 'Listing Moderation', icon: Package },
    { href: '/admin/orders', label: 'Platform Transactions', icon: ShoppingBag },
    { href: '/admin/reports', label: 'Disputes & Reports', icon: ShieldAlert },
  ]

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight">CropConnect</span>
            <span className="block text-[10px] text-purple-400 font-medium">Administration</span>
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
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
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
