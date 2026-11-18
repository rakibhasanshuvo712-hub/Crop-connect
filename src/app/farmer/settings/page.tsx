'use client'

import { useState } from 'react'
import { ShieldCheck, User, Save, Upload, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function FarmerSettingsPage() {
  const [farmName, setFarmName] = useState('Karim Agro Farms')
  const [district, setDistrict] = useState('Dinajpur')
  const [landSize, setLandSize] = useState('15')
  const [bio, setBio] = useState('25+ years cultivating indigenous varieties and premium Aman rice in Dinajpur.')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Farmer Profile & Verification (প্রোফাইল ও ভেরিফিকেশন)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain your verified badge, update landholding records, and customize public seller details.
        </p>
      </div>

      {/* Verification Status Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">National ID & Farmer Verification</h3>
              <p className="text-xs text-slate-500">Government NID and Land document vetted by field team</p>
            </div>
          </div>
          <Badge variant="default" className="bg-emerald-600 text-white font-bold text-xs py-1 px-3">
            ✓ Verified Farmer
          </Badge>
        </div>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Your verified status gives buyers confidence and promotes your products on search results.</span>
        </div>
      </div>

      {/* Farm Details Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900">Public Farm Information</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Farm / Cooperative Name</label>
          <Input
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">District Base</label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Cultivable Land (Acres / একর)</label>
            <Input
              type="number"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Farmer Bio & Specialty</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saved && <span className="text-xs text-emerald-700 font-bold">Profile updated successfully!</span>}
          <Button type="submit" variant="default" className="font-bold ml-auto">
            <Save className="h-4 w-4 mr-1.5" />
            <span>Save Profile</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
