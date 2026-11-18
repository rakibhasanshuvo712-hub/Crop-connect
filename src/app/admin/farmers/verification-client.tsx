'use client'

import { useState } from 'react'
import { ShieldCheck, CheckCircle2, XCircle, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { verifyFarmerAccount } from '@/lib/actions/admin'

export function FarmerVerificationClient({ initialFarmers }: { initialFarmers: any[] }) {
  const [farmers, setFarmers] = useState(initialFarmers)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleDecision = async (id: string, approve: boolean) => {
    setProcessingId(id)
    try {
      const res = await verifyFarmerAccount(id, approve)
      if (res.success) {
        setFarmers(prev =>
          prev.map(f => (f.id === id ? { ...f, is_verified: approve, verification_status: approve ? 'approved' : 'rejected' } : f))
        )
      }
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {farmers.map((f) => (
        <div key={f.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">{f.profile?.full_name || 'Farmer'}</h3>
              <p className="text-xs text-slate-500">{f.farm_name} • {f.district}, {f.division}</p>
            </div>
            <Badge
              variant={f.verification_status === 'approved' ? 'default' : f.verification_status === 'pending' ? 'accent' : 'destructive'}
              className="capitalize text-xs font-bold"
            >
              {f.verification_status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block font-semibold">National ID (NID)</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{f.nid_number || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block font-semibold">Cultivable Landholding</span>
              <span className="font-bold text-slate-800 text-sm">{f.land_size} Acres</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block font-semibold">Contact Phone</span>
              <span className="font-bold text-slate-800 text-sm">{f.profile?.phone || '+880 1711-223344'}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            {f.verification_status !== 'approved' && (
              <Button
                variant="default"
                size="sm"
                disabled={processingId === f.id}
                onClick={() => handleDecision(f.id, true)}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve & Verify (অনুমোদন করুন)</span>
              </Button>
            )}

            {f.verification_status !== 'rejected' && (
              <Button
                variant="destructive"
                size="sm"
                disabled={processingId === f.id}
                onClick={() => handleDecision(f.id, false)}
                className="gap-1"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
