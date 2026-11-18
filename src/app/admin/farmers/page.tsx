import { getPendingFarmerVerifications } from '@/lib/actions/admin'
import { FarmerVerificationClient } from './verification-client'

export default async function AdminFarmersPage() {
  const farmers = await getPendingFarmerVerifications()

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Farmer Credential Verifications (কৃষক ভেরিফিকেশন)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review National ID numbers and land ownership records to grant the Verified Farmer Badge.
        </p>
      </div>

      <FarmerVerificationClient initialFarmers={farmers} />
    </div>
  )
}
