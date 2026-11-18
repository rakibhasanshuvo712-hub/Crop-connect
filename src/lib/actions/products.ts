'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProductCategory, UnitType, Division } from '@/lib/constants'
import { Product } from '@/lib/types/database'
import { INITIAL_PRODUCTS } from '@/lib/seed-data'

export interface CreateProductInput {
  name: string
  category: ProductCategory
  description?: string
  quantity: number
  unit: UnitType
  price_per_unit: number
  harvest_date?: string
  availability_date?: string
  division?: Division
  district?: string
  upazila?: string
  image_urls?: string[]
}

export async function getProducts(filters?: {
  category?: string
  district?: string
  division?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  limit?: number
  offset?: number
}) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        farmer:profiles!farmer_id(*),
        farmer_profile:farmer_profiles!farmer_profiles_profile_id_fkey(*)
      `, { count: 'exact' })
      .eq('status', 'active')

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters?.division && filters.division !== 'all') {
      query = query.eq('division', filters.division)
    }
    if (filters?.district && filters.district !== 'all') {
      query = query.eq('district', filters.district)
    }
    if (filters?.minPrice) {
      query = query.gte('price_per_unit', filters.minPrice)
    }
    if (filters?.maxPrice) {
      query = query.lte('price_per_unit', filters.maxPrice)
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters?.sortBy === 'price_asc') {
      query = query.order('price_per_unit', { ascending: true })
    } else if (filters?.sortBy === 'price_desc') {
      query = query.order('price_per_unit', { ascending: false })
    } else if (filters?.sortBy === 'popular') {
      query = query.order('view_count', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const limit = filters?.limit || 20
    const offset = filters?.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error || !data || data.length === 0) {
      let result = [...INITIAL_PRODUCTS]
      if (filters?.category && filters.category !== 'all') {
        result = result.filter(p => p.category === filters.category)
      }
      if (filters?.division && filters.division !== 'all') {
        result = result.filter(p => p.division === filters.division)
      }
      if (filters?.district && filters.district !== 'all') {
        result = result.filter(p => p.district === filters.district)
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase()
        result = result.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s))
      }
      if (filters?.minPrice) {
        result = result.filter(p => p.price_per_unit >= filters.minPrice!)
      }
      if (filters?.maxPrice) {
        result = result.filter(p => p.price_per_unit <= filters.maxPrice!)
      }
      return { products: result, count: result.length }
    }

    return { products: data as Product[], count: count || data.length }
  } catch {
    return { products: INITIAL_PRODUCTS, count: INITIAL_PRODUCTS.length }
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        farmer:profiles!farmer_id(*),
        farmer_profile:farmer_profiles!farmer_profiles_profile_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (!error && data) {
      return data as Product
    }

    const found = INITIAL_PRODUCTS.find(p => p.id === id)
    return found || null
  } catch {
    const found = INITIAL_PRODUCTS.find(p => p.id === id)
    return found || null
  }
}

export async function createProduct(input: CreateProductInput) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to create a product listing' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'farmer' && profile?.role !== 'admin') {
      return { success: false, error: 'Only registered farmers can publish product listings' }
    }

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        farmer_id: user.id,
        name: input.name,
        category: input.category,
        description: input.description || null,
        quantity: input.quantity,
        unit: input.unit,
        price_per_unit: input.price_per_unit,
        harvest_date: input.harvest_date || null,
        availability_date: input.availability_date || null,
        division: input.division || null,
        district: input.district || null,
        upazila: input.upazila || null,
        status: 'active',
        is_featured: false,
        view_count: 0,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    if (input.image_urls && input.image_urls.length > 0) {
      const imageRecords = input.image_urls.map((url, idx) => ({
        product_id: newProduct.id,
        url,
        is_primary: idx === 0,
        sort_order: idx,
      }))
      await supabase.from('product_images').insert(imageRecords)
    }

    revalidatePath('/marketplace')
    revalidatePath('/farmer/products')
    return { success: true, product: newProduct }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create product' }
  }
}

export async function getFarmerProducts() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return INITIAL_PRODUCTS.filter(p => p.farmer_id === 'farmer-1')

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return INITIAL_PRODUCTS.filter(p => p.farmer_id === 'farmer-1')
    }

    return data as Product[]
  } catch {
    return INITIAL_PRODUCTS.filter(p => p.farmer_id === 'farmer-1')
  }
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: true, message: 'Updated in local/demo mode' }
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: input.name,
        category: input.category,
        description: input.description,
        quantity: input.quantity,
        unit: input.unit,
        price_per_unit: input.price_per_unit,
        harvest_date: input.harvest_date,
        availability_date: input.availability_date,
        district: input.district,
        upazila: input.upazila,
        division: input.division,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('farmer_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/marketplace')
    revalidatePath(`/products/${id}`)
    revalidatePath('/farmer/products')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: true, message: 'Deleted in demo mode' }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('farmer_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/marketplace')
    revalidatePath('/farmer/products')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' }
  }
}
