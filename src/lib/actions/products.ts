'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProductCategory, UnitType, Division } from '@/lib/constants'
import { Product } from '@/lib/types/database'

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

// Fallback high-quality initial products for Bangladesh agricultural marketplace
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    farmer_id: "farmer-1",
    name: "Premium Miniket Aman Rice (মিনিকেট চাল)",
    category: "rice",
    description: "Freshly harvested, naturally sun-dried Aman Miniket rice from the fertile plains of Dinajpur. Free from harmful polishing or artificial bleaching.",
    quantity: 2500,
    unit: "kg",
    price_per_unit: 68,
    harvest_date: "2026-11-01",
    availability_date: "2026-11-20",
    division: "Rangpur",
    district: "Dinajpur",
    upazila: "Birol",
    status: "active",
    is_featured: true,
    view_count: 342,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: "img-1", product_id: "prod-1", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", storage_path: null, is_primary: true, sort_order: 0, created_at: "" }],
    farmer: { id: "farmer-1", email: "abdul.karim@farmer.bd", full_name: "Abdul Karim (করিম চাচা)", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", role: "farmer", phone: "+880 1711-223344", is_active: true, created_at: "", updated_at: "" },
    farmer_profile: { id: "fp-1", profile_id: "farmer-1", farm_name: "Karim Agro Farms", bio: "25+ years cultivating indigenous varieties and premium Aman rice in Dinajpur.", division: "Rangpur", district: "Dinajpur", upazila: "Birol", land_size: 15, years_of_experience: 25, is_verified: true, verification_status: "approved", nid_number: "1975271829304", phone_verified: true, rating: 4.9, total_sales: 128, created_at: "", updated_at: "" }
  },
  {
    id: "prod-2",
    farmer_id: "farmer-2",
    name: "Bogura Fresh Diamond Potato (বগুড়ার ডায়মন্ড আলু)",
    category: "potato",
    description: "Export quality, unwashed organic Diamond variety potatoes straight from cold storage and field harvest in Shibganj, Bogura.",
    quantity: 8000,
    unit: "kg",
    price_per_unit: 32,
    harvest_date: "2026-10-25",
    availability_date: "2026-11-18",
    division: "Rajshahi",
    district: "Bogura",
    upazila: "Shibganj",
    status: "active",
    is_featured: true,
    view_count: 512,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: "img-2", product_id: "prod-2", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80", storage_path: null, is_primary: true, sort_order: 0, created_at: "" }],
    farmer: { id: "farmer-2", email: "rafiqul.islam@agro.bd", full_name: "Md. Rafiqul Islam", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80", role: "farmer", phone: "+880 1819-445566", is_active: true, created_at: "", updated_at: "" },
    farmer_profile: { id: "fp-2", profile_id: "farmer-2", farm_name: "North Bengal Agro", bio: "Leading potato grower and seed producer in Bogura district.", division: "Rajshahi", district: "Bogura", upazila: "Shibganj", land_size: 30, years_of_experience: 18, is_verified: true, verification_status: "approved", nid_number: "1980271829399", phone_verified: true, rating: 4.8, total_sales: 210, created_at: "", updated_at: "" }
  },
  {
    id: "prod-3",
    farmer_id: "farmer-3",
    name: "Deshi Red Onion / Taherpuri (তাহেরপুরী দেশি পেঁয়াজ)",
    category: "onion",
    description: "High pungency, well-cured indigenous Taherpuri onion from Pabna. Long shelf life, ideal for wholesale distribution and retail stores.",
    quantity: 4500,
    unit: "kg",
    price_per_unit: 72,
    harvest_date: "2026-11-05",
    availability_date: "2026-11-19",
    division: "Rajshahi",
    district: "Pabna",
    upazila: "Sujanagar",
    status: "active",
    is_featured: true,
    view_count: 620,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: "img-3", product_id: "prod-3", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80", storage_path: null, is_primary: true, sort_order: 0, created_at: "" }],
    farmer: { id: "farmer-3", email: "sohel.rana@farmer.bd", full_name: "Sohel Rana", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", role: "farmer", phone: "+880 1912-778899", is_active: true, created_at: "", updated_at: "" },
    farmer_profile: { id: "fp-3", profile_id: "farmer-3", farm_name: "Padma Riverbank Farms", bio: "Pabna's renowned onion cultivator producing high-grade Taherpuri onions.", division: "Rajshahi", district: "Pabna", upazila: "Sujanagar", land_size: 10, years_of_experience: 12, is_verified: true, verification_status: "approved", nid_number: "1988271829301", phone_verified: true, rating: 4.7, total_sales: 95, created_at: "", updated_at: "" }
  },
  {
    id: "prod-4",
    farmer_id: "farmer-4",
    name: "Fresh Winter Ripe Tomatoes (ক্ষেতের পাকা টমেটো)",
    category: "tomato",
    description: "Juicy, naturally ripened winter tomatoes from Jashore. Crisp texture, great for wholesale vegetable markets in Dhaka and Chattogram.",
    quantity: 1800,
    unit: "kg",
    price_per_unit: 45,
    harvest_date: "2026-11-16",
    availability_date: "2026-11-18",
    division: "Khulna",
    district: "Jashore",
    upazila: "Bagherpara",
    status: "active",
    is_featured: false,
    view_count: 280,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: "img-4", product_id: "prod-4", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80", storage_path: null, is_primary: true, sort_order: 0, created_at: "" }],
    farmer: { id: "farmer-4", email: "nasir.uddin@farmer.bd", full_name: "Nasir Uddin", avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80", role: "farmer", phone: "+880 1611-332211", is_active: true, created_at: "", updated_at: "" },
    farmer_profile: { id: "fp-4", profile_id: "farmer-4", farm_name: "Jashore Green Agro", bio: "Year-round seasonal vegetables and greenhouse produce.", division: "Khulna", district: "Jashore", upazila: "Bagherpara", land_size: 8, years_of_experience: 9, is_verified: true, verification_status: "approved", nid_number: "1991271829312", phone_verified: true, rating: 4.6, total_sales: 64, created_at: "", updated_at: "" }
  },
  {
    id: "prod-5",
    farmer_id: "farmer-5",
    name: "Meghna River Wild Hilsa Fish (মেঘনার টাটকা ইলিশ)",
    category: "fish",
    description: "Authentic river Hilsa caught fresh in Chandpur Meghna confluence. Graded 900g-1.1kg per piece, preserved on ice immediately after netting.",
    quantity: 350,
    unit: "kg",
    price_per_unit: 1450,
    harvest_date: "2026-11-17",
    availability_date: "2026-11-18",
    division: "Chattogram",
    district: "Chandpur",
    upazila: "Haimchar",
    status: "active",
    is_featured: true,
    view_count: 890,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: "img-5", product_id: "prod-5", url: "https://images.unsplash.com/photo-1534943441045-1089b75eb353?auto=format&fit=crop&w=800&q=80", storage_path: null, is_primary: true, sort_order: 0, created_at: "" }],
    farmer: { id: "farmer-5", email: "delwar.hossain@fisheries.bd", full_name: "Delwar Hossain Majhi", avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80", role: "farmer", phone: "+880 1715-998877", is_active: true, created_at: "", updated_at: "" },
    farmer_profile: { id: "fp-5", profile_id: "farmer-5", farm_name: "Chandpur Fisheries Co-op", bio: "Chandpur river fishermen collective supplying genuine Meghna fish.", division: "Chattogram", district: "Chandpur", upazila: "Haimchar", land_size: 0, years_of_experience: 30, is_verified: true, verification_status: "approved", nid_number: "1970271829355", phone_verified: true, rating: 5.0, total_sales: 420, created_at: "", updated_at: "" }
  },
  {
    id: "prod-6",
    farmer_id: "farmer-6",
    name: "Organic Red Lentils / Masoor Dal (দেশি লাল মসুর ডাল)",
    category: "pulses",
    description: "Cleaned, stone-free deshi small-grain red lentil. Unpolished with rich protein content and authentic rural aroma from Kushtia.",
    quantity: 1200,
    unit: "kg",
    price_per_unit: 135,
    harvest_date: "2026-10-15",
    availability_date: "2026-11-19",
    division: "Khulna",
    district: "Kushtia",
    upazila: "Kumarkhali",
    status: "active",
    is_featured: false,
    view_count: 195,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: "img-6", product_id: "prod-6", url: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80", storage_path: null, is_primary: true, sort_order: 0, created_at: "" }],
    farmer: { id: "farmer-6", email: "moklesur.rahman@farmer.bd", full_name: "Moklesur Rahman", avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", role: "farmer", phone: "+880 1823-112233", is_active: true, created_at: "", updated_at: "" },
    farmer_profile: { id: "fp-6", profile_id: "farmer-6", farm_name: "Lalon Agro", bio: "Sustainable pulse and cereal farming along Gorai river basin.", division: "Khulna", district: "Kushtia", upazila: "Kumarkhali", land_size: 12, years_of_experience: 15, is_verified: true, verification_status: "approved", nid_number: "1983271829388", phone_verified: true, rating: 4.8, total_sales: 88, created_at: "", updated_at: "" }
  }
]

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

    // Sort order
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
      // Return high-quality initial products filtered in-memory
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

    // Check mock/initial data
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

    // Insert images if any
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

    if (!user) return []

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return INITIAL_PRODUCTS.filter(p => p.farmer_id === 'farmer-1')
    }

    return data as Product[]
  } catch {
    return INITIAL_PRODUCTS.filter(p => p.farmer_id === 'farmer-1')
  }
}
