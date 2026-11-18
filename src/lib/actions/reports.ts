'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Complaint {
  id: string
  reportedItem: string
  reportedType: 'Product Listing' | 'User Account' | 'Platform Issue'
  reporterName: string
  reporterRole: string
  reason: string
  phone?: string
  date: string
  status: 'pending' | 'resolved' | 'dismissed'
  adminNote?: string
}

// In-memory persistent complaint store for local/demo runtime
let COMPLAINTS_STORE: Complaint[] = [
  {
    id: 'rep-1',
    reportedItem: 'Deshi Red Onion (Listing #p-3)',
    reportedType: 'Product Listing',
    reporterName: 'Kazi Agro Food Mills',
    reporterRole: 'Buyer',
    reason: 'Reported farmgate price is higher than agreed in chat communication.',
    phone: '+880 1819-123456',
    date: 'Today, 11:15 AM',
    status: 'pending'
  },
  {
    id: 'rep-2',
    reportedItem: 'Golden Harvest Agro (Farmer)',
    reportedType: 'User Account',
    reporterName: 'Dhaka Superstore Sourcing',
    reporterRole: 'Buyer',
    reason: 'Delayed dispatch confirmation by 48 hours for 200kg cabbage order.',
    phone: '+880 1711-987654',
    date: 'Yesterday, 03:40 PM',
    status: 'pending'
  }
]

export async function submitComplaint(data: {
  reportedItem: string
  reportedType: 'Product Listing' | 'User Account' | 'Platform Issue'
  reporterName: string
  reporterRole: string
  reason: string
  phone?: string
}) {
  try {
    const newComplaint: Complaint = {
      id: 'rep-' + Date.now().toString().slice(-4),
      reportedItem: data.reportedItem,
      reportedType: data.reportedType,
      reporterName: data.reporterName || 'Anonymous User',
      reporterRole: data.reporterRole || 'Buyer',
      reason: data.reason,
      phone: data.phone || 'N/A',
      date: 'Just now',
      status: 'pending'
    }

    COMPLAINTS_STORE.unshift(newComplaint)

    // Also persist to Supabase if available
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
          adminNote: adminNote || (action === 'resolved' ? 'Reviewed and resolved by Admin' : 'Dismissed after review')
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
