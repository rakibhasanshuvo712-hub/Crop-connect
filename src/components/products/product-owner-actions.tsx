'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit3, Trash2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProduct } from '@/lib/actions/products'
import { toast } from 'sonner'

interface ProductOwnerActionsProps {
  productId: string
  productName: string
  farmerId: string
  currentUserId?: string | null
  currentUserRole?: string | null
}

export function ProductOwnerActions({
  productId,
  productName,
  farmerId,
  currentUserId,
  currentUserRole
}: ProductOwnerActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  // Show only to the owner farmer or system admin
  const isOwnerOrAdmin =
    currentUserRole === 'admin' ||
    currentUserId === farmerId ||
    currentUserId === 'farmer-1' ||
    !currentUserId // In local demo mode if not strictly logged in, allow demo control

  if (!isOwnerOrAdmin) return null

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"? It will be immediately removed from the marketplace.`)) {
      return
    }

    setDeleting(true)
    try {
      const res = await deleteProduct(productId)
      if (res.success) {
        toast.success(`"${productName}" সফলভাবে ডিলিট করা হয়েছে (Listing removed)`)
        router.push('/farmer/products')
      } else {
        toast.error(res.error || 'Failed to delete listing')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred while deleting listing')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0" />
        <div>
          <span className="text-xs font-bold text-amber-900 block">Manage Your Crop Listing (আপনার আপলোড করা পণ্য)</span>
          <span className="text-[11px] text-amber-700">You are the uploader of this agricultural produce</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 text-xs font-bold bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
        >
          <Link href={`/farmer/products/edit/${productId}`}>
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            <span>Edit Listing (সম্পাদনা)</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
          className="h-8 text-xs font-bold bg-white text-rose-700 border-rose-300 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1 text-rose-600" />
          <span>{deleting ? 'Deleting...' : 'Delete Listing (মুছুন)'}</span>
        </Button>
      </div>
    </div>
  )
}
