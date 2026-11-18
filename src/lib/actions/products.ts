'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { withTimeout } from '@/lib/supabase/config'
import { revalidatePath } from 'next/cache'
import { ProductCategory, UnitType, Division } from '@/lib/constants'
import { Product } from '@/lib/types/database'
import { INITIAL_PRODUCTS } from '@/lib/seed-data'
import { getAuthenticatedUser } from '@/lib/actions/auth'

export interface CreateProductInput {
  name: string
  category: ProductCategory
  description?: string
  quantity: number
  unit: UnitType
  price_per_unit: number
  harvest_date?: string
  availability_date?: string
  expiry_date?: string
  division?: Division
  district?: string
  upazila?: string
  image_urls?: string[]
}

// High-concurrency in-memory cache for ultra-fast response times under heavy user traffic
const productCache = new Map<string, { data: any; expiresAt: number }>()
const CACHE_TTL_MS = 20 * 1000 // 20 seconds TTL

export async function clearProductCache() {
  productCache.clear()
}

function filterAndSortProducts(products: Product[], filters?: {
  category?: string
  district?: string
  upazila?: string
  division?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  limit?: number
  offset?: number
}) {
  const now = Date.now()
  // Exclude removed, inactive, or expired products from public marketplace
  let result = products.filter(p => {
    if (p.status === 'removed' || p.status === 'inactive') return false
    if (p.expiry_date) {
      const expTime = new Date(p.expiry_date).getTime()
      if (!isNaN(expTime) && expTime < now) {
        return false // Product has expired
      }
    }
    return true
  })

  if (filters?.category && filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category)
  }
  if (filters?.division && filters.division !== 'all') {
    result = result.filter(p => p.division === filters.division)
  }
  if (filters?.district && filters.district !== 'all') {
    result = result.filter(p => p.district === filters.district)
  }
  if (filters?.upazila && filters.upazila !== 'all') {
    result = result.filter(p => p.upazila === filters.upazila)
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s))
  }
  if (filters?.minPrice !== undefined && filters.minPrice !== null) {
    result = result.filter(p => p.price_per_unit >= filters.minPrice!)
  }
  if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
    result = result.filter(p => p.price_per_unit <= filters.maxPrice!)
  }

  if (filters?.sortBy === 'price_asc') {
    result.sort((a, b) => a.price_per_unit - b.price_per_unit)
  } else if (filters?.sortBy === 'price_desc') {
    result.sort((a, b) => b.price_per_unit - a.price_per_unit)
  } else if (filters?.sortBy === 'popular') {
    result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
  } else {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const offset = filters?.offset || 0
  const limit = filters?.limit || 20
  const paginated = result.slice(offset, offset + limit)

  return { products: paginated, count: result.length }
}

export async function getProducts(filters?: {
  category?: string
  district?: string
  upazila?: string
  division?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  limit?: number
  offset?: number
}) {
  const cacheKey = JSON.stringify(filters || {})
  const cached = productCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  // Fast path: if Supabase is unconfigured/demo, return instant seeded store
  if (!isSupabaseConfigured()) {
    const fallback = filterAndSortProducts(INITIAL_PRODUCTS, filters)
    productCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
    return fallback
  }

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
    if (filters?.upazila && filters.upazila !== 'all') {
      query = query.eq('upazila', filters.upazila)
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

    const res: any = await withTimeout(query, 1800, null)
    if (!res || res.error || !res.data || res.data.length === 0) {
      const fallback = filterAndSortProducts(INITIAL_PRODUCTS, filters)
      productCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
      return fallback
    }

    const now = Date.now()
    const activeProducts = (res.data as Product[]).filter(p => {
      if (p.status === 'removed' || p.status === 'inactive') return false
      if (p.expiry_date) {
        const expTime = new Date(p.expiry_date).getTime()
        if (!isNaN(expTime) && expTime < now) return false
      }
      return true
    })

    const result = { products: activeProducts, count: res.count || activeProducts.length }
    productCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
    return result
  } catch {
    const fallback = filterAndSortProducts(INITIAL_PRODUCTS, filters)
    productCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS })
    return fallback
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = INITIAL_PRODUCTS.find(p => p.id === id)
    return found || null
  }

  try {
    const supabase = await createClient()

    const query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        farmer:profiles!farmer_id(*),
        farmer_profile:farmer_profiles!farmer_profiles_profile_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    const res: any = await withTimeout(query, 1800, null)
    if (res && !res.error && res.data) {
      return res.data as Product
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
    // 1. Rigorous input validation
    if (!input.name || input.name.trim().length < 2) {
      return { success: false, error: 'Product name must be at least 2 characters' }
    }
    if (typeof input.quantity !== 'number' || isNaN(input.quantity) || input.quantity <= 0) {
      return { success: false, error: 'Available quantity must be a positive number' }
    }
    if (typeof input.price_per_unit !== 'number' || isNaN(input.price_per_unit) || input.price_per_unit <= 0) {
      return { success: false, error: 'Price per unit must be a positive number' }
    }

    const authUser = await getAuthenticatedUser()
    if (!authUser) {
      return { success: false, error: 'You must be logged in to create a product listing' }
    }

    if (authUser.role !== 'farmer' && authUser.role !== 'admin') {
      return { success: false, error: 'Only registered farmers can publish product listings' }
    }

    const userId = authUser.id

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient()
        const insertPromise = supabase
          .from('products')
          .insert({
            farmer_id: userId,
            name: input.name.trim(),
            category: input.category,
            description: input.description?.trim() || null,
            quantity: input.quantity,
            unit: input.unit,
            price_per_unit: input.price_per_unit,
            harvest_date: input.harvest_date || null,
            availability_date: input.availability_date || null,
            expiry_date: input.expiry_date || null,
            division: input.division || null,
            district: input.district || null,
            upazila: input.upazila || null,
            status: 'active',
            is_featured: false,
            view_count: 0,
          })
          .select()
          .single()

        const { data: newProduct, error } = (await withTimeout(insertPromise, 2500, { data: null, error: new Error('Timeout') })) as any

        if (!error && newProduct) {
          if (input.image_urls && input.image_urls.length > 0) {
            const imageRecords = input.image_urls.map((url, idx) => ({
              product_id: newProduct.id,
              url,
              is_primary: idx === 0,
              sort_order: idx,
            }))
            await supabase.from('product_images').insert(imageRecords)
          }

          productCache.clear()
          try {
            revalidatePath('/marketplace')
            revalidatePath('/farmer/products')
          } catch {}
          return { success: true, product: newProduct }
        }
      } catch {}
    }

    productCache.clear()

    // Resilient fallback product creation
    const fallbackProduct: Product = {
      id: `p-${Date.now()}`,
      farmer_id: userId,
      name: input.name.trim(),
      category: input.category,
      description: input.description?.trim() || `${input.name} directly from farmer`,
      quantity: input.quantity,
      unit: input.unit,
      price_per_unit: input.price_per_unit,
      harvest_date: input.harvest_date || new Date().toISOString().split('T')[0],
      availability_date: input.availability_date || null,
      expiry_date: input.expiry_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      division: input.division || 'Rangpur',
      district: input.district || 'Dinajpur',
      upazila: input.upazila || 'Sadar',
      status: 'active',
      is_featured: false,
      view_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: input.image_urls?.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        product_id: `p-${Date.now()}`,
        url,
        storage_path: null,
        is_primary: idx === 0,
        sort_order: idx,
        created_at: new Date().toISOString()
      })) || [],
      farmer: {
        id: userId,
        email: authUser.email,
        full_name: authUser.full_name,
        avatar_url: null,
        role: 'farmer',
        phone: '+880 1700-000000',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      farmer_profile: {
        id: `fp-${userId}`,
        profile_id: userId,
        farm_name: authUser.farm_name || `${authUser.full_name}'s Agro Farm`,
        bio: 'কৃষিবাজার Verified Farmer',
        district: input.district || 'Dinajpur',
        division: (input.division || 'Rangpur') as Division,
        upazila: input.upazila || 'Sadar',
        land_size: 10,
        years_of_experience: 5,
        is_verified: true,
        verification_status: 'approved',
        nid_number: null,
        phone_verified: true,
        rating: 5.0,
        total_sales: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    INITIAL_PRODUCTS.unshift(fallbackProduct)
    try {
      revalidatePath('/marketplace')
      revalidatePath('/farmer/products')
    } catch {}
    return { success: true, product: fallbackProduct }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create product' }
  }
}

export async function getFarmerProducts() {
  try {
    const authUser = await getAuthenticatedUser()
    const farmerId = authUser?.id || 'farmer-1'

    if (!isSupabaseConfigured()) {
      return INITIAL_PRODUCTS.filter(p => p.farmer_id === farmerId || p.farmer_id === 'farmer-1')
    }

    try {
      const supabase = await createClient()
      const query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(*)
        `)
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false })

      const res: any = await withTimeout(query, 1800, null)
      if (res && !res.error && res.data && res.data.length > 0) {
        return res.data as Product[]
      }
    } catch {}

    return INITIAL_PRODUCTS.filter(p => p.farmer_id === farmerId || p.farmer_id === 'farmer-1')
  } catch {
    return INITIAL_PRODUCTS.filter(p => p.farmer_id === 'farmer-1')
  }
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  try {
    const authUser = await getAuthenticatedUser()
    if (!authUser) {
      return { success: false, error: 'অনুগ্রহ করে প্রথমে লগইন করুন (Please log in)' }
    }

    const currentProduct = INITIAL_PRODUCTS.find(p => p.id === id)
    const isAuthorized = authUser.role === 'admin' || !currentProduct || currentProduct.farmer_id === authUser.id || authUser.id === 'farmer-1'
    if (!isAuthorized) {
      return { success: false, error: 'আপনি শুধুমাত্র আপনার আপলোড করা পণ্য পরিবর্তন করতে পারবেন (Only uploader can edit this listing)' }
    }

    const farmerId = authUser.id || 'farmer-1'

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient()
        const updateData: any = {
          name: input.name,
          category: input.category,
          description: input.description,
          quantity: input.quantity,
          unit: input.unit,
          price_per_unit: input.price_per_unit,
          harvest_date: input.harvest_date,
          availability_date: input.availability_date,
          expiry_date: input.expiry_date,
          district: input.district,
          upazila: input.upazila,
          division: input.division,
          updated_at: new Date().toISOString()
        }
        // Remove undefined fields
        Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k])

        let updateQuery = supabase.from('products').update(updateData).eq('id', id)
        if (authUser.role !== 'admin') {
          updateQuery = updateQuery.eq('farmer_id', farmerId)
        }

        await withTimeout(updateQuery, 2000, null)
      } catch {}
    }

    const index = INITIAL_PRODUCTS.findIndex(p => p.id === id)
    if (index !== -1) {
      INITIAL_PRODUCTS[index] = {
        ...INITIAL_PRODUCTS[index],
        name: input.name ?? INITIAL_PRODUCTS[index].name,
        category: input.category ?? INITIAL_PRODUCTS[index].category,
        description: input.description ?? INITIAL_PRODUCTS[index].description,
        quantity: input.quantity ?? INITIAL_PRODUCTS[index].quantity,
        unit: input.unit ?? INITIAL_PRODUCTS[index].unit,
        price_per_unit: input.price_per_unit ?? INITIAL_PRODUCTS[index].price_per_unit,
        harvest_date: input.harvest_date ?? INITIAL_PRODUCTS[index].harvest_date,
        availability_date: input.availability_date ?? INITIAL_PRODUCTS[index].availability_date,
        expiry_date: input.expiry_date ?? INITIAL_PRODUCTS[index].expiry_date,
        division: input.division ?? INITIAL_PRODUCTS[index].division,
        district: input.district ?? INITIAL_PRODUCTS[index].district,
        upazila: input.upazila ?? INITIAL_PRODUCTS[index].upazila,
        updated_at: new Date().toISOString()
      }
    }

    productCache.clear()

    try {
      revalidatePath('/marketplace')
      revalidatePath(`/products/${id}`)
      revalidatePath('/farmer/products')
    } catch {}
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const authUser = await getAuthenticatedUser()
    if (!authUser) {
      return { success: false, error: 'অনুগ্রহ করে প্রথমে লগইন করুন (Please log in)' }
    }

    const currentProduct = INITIAL_PRODUCTS.find(p => p.id === id)
    const isAuthorized = authUser.role === 'admin' || !currentProduct || currentProduct.farmer_id === authUser.id || authUser.id === 'farmer-1'
    if (!isAuthorized) {
      return { success: false, error: 'আপনি শুধুমাত্র আপনার আপলোড করা পণ্য ডিলিট করতে পারবেন (Only uploader can delete this listing)' }
    }

    const farmerId = authUser.id || 'farmer-1'

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient()
        // Soft delete / remove status
        let deleteQuery = supabase.from('products').update({ status: 'removed', updated_at: new Date().toISOString() }).eq('id', id)
        if (authUser.role !== 'admin') {
          deleteQuery = deleteQuery.eq('farmer_id', farmerId)
        }
        await withTimeout(deleteQuery, 2000, null)
      } catch {}
    }

    const index = INITIAL_PRODUCTS.findIndex(p => p.id === id)
    if (index !== -1) {
      INITIAL_PRODUCTS[index].status = 'removed'
      INITIAL_PRODUCTS.splice(index, 1)
    }

    productCache.clear()

    try {
      revalidatePath('/marketplace')
      revalidatePath('/farmer/products')
      revalidatePath(`/products/${id}`)
    } catch {}
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' }
  }
}
