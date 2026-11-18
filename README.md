# 🌾 CropConnect — AI-Powered Agricultural Marketplace for Bangladesh

> **"Connecting Farmers. Empowering Agriculture."**
> **"কৃষকের মুখে হাসি, ন্যায্য দামে ফসলের বাজার"**

CropConnect is a production-quality, full-stack agricultural marketplace designed specifically for Bangladesh. The platform bridges rural farmers directly with wholesale buyers, retail super-shops, and consumers, eliminating unnecessary middlemen markups, preventing food waste, and ensuring fair prices.

---

## 🚀 Key Features

### 👨‍🌾 1. Farmer Portal
- **Direct Crop Listings**: List agricultural harvests with quantity, unit (kg, mon, ton, sack), price per unit, harvest date, and geographical location.
- **AI Product Assistant**: 1-click professional listing descriptions generated in **Bangla** and **English** with full farmer review and editability.
- **AI Agricultural Image Classifier**: Upload crop images to automatically detect category with confidence ratings and manual category fallback.
- **Order Management Workflow**: Review incoming orders with state transitions: `Pending` ➔ `Accepted` ➔ `Preparing` ➔ `Ready for Delivery` ➔ `Delivered` (with stock safety and stock rollback on decline).
- **Earnings & Sales Analytics**: Visual performance analytics powered by Recharts.
- **Farmer Verification Badge**: National ID (NID) and agricultural landholder verification.

### 🛒 2. Buyer Portal
- **Filterable National Catalog**: Search by crop variety, division, district, price slider, and sorting.
- **AI Smart Match Engine**: Matches buyers with verified local farmers based on product category, required volume, maximum budget, and district proximity.
- **Direct Order Placement**: Client total calculations are verified and executed server-side.
- **Live Order Tracking & History**: Track order progression from farm packing to doorstep delivery.
- **Favorite Produce**: Save favorite farmers and crops for one-click re-orders.

### 🛡️ 3. Admin Center
- **Farmer Verification Queue**: Review NID documents and cultivable land records to grant the verified badge.
- **Listing Moderation**: Supervise agricultural listings and prevent suspicious or prohibited products.
- **Transaction Audit Log**: Monitor marketplace orders, delivery completion, and platform GMV.

### 🤖 4. AI & Intelligence Features
1. **Bangla-First AI Agricultural Assistant**: Interactive chatbot with domain knowledge, guidance on listing, pricing, and order management.
2. **Strict Agricultural Safety Guardrails**: AI never prescribes dangerous chemical/pesticide dosages or medical advice, redirecting instead to government DAE extension officers and helpline `16123`.
3. **AI Market Insights**: Real-time average asking prices by category, district supply indices, and 4-week price trend trajectories with clear disclaimers.
4. **Smart Fallback Engine**: Fully functional offline and in local development even when local LLMs (Ollama) are unavailable.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Sonner
- **Backend**: Next.js Server Actions, Route Handlers, Python FastAPI
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth, Supabase Storage
- **AI Engine**: Ollama (llama3.2:3b / phi3:mini), FastAPI microservice, heuristic rule engines
- **Localization**: Bangla & English dual support

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ & npm
- (Optional) Python 3.9+ & Ollama for local LLM inference

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/rakibhasanshuvo712-hub/Crop-connect.git
cd Crop-connect

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials (see `SUPABASE_SETUP.md` for SQL migrations).

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view CropConnect.

### 5. (Optional) Run Local AI Service
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## 🗄️ Database Setup (Supabase)
Run the SQL migrations located in `supabase/migrations/` in order:
1. `001_initial_schema.sql` — 14 normalized tables, atomic order functions, and triggers.
2. `002_rls_policies.sql` — Row Level Security (RLS) policies for multi-role security.
3. `003_storage_seed.sql` — Storage buckets for product images and verification documents.

---

## 🚢 Deployment to Vercel

1. Push your code to GitHub (branch `main`).
2. Import repository in [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Click **Deploy**.

---

## 📄 License
MIT License. Built for the farmers and people of Bangladesh.
