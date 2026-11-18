'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Flag,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Trash2,
  Ban,
  ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getComplaints, resolveComplaint, deleteComplaint, Complaint } from '@/lib/actions/reports'
import { banUser, deleteUser } from '@/lib/actions/admin'
import { toast } from 'sonner'

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Complaint[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all')
  const [loading, setLoading] = useState(true)
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    getComplaints().then((data) => {
      setReports(data)
      setLoading(false)
    })
  }, [])

  const handleResolve = async (id: string, action: 'resolved' | 'dismissed') => {
    const res = await resolveComplaint(id, action)
    if (res.success) {
      setReports(reports.map(r => r.id === id ? ({ ...r, status: action }) : r))
      toast.success(action === 'resolved' ? 'Dispute marked as SOLVED (বিরোধ সমাধান সম্পন্ন)' : 'Report DISMISSED')
    }
  }

  const handleBan = async (partyName: string, partyId?: string) => {
    if (confirm(`Are you sure you want to BAN ${partyName}? Their account will be suspended immediately.`)) {
      if (partyId) {
        await banUser(partyId, true)
      }
      setBannedUsers(new Set([...bannedUsers, partyName]))
      toast.error(`User ${partyName} has been BANNED from the marketplace.`)
    }
  }

  const handleDeleteUser = async (partyName: string, partyId?: string) => {
    if (confirm(`CRITICAL: Are you sure you want to permanently DELETE ${partyName}'s account and listings? This cannot be undone.`)) {
      if (partyId) {
        await deleteUser(partyId)
      }
      toast.error(`User ${partyName} has been permanently DELETED.`)
    }
  }

  const handleDeleteReport = async (id: string) => {
    await deleteComplaint(id)
    setReports(reports.filter(r => r.id !== id))
    toast.info('Report deleted from history')
  }

  const filtered = reports.filter(r => {
    if (filter === 'all') return true
    return r.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Dispute & Complaint Resolution (অভিযোগ ও বিরোধ সমাধান)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review complaints between Farmers and Buyers, view their phone numbers & specific areas, resolve disputes, or enforce account bans/deletions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(['all', 'pending', 'resolved', 'dismissed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer capitalize ${
                filter === s
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s} ({s === 'all' ? reports.length : reports.filter(r => r.status === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading complaints & dispute records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
            No complaints found in this category.
          </div>
        ) : (
          filtered.map((rep) => {
            const isTargetBanned = bannedUsers.has(rep.reportedPartyName)

            return (
              <div
                key={rep.id}
                className={`rounded-3xl bg-white border p-6 shadow-xs flex flex-col gap-4 transition-all ${
                  rep.status === 'pending' ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'
                }`}
              >
                {/* Header: Dispute Type & Reported Item */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        rep.status === 'pending'
                          ? 'destructive'
                          : rep.status === 'resolved'
                          ? 'success'
                          : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {rep.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {rep.reportedType}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-900">
                      {rep.reportedItem}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400">
                    Filed: {rep.date}
                  </span>
                </div>

                {/* 2-Column Parties Card: Complainant vs Reported Party */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Who is Complaining */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Complainant (অভিযোগকারী)
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        rep.reporterRole === 'Buyer' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rep.reporterRole}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900">{rep.reporterName}</p>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                        <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <a href={`tel:${rep.reporterPhone}`} className="hover:underline">{rep.reporterPhone}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span>Area: <strong>{rep.reporterArea}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Who is Being Complained About */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                        Reported Party (অভিযুক্ত পক্ষ)
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isTargetBanned && (
                          <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full">
                            BANNED
                          </span>
                        )}
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          rep.reportedPartyRole === 'Farmer' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {rep.reportedPartyRole}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-900">{rep.reportedPartyName}</p>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                        <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <a href={`tel:${rep.reportedPartyPhone}`} className="hover:underline">{rep.reportedPartyPhone}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span>Specific Area: <strong>{rep.reportedPartyArea}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispute Reason */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                    Dispute Reason / Details:
                  </span>
                  <p className="leading-relaxed text-slate-700">
                    "{rep.reason}"
                  </p>
                </div>

                {rep.adminNote && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                    <strong>Admin Resolution Note:</strong> {rep.adminNote}
                  </div>
                )}

                {/* Action Buttons: Solve Dispute, Ban, Delete */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Ban Reported Party Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBan(rep.reportedPartyName, rep.reportedPartyId)}
                      disabled={isTargetBanned}
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                    >
                      <Ban className="h-3.5 w-3.5 mr-1 text-rose-600" />
                      {isTargetBanned ? 'User Banned' : `Ban ${rep.reportedPartyRole} (ব্যান করুন)`}
                    </Button>

                    {/* Delete Reported Party Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(rep.reportedPartyName, rep.reportedPartyId)}
                      className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1 text-slate-500" />
                      Delete User Account
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(rep.id, 'dismissed')}
                          className="text-xs"
                        >
                          Dismiss Flag
                        </Button>

                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleResolve(rep.id, 'resolved')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Solve Dispute (বিরোধ নিষ্পত্তি)
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{rep.status === 'resolved' ? 'Case Solved by Admin' : 'Flag Dismissed'}</span>
                        </span>
                        <button
                          onClick={() => handleDeleteReport(rep.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete from list"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
