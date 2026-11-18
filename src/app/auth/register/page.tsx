'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sprout, User, Lock, Mail, Phone, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { signUpUser } from '@/lib/actions/auth'
import { DIVISIONS, Division } from '@/lib/constants'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'buyer'

  const [role, setRole] = useState<'farmer' | 'buyer'>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [farmName, setFarmName] = useState('')
  const [division, setDivision] = useState<Division>('Rangpur')
  const [district, setDistrict] = useState('Dinajpur')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await signUpUser({
        email,
        password,
        fullName,
        role,
        phone,
        farmName: role === 'farmer' ? farmName : undefined,
        division: role === 'farmer' ? division : undefined,
        district: role === 'farmer' ? district : undefined,
      })

      if (res.success) {
        if (role === 'farmer') {
          router.push('/farmer/dashboard')
        } else {
          router.push('/buyer/dashboard')
        }
      } else {
        setError(res.error || 'Registration failed.')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">CropConnect</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
        <p className="text-xs text-slate-500">Join Bangladesh's Premier Agricultural Marketplace</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sprout className="h-4 w-4" />
              <span>I am a Farmer (কৃষক)</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'buyer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-4 w-4" />
              <span>I am a Buyer (ক্রেতা)</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name (পুরো নাম)</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Md. Abdul Karim"
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address (ইমেইল)</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone (মোবাইল নম্বর)</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1700-000000"
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password (পাসওয়ার্ড)</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="text-xs"
              />
            </div>

            {/* Farmer-specific fields */}
            {role === 'farmer' && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Farmer Verification Details</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Farm / Homestead Name (খামারের নাম)</label>
                  <Input
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Karim Agro Farm"
                    className="text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Division (বিভাগ)</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value as Division)}
                      className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-2.5"
                    >
                      {DIVISIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">District (জেলা)</label>
                    <Input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Dinajpur"
                      className="text-xs bg-white h-9"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant={role === 'farmer' ? 'default' : 'default'}
              disabled={loading}
              className={`w-full font-bold ${role === 'buyer' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Buyer'}`}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="font-bold text-emerald-700 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
