export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh"
] as const

export type Division = typeof DIVISIONS[number]

export const DISTRICTS: Record<Division, string[]> = {
  "Dhaka": ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur"],
  "Chattogram": ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Brahmanbaria", "Noakhali", "Chandpur", "Lakshmipur", "Rangamati", "Khagrachhari", "Bandarban"],
  "Rajshahi": ["Rajshahi", "Bogura", "Joypurhat", "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Sirajganj"],
  "Khulna": ["Khulna", "Bagerhat", "Satkhira", "Jashore", "Jhenaidah", "Magura", "Narail", "Chuadanga", "Kushtia", "Meherpur"],
  "Barishal": ["Barishal", "Barguna", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur"],
  "Sylhet": ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  "Rangpur": ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
  "Mymensingh": ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
}

export const PRODUCT_CATEGORIES = [
  { id: "rice", name: "Rice", nameBn: "ধান ও চাল", icon: "🌾", desc: "Aman, Boro, Aus, Miniket, Nazirshail, aromatic chinigura" },
  { id: "wheat", name: "Wheat & Grains", nameBn: "গম ও দানাশস্য", icon: "🌿", desc: "Fresh harvest wheat, maize, corn" },
  { id: "potato", name: "Potato", nameBn: "আলু", icon: "🥔", desc: "Diamond, Granola, Cardinal, indigenous red potato" },
  { id: "onion", name: "Onion & Garlic", nameBn: "পেঁয়াজ ও রসুন", icon: "🧅", desc: "Taherpuri, local Murikata, Deshi red onion" },
  { id: "tomato", name: "Tomato", nameBn: "টমেটো", icon: "🍅", desc: "Winter ripe tomatoes, organic farm harvest" },
  { id: "vegetables", name: "Vegetables", nameBn: "তাজা শাকসবজি", icon: "🥦", desc: "Eggplant, cauliflower, cabbage, gourd, green chili" },
  { id: "fruits", name: "Seasonal Fruits", nameBn: "মৌসুমি ফল", icon: "🥭", desc: "Mango (Fazli, Langra, Amrapali), jackfruit, banana, guava" },
  { id: "fish", name: "Fish & Aquaculture", nameBn: "মাছ ও মৎস্য", icon: "🐟", desc: "Rui, Katla, Hilsha, Pangas, Tilapia, Shrimp" },
  { id: "pulses", name: "Pulses & Lentils", nameBn: "ডাল", icon: "🌱", desc: "Masoor, Moong, Kheshari, Chickpeas" },
  { id: "spices", name: "Spices", nameBn: "মসলাপাতি", icon: "🌶️", desc: "Ginger, turmeric, coriander, red dried chili" },
  { id: "other", name: "Other Agricultural", nameBn: "অন্যান্য কৃষিপণ্য", icon: "📦", desc: "Jute, honey, dairy, seeds, organic fertilizer" }
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]["id"]

export const UNITS = [
  { id: "kg", name: "Kilogram (কেজি)", short: "kg" },
  { id: "mon", name: "Mon / মণ (40 kg)", short: "mon" },
  { id: "ton", name: "Metric Ton (টন)", short: "ton" },
  { id: "sack", name: "Sack / বস্তা (50 kg)", short: "sack" },
  { id: "piece", name: "Piece (পিস)", short: "pc" },
  { id: "dozen", name: "Dozen (ডজন)", short: "doz" },
  { id: "quintal", name: "Quintal (কুইন্টাল / 100 kg)", short: "qtl" }
] as const

export type UnitType = typeof UNITS[number]["id"]

export const ORDER_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "preparing",
  "ready_for_delivery",
  "delivered",
  "cancelled"
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]

export const ORDER_STATUS_DETAILS: Record<OrderStatus, { en: string; bn: string; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { en: "Pending Review", bn: "অনুমোদনের অপেক্ষায়", color: "text-amber-600 bg-amber-50 border-amber-200", badgeVariant: "outline" },
  accepted: { en: "Accepted", bn: "গৃহীত হয়েছে", color: "text-blue-600 bg-blue-50 border-blue-200", badgeVariant: "secondary" },
  rejected: { en: "Declined", bn: "প্রত্যাখ্যাত", color: "text-rose-600 bg-rose-50 border-rose-200", badgeVariant: "destructive" },
  preparing: { en: "Packaging & Preparing", bn: "প্যাকিং ও প্রস্তুতি চলছে", color: "text-indigo-600 bg-indigo-50 border-indigo-200", badgeVariant: "secondary" },
  ready_for_delivery: { en: "Ready for Dispatch", bn: "ডেলিভারির জন্য প্রস্তুত", color: "text-purple-600 bg-purple-50 border-purple-200", badgeVariant: "secondary" },
  delivered: { en: "Delivered", bn: "সফলভাবে সম্পন্ন", color: "text-emerald-700 bg-emerald-50 border-emerald-200", badgeVariant: "default" },
  cancelled: { en: "Cancelled", bn: "বাতিল", color: "text-slate-600 bg-slate-50 border-slate-200", badgeVariant: "outline" }
}

export const USER_ROLES = ["farmer", "buyer", "admin"] as const
export type UserRole = typeof USER_ROLES[number]

export { UPAZILAS, ALL_DISTRICTS, getUpazilasForDistrict, getDistrictsForDivision } from "./geo"

export const APP_CONFIG = {
  name: "কৃষিবাজার",
  nameBn: "কৃষিবাজার",
  nameEn: "KrishiBazar",
  tagline: "কৃষকের মুখে হাসি, ন্যায্য দামে ফসলের বাজার",
  taglineBn: "কৃষকের মুখে হাসি, ন্যায্য দামে ফসলের বাজার",
  taglineEn: "Connecting Farmers. Empowering Agriculture.",
  description: "বাংলাদেশের শীর্ষস্থানীয় এআই-চালিত ডিজিটাল কৃষি বাজার — মধ্যস্বত্বভোগী ছাড়া কৃষক ও পাইকারি ক্রেতার সরাসরি কেনাবেচা।",
  contactEmail: "support@krishibazar.bd",
  contactPhone: "+880 1700-000000",
  address: "ঢাকা, বাংলাদেশ"
}
