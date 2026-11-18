'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Flag, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getComplaints, resolveComplaint, Complaint } from '@/lib/actions/reports'
import { toast } from 'sonner'

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Complaint[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all')
  const [loading, setLoading] = useState(true)

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
      toast.success(action === 'resolved' ? 'Dispute marked as RESOLVED (বিরোধ সমাধান সম্পন্ন)' : 'Report DISMISSED')
    }
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
            Dispute & Listing Reports (অভিযোগ ও বিরোধ সমাধান)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review buyer/farmer complaints, take moderation action, and mark disputes as solved.
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
          <div className="p-8 text-center text-xs text-slate-400">Loading complaints...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
            No complaints found in this category.
          </div>
        ) : (
          filtered.map((rep) => (
            <div
              key={rep.id}
              className={`rounded-3xl bg-white border p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                rep.status === 'pending' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
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
                  <span className="text-xs font-bold text-slate-900">{rep.reportedType}:</span>
                  <span className="text-xs font-extrabold text-emerald-800">{rep.reportedItem}</span>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/90 leading-relaxed">
                  "{rep.reason}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                  <span>Reported by: <strong>{rep.reporterName}</strong> ({rep.reporterRole})</span>
                  {rep.phone && rep.phone !== 'N/A' && (
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <Phone className="h-3 w-3" />
                      {rep.phone}
                    </span>
                  )}
                  <span>• {rep.date}</span>
                </div>
              </div>

              {rep.status === 'pending' ? (
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
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
                    Solve Dispute (সমাধান করুন)
                  </Button>
                </div>
              ) : (
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{rep.status === 'resolved' ? 'Case Solved by Admin' : 'Flag Dismissed'}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
