'use client'

import { useState } from 'react'
import { Users, Search, ShieldCheck, ShieldAlert, UserCheck, UserX, Filter, Phone, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface UserAccount {
  id: string
  fullName: string
  email: string
  phone: string
  role: 'farmer' | 'buyer' | 'admin'
  isVerified: boolean
  status: 'active' | 'suspended'
  joinedDate: string
  location: string
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-1',
    fullName: 'Al-Amin Hossain',
    email: 'farmer.demo@cropconnect.com',
    phone: '+880 1712-345678',
    role: 'farmer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 01, 2026',
    location: 'Dinajpur, Rangpur'
  },
  {
    id: 'user-2',
    fullName: 'Rafiqul Islam',
    email: 'rafiqul.farmer@gmail.com',
    phone: '+880 1819-456789',
    role: 'farmer',
    isVerified: false,
    status: 'active',
    joinedDate: 'Nov 10, 2026',
    location: 'Bogura, Rajshahi'
  },
  {
    id: 'user-3',
    fullName: 'Shwapno Agro Procurement Hub',
    email: 'buyer.demo@cropconnect.com',
    phone: '+880 1912-887766',
    role: 'buyer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 05, 2026',
    location: 'Tejgaon, Dhaka'
  },
  {
    id: 'user-4',
    fullName: 'Kazi Agro Food Mills',
    email: 'kazi.procure@agrofoods.bd',
    phone: '+880 1611-332211',
    role: 'buyer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 12, 2026',
    location: 'Chattogram'
  },
  {
    id: 'user-5',
    fullName: 'System Administrator',
    email: 'admin.demo@cropconnect.com',
    phone: '+880 1700-000000',
    role: 'admin',
    isVerified: true,
    status: 'active',
    joinedDate: 'Oct 15, 2026',
    location: 'Dhaka HQ'
  }
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'farmer' | 'buyer' | 'admin'>('all')

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active'
        toast.info(`Account ${u.fullName} is now ${nextStatus}`)
        return { ...u, status: nextStatus }
      }
      return u
    }))
  }

  const toggleVerification = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextV = !u.isVerified
        toast.success(`Verification status updated for ${u.fullName}`)
        return { ...u, isVerified: nextV }
      }
      return u
    }))
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.location.toLowerCase().includes(search.toLowerCase())

    const matchesRole = roleFilter === 'all' || u.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">
          User & Account Management (ব্যবহারকারী পরিচালনা)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor all registered farmers, institutional buyers, and administrators.
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Accounts</span>
          <span className="text-2xl font-black text-slate-900">{users.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Registered Farmers</span>
          <span className="text-2xl font-black text-emerald-700">
            {users.filter(u => u.role === 'farmer').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Verified Farmers</span>
          <span className="text-2xl font-black text-blue-700">
            {users.filter(u => u.role === 'farmer' && u.isVerified).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Commercial Buyers</span>
          <span className="text-2xl font-black text-purple-700">
            {users.filter(u => u.role === 'buyer').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, district..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(['all', 'farmer', 'buyer', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer capitalize ${
                roleFilter === r
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">User / Organization</th>
                <th className="p-4">Role</th>
                <th className="p-4">Location</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">{u.email} • {u.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                      u.role === 'farmer'
                        ? 'bg-emerald-100 text-emerald-800'
                        : u.role === 'buyer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 font-medium text-slate-700">
                    {u.location}
                  </td>

                  <td className="p-4">
                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'destructive'} className="text-[10px]">
                      {u.status}
                    </Badge>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.role === 'farmer' && (
                        <button
                          onClick={() => toggleVerification(u.id)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          {u.isVerified ? 'Revoke NID' : 'Verify NID'}
                        </button>
                      )}

                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                          u.status === 'active'
                            ? 'text-red-700 hover:bg-red-50 border border-red-200'
                            : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
