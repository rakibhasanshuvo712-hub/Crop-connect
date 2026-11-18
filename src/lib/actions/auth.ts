'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { UserRole } from '@/lib/constants'

export interface SignUpInput {
  email: string
  password: string
  fullName: string
  role: UserRole
  phone?: string
  farmName?: string
  district?: string
  division?: string
}

export async function signUpUser(data: SignUpInput) {
  try {
    const supabase = await createClient()

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
          phone: data.phone || null,
        },
      },
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (authData.user) {
      // Upsert profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        role: data.role,
        phone: data.phone || null,
        is_active: true,
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.warn('Profile creation notice:', profileError.message)
      }

      // Role specific profile
      if (data.role === 'farmer') {
        await supabase.from('farmer_profiles').upsert({
          profile_id: authData.user.id,
          farm_name: data.farmName || `${data.fullName}'s Farm`,
          district: data.district || null,
          division: data.division || null,
          is_verified: false,
          verification_status: 'pending',
          updated_at: new Date().toISOString(),
        })
      } else if (data.role === 'buyer') {
        await supabase.from('buyer_profiles').upsert({
          profile_id: authData.user.id,
          business_name: data.fullName,
          total_orders: 0,
          updated_at: new Date().toISOString(),
        })
      }
    }

    revalidatePath('/')
    return { success: true, role: data.role }
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' }
  }
}

export async function signInUser(formData: { email: string; password: string }) {
  const normEmail = formData.email.trim().toLowerCase()
  const pass = formData.password.trim()

  // Preconfigured Demo & Administrative Accounts
  if (normEmail === 'admin@cropconnect.com' && (pass === 'AdminPassword2026!' || pass === 'admin123' || pass === 'Admin@123')) {
    revalidatePath('/')
    return { success: true, role: 'admin' as UserRole }
  }
  if (normEmail === 'farmer@cropconnect.com' && (pass === 'FarmerPassword2026!' || pass === 'farmer123')) {
    revalidatePath('/')
    return { success: true, role: 'farmer' as UserRole }
  }
  if (normEmail === 'buyer@cropconnect.com' && (pass === 'BuyerPassword2026!' || pass === 'buyer123')) {
    revalidatePath('/')
    return { success: true, role: 'buyer' as UserRole }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Fetch user profile role
    let role: UserRole = 'buyer'
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role) {
        role = profile.role as UserRole
      }
    }

    revalidatePath('/')
    return { success: true, role }
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' }
  }
}

export async function signOutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/auth/login')
}

export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    if (profile.role === 'farmer') {
      const { data: farmerProfile } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('profile_id', user.id)
        .single()
      return { ...profile, farmer_profile: farmerProfile }
    }

    if (profile.role === 'buyer') {
      const { data: buyerProfile } = await supabase
        .from('buyer_profiles')
        .select('*')
        .eq('profile_id', user.id)
        .single()
      return { ...profile, buyer_profile: buyerProfile }
    }

    return profile
  } catch {
    return null
  }
}
