'use client'

import { useState } from 'react'
import { User, Save, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BuyerSettingsPage() {
  const [businessName, setBusinessName] = useState('Tariqul Wholesale Traders')
  const [address, setAddress] = useState('Kawran Bazar Wholesale Market, Shed 4, Dhaka')
  const [phone, setPhone] = useState('+880 1718-990011')
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
          Buyer Account Settings (একাউন্ট সেটিংস)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your business name, contact number, and default delivery destination.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900">Profile & Delivery Destination</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Business / Buyer Name</label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Contact Phone Number</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Default Delivery Address</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saved && <span className="text-xs text-emerald-700 font-bold">Settings saved successfully!</span>}
          <Button type="submit" variant="default" className="font-bold ml-auto">
            <Save className="h-4 w-4 mr-1.5" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
