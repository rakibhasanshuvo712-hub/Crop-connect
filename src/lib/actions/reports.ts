'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Complaint {
  id: string
  reportedItem: string
  reportedType: 'Product Listing' | 'User Account' | 'Platform Issue' | 'Order Dispute'
  reportedPartyName: string
  reportedPartyRole: 'Farmer' | 'Buyer' | 'Other' | string
  reportedPartyPhone: string
  reportedPartyArea: string
  reportedPartyId?: string
  reporterName: string
  reporterRole: 'Buyer' | 'Farmer' | 'Other' | string
  reporterPhone: string
  reporterArea: string
  reason: string
  date: string
  status: 'pending' | 'resolved' | 'dismissed'
  adminNote?: string
}

// In-memory persistent complaint store for local/demo runtime
let COMPLAINTS_STORE: Complaint[] = [
  {
    id: 'rep-1',
    reportedItem: 'Batch 500kg Miniket Rice (Order #ord-102)',
    reportedType: 'Order Dispute',
    reporterName: 'Shwapno Procurement Hub',
    reporterRole: 'Buyer',
    reporterPhone: '+880 1912-887766',
    reporterArea: 'Tejgaon, Dhaka',
    reportedPartyName: 'Abdul Karim (Karim Agro Farms)',
    reportedPartyRole: 'Farmer',
    reportedPartyPhone: '+880 1711-223344',
    reportedPartyArea: 'Birol, Dinajpur, Rangpur',
    reportedPartyId: 'farmer-1',
    reason: 'Farmer delayed dispatch by 48 hours past agreed pickup window without informing transport logistics.',
    date: 'Today, 10:30 AM',
    status: 'pending'
  },
  {
    id: 'rep-2',
    reportedItem: 'Payment Delay for 1000kg Taherpuri Onion (Order #ord-89)',
    reportedType: 'Order Dispute',
    reporterName: 'Al-Amin Hossain (Golden Harvest)',
    reporterRole: 'Farmer',
    reporterPhone: '+880 1712-345678',
    reporterArea: 'Sadar, Pabna, Rajshahi',
    reportedPartyName: 'Kazi Agro Food Mills',
    reportedPartyRole: 'Buyer',
    reportedPartyPhone: '+880 1611-332211',
    reportedPartyArea: 'Agrabad, Chattogram',
    reportedPartyId: 'buyer-4',
    reason: 'Buyer received delivery of 1 ton onions in good condition but is delaying cash-on-delivery settlement by 3 days.',
    date: 'Yesterday, 04:15 PM',
    status: 'pending'
  },
  {
    id: 'rep-3',
    reportedItem: 'Diamond Potato Grade Discrepancy (Order #ord-75)',
    reportedType: 'Product Listing',
    reporterName: 'Dhaka Superstore Sourcing',
    reporterRole: 'Buyer',
    reporterPhone: '+880 1819-123456',
    reporterArea: 'Kawran Bazar, Dhaka',
    reportedPartyName: 'Md. Rafiqul Islam (North Bengal Agro)',
    reportedPartyRole: 'Farmer',
    reportedPartyPhone: '+880 1819-456789',
    reportedPartyArea: 'Shibganj, Bogura, Rajshahi',
    reportedPartyId: 'farmer-2',
    reason: 'Size grading varied from Grade-A specification listed on marketplace.',
    date: 'Nov 15, 2026',
    status: 'resolved',
    adminNote: 'Admin mediated phone call between parties. Farmer issued 5% compensation on next harvest delivery.'
  }
]

export async function submitComplaint(data: {
  reportedItem: string
  reportedType?: 'Product Listing' | 'User Account' | 'Platform Issue' | 'Order Dispute'
  reportedPartyName?: string
  reportedPartyRole?: 'Farmer' | 'Buyer' | 'Other' | string
  reportedPartyPhone?: string
  reportedPartyArea?: string
  reporterName?: string
  reporterRole?: 'Buyer' | 'Farmer' | 'Other' | string
  reporterPhone?: string
  reporterArea?: string
  reason: string
  phone?: string
}) {
  try {
    const newComplaint: Complaint = {
      id: 'rep-' + Date.now().toString().slice(-4),
      reportedItem: data.reportedItem,
      reportedType: data.reportedType || 'Product Listing',
      reportedPartyName: data.reportedPartyName || 'Reported Party',
      reportedPartyRole: data.reportedPartyRole || 'Farmer',
      reportedPartyPhone: data.reportedPartyPhone || '+880 1700-000000',
      reportedPartyArea: data.reportedPartyArea || 'Bangladesh',
      reporterName: data.reporterName || 'Anonymous Complainant',
      reporterRole: data.reporterRole || 'Buyer',
      reporterPhone: data.reporterPhone || data.phone || 'N/A',
      reporterArea: data.reporterArea || 'Dhaka',
      reason: data.reason,
      date: 'Just now',
      status: 'pending'
    }

    COMPLAINTS_STORE.unshift(newComplaint)

    try {
      const supabase = await createClient()
      await supabase.from('product_reports').insert({
        reason: data.reason,
        status: 'pending'
      })
    } catch {}

    try {
      revalidatePath('/admin/reports')
    } catch {}
    return { success: true, complaint: newComplaint }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit complaint' }
  }
}

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('product_reports').select('*')
    if (data && data.length > 0) {
      // Merge with store if needed
    }
  } catch {}

  return COMPLAINTS_STORE
}

export async function resolveComplaint(id: string, action: 'resolved' | 'dismissed', adminNote?: string) {
  try {
    COMPLAINTS_STORE = COMPLAINTS_STORE.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: action,
          adminNote: adminNote || (action === 'resolved' ? 'Reviewed and dispute marked as SOLVED by Admin' : 'Dismissed after admin review')
        }
      }
      return c
    })

    try {
      revalidatePath('/admin/reports')
    } catch {}
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to resolve' }
  }
}

export async function deleteComplaint(id: string) {
  COMPLAINTS_STORE = COMPLAINTS_STORE.filter(c => c.id !== id)
  try {
    revalidatePath('/admin/reports')
  } catch {}
  return { success: true }
}
