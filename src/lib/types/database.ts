import { UserRole, ProductCategory, OrderStatus, UnitType, Division } from "@/lib/constants"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FarmerProfile {
  id: string
  profile_id: string
  farm_name: string | null
  bio: string | null
  division: Division | null
  district: string | null
  upazila: string | null
  land_size: number | null
  years_of_experience: number | null
  is_verified: boolean
  verification_status: "pending" | "approved" | "rejected"
  nid_number: string | null
  phone_verified: boolean
  rating: number
  total_sales: number
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface BuyerProfile {
  id: string
  profile_id: string
  business_name: string | null
  bio: string | null
  preferred_districts: string[] | null
  total_orders: number
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Product {
  id: string
  farmer_id: string
  name: string
  category: ProductCategory
  description: string | null
  quantity: number
  unit: UnitType
  price_per_unit: number
  harvest_date: string | null
  availability_date: string | null
  expiry_date?: string | null
  division: Division | null
  district: string | null
  upazila: string | null
  status: "active" | "inactive" | "sold_out" | "removed"
  is_featured: boolean
  view_count: number
  ai_description?: string | null
  ai_category_suggestion?: string | null
  created_at: string
  updated_at: string
  images?: ProductImage[]
  farmer?: Profile
  farmer_profile?: FarmerProfile
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string | null
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  farmer_id: string
  product_id: string
  quantity: number
  price_per_unit: number
  total_amount: number
  status: OrderStatus
  buyer_note: string | null
  farmer_note: string | null
  delivery_address: string | null
  payment_method: string
  accepted_at: string | null
  rejected_at: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
  product?: Product
  buyer?: Profile
  farmer?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  reference_id: string | null
  reference_type: string | null
  created_at: string
}

export interface Inquiry {
  id: string
  buyer_id: string
  farmer_id: string
  product_id: string | null
  subject: string
  message: string
  reply: string | null
  replied_at: string | null
  is_read: boolean
  created_at: string
  updated_at: string
  buyer?: Profile
  farmer?: Profile
  product?: Product
}

export interface Favorite {
  id: string
  buyer_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface PriceHistory {
  id: string
  product_id: string
  category: ProductCategory
  district: string | null
  price: number
  unit: UnitType
  recorded_at: string
}

export interface FarmerVerification {
  id: string
  farmer_id: string
  submitted_by: string
  status: "pending" | "approved" | "rejected"
  nid_document_url: string | null
  land_document_url: string | null
  selfie_url: string | null
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  farmer?: Profile
}
