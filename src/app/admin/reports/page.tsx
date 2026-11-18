'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, ArrowRight, Eye, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Report {
  id: string
  reportedItem: string
  reportedType: 'Product Listing' | 'User Account'
  reporterName: string
  reporterRole: string
  reason: string
  date: string
  status: 'pending' | 'resolved' | 'dismissed'
}

const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reportedItem: 'Deshi Red Onion (Listing #p-3)',
    reportedType: 'Product Listing',
    reporterName: 'Kazi Agro Food Mills',
    reporterRole: 'Buyer',
    reason: 'Reported farmgate price is higher than agreed in chat communication.',
    date: 'Nov 16, 2026',
    status: 'pending'
  },
  {
    id: 'rep-2',
    reportedItem: 'Golden Harvest Agro (Farmer)',
    reportedType: 'User Account',
    reporterName: 'Dhaka Superstore Sourcing',
    reporterRole: 'Buyer',
    reason: 'Delayed dispatch confirmation by 48 hours for 200kg cabbage order.',
    date: 'Nov 14, 2026',
    status: 'resolved'
  }
]

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)

  const handleResolve = (id: string, action: 'resolved' | 'dismissed') => {
    setReports(reports.map(r => r.id === id ? ({ ...r, status: action }) : r))
    toast.success(`Report marked as ${action}`)
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">
          Dispute & Listing Reports (রিপোর্ট ও অভিযোগ সমাধান)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review community flags, quality disputes, and marketplace compliance reports.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={rep.status === 'pending' ? 'destructive' : 'secondary'} className="text-[10px]">
                  {rep.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-bold text-slate-900">{rep.reportedType}:</span>
                <span className="text-xs font-extrabold text-emerald-800">{rep.reportedItem}</span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{rep.reason}"
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Reported by: <strong>{rep.reporterName}</strong> ({rep.reporterRole})</span>
                <span>• {rep.date}</span>
              </div>
            </div>

            {rep.status === 'pending' ? (
              <div className="flex items-center gap-2 self-end md:self-auto">
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
                  Resolve & Warn
                </Button>
              </div>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                ✓ Case Resolved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
