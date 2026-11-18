'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Filter,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Ban,
  AlertTriangle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { banUser, deleteUser } from '@/lib/actions/admin'
import { toast } from 'sonner'

interface UserAccount {
  id: string
  fullName: string
  email: string
  phone: string
  role: 'farmer' | 'buyer' | 'admin'
  isVerified: boolean
  status: 'active' | 'banned'
  joinedDate: string
  specificArea: string
  farmOrBusiness?: string
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-1',
    fullName: 'Abdul Karim (করিম চাচা)',
    email: 'abdul.karim@farmer.bd',
    phone: '+880 1711-223344',
    role: 'farmer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 01, 2026',
    specificArea: 'Birol, Dinajpur, Rangpur',
    farmOrBusiness: 'Karim Agro Farms'
  },
  {
    id: 'user-2',
    fullName: 'Md. Rafiqul Islam',
    email: 'rafiqul.farmer@gmail.com',
    phone: '+880 1819-456789',
    role: 'farmer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 10, 2026',
    specificArea: 'Shibganj, Bogura, Rajshahi',
    farmOrBusiness: 'North Bengal Agro'
  },
  {
    id: 'user-3',
    fullName: 'Al-Amin Hossain',
    email: 'farmer@cropconnect.com',
    phone: '+880 1712-345678',
    role: 'farmer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 08, 2026',
    specificArea: 'Sadar, Pabna, Rajshahi',
    farmOrBusiness: 'Golden Harvest Agro Farm'
  },
  {
    id: 'user-4',
    fullName: 'Shwapno Procurement Hub',
    email: 'procurement@shwapno.com.bd',
    phone: '+880 1912-887766',
    role: 'buyer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 05, 2026',
    specificArea: 'Tejgaon, Dhaka',
    farmOrBusiness: 'ACI Logistics Ltd.'
  },
  {
    id: 'user-5',
    fullName: 'Kazi Agro Food Mills',
    email: 'kazi.procure@agrofoods.bd',
    phone: '+880 1611-332211',
    role: 'buyer',
    isVerified: true,
    status: 'active',
    joinedDate: 'Nov 12, 2026',
    specificArea: 'Agrabad, Chattogram',
    farmOrBusiness: 'Kazi Agro Group'
  },
  {
    id: 'user-6',
    fullName: 'Dhaka Superstore Sourcing',
    email: 'sourcing@dhakasuperstore.com',
    phone: '+880 1819-123456',
    role: 'buyer',
    isVerified: false,
    status: 'active',
    joinedDate: 'Nov 14, 2026',
    specificArea: 'Kawran Bazar, Dhaka',
    farmOrBusiness: 'Dhaka Superstore Chain'
  }
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'farmer' | 'buyer'>('all')

  const handleBanToggle = async (user: UserAccount) => {
    const isBanning = user.status === 'active'
    const confirmMsg = isBanning
      ? `Are you sure you want to BAN ${user.fullName} (${user.role.toUpperCase()})? They will not be able to log in or transact.`
      : `Reactivate account for ${user.fullName}?`

    if (confirm(confirmMsg)) {
      await banUser(user.id, isBanning)
      setUsers(users.map(u => {
        if (u.id === user.id) {
          return { ...u, status: isBanning ? 'banned' : 'active' }
        }
        return u
      }))
      if (isBanning) {
        toast.error(`Account ${user.fullName} has been BANNED.`)
      } else {
        toast.success(`Account ${user.fullName} has been ACTIVATED.`)
      }
    }
  }

  const handleDelete = async (user: UserAccount) => {
    if (confirm(`CRITICAL WARNING: Permanently delete ${user.fullName} (${user.role.toUpperCase()})? All products and orders will be removed.`)) {
      await deleteUser(user.id)
      setUsers(users.filter(u => u.id !== user.id))
      toast.error(`User ${user.fullName} has been permanently deleted.`)
    }
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
      u.specificArea.toLowerCase().includes(search.toLowerCase())

    const matchesRole = roleFilter === 'all' || u.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">
          User & Account Management (কৃষক ও ক্রেতা পরিচালনা)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor all registered farmers and buyers, view their phone numbers and specific areas, and ban or delete any buyer or farmer.
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Users</span>
          <span className="text-2xl font-black text-slate-900">{users.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Farmers (কৃষক)</span>
          <span className="text-2xl font-black text-emerald-700">
            {users.filter(u => u.role === 'farmer').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Buyers (ক্রেতা)</span>
          <span className="text-2xl font-black text-blue-700">
            {users.filter(u => u.role === 'buyer').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Banned Accounts</span>
          <span className="text-2xl font-black text-rose-600">
            {users.filter(u => u.status === 'banned').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, area, email..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(['all', 'farmer', 'buyer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer capitalize ${
                roleFilter === r
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All Users' : r === 'farmer' ? 'Farmers (কৃষক)' : 'Buyers (ক্রেতা)'}
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
                <th className="p-4">Farmer / Buyer</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone Number (ফোন)</th>
                <th className="p-4">Specific Area (নির্দিষ্ট এলাকা)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`hover:bg-slate-50/60 transition-colors ${u.status === 'banned' ? 'bg-rose-50/30' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 ${
                        u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">{u.farmOrBusiness || u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                      u.role === 'farmer'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <a
                      href={`tel:${u.phone}`}
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <Phone className="h-3 w-3 text-emerald-600" />
                      <span>{u.phone}</span>
                    </a>
                  </td>

                  <td className="p-4 font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span>{u.specificArea}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    {u.status === 'banned' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white bg-red-600 px-2.5 py-0.5 rounded-full">
                        <Ban className="h-3 w-3" />
                        BANNED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Ban / Unban Button */}
                      <button
                        onClick={() => handleBanToggle(u)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                          u.status === 'active'
                            ? 'text-red-700 hover:bg-red-50 border border-red-300'
                            : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-300'
                        }`}
                        title={u.status === 'active' ? 'Ban this user' : 'Reactivate user'}
                      >
                        <Ban className="h-3 w-3" />
                        <span>{u.status === 'active' ? 'Ban (ব্যান)' : 'Unban'}</span>
                      </button>

                      {/* Delete User Button */}
                      <button
                        onClick={() => handleDelete(u)}
                        className="px-2.5 py-1.5 text-[11px] font-bold rounded-xl text-slate-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 cursor-pointer flex items-center gap-1 transition-colors"
                        title="Delete user account permanently"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="hidden sm:inline">Delete</span>
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
