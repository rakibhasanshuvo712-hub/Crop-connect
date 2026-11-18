-- ============================================================
-- CropConnect Database Schema
-- Migration: 001_initial_schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'sold_out');
CREATE TYPE order_status AS ENUM (
  'pending', 'accepted', 'rejected', 'preparing', 
  'ready_for_delivery', 'delivered', 'cancelled'
);
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- ============================================================
-- TABLE: profiles (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'buyer',
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- TABLE: farmer_profiles
-- ============================================================

CREATE TABLE farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  farm_name TEXT,
  bio TEXT,
  division TEXT,
  district TEXT,
  upazila TEXT,
  land_size NUMERIC(10,2), -- in acres
  years_of_experience INTEGER CHECK (years_of_experience >= 0 AND years_of_experience <= 100),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  nid_number TEXT, -- National ID - stored for verification
  phone_verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_sales INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_farmer_profiles_district ON farmer_profiles(district);
CREATE INDEX idx_farmer_profiles_division ON farmer_profiles(division);
CREATE INDEX idx_farmer_profiles_verified ON farmer_profiles(is_verified);

-- ============================================================
-- TABLE: buyer_profiles
-- ============================================================

CREATE TABLE buyer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  preferred_districts TEXT[], -- array of preferred districts
  total_orders INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: products
-- ============================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 200),
  category TEXT NOT NULL CHECK (category IN (
    'rice', 'wheat', 'potato', 'onion', 'tomato', 
    'vegetables', 'fruits', 'fish', 'pulses', 'spices', 'other'
  )),
  description TEXT,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity >= 0),
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'ton', 'piece', 'sack', 'dozen', 'quintal')),
  price_per_unit NUMERIC(10,2) NOT NULL CHECK (price_per_unit > 0),
  harvest_date DATE,
  availability_date DATE,
  division TEXT,
  district TEXT,
  upazila TEXT,
  status product_status NOT NULL DEFAULT 'active',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  -- AI-generated fields
  ai_description TEXT, -- AI generated description
  ai_category_suggestion TEXT, -- AI suggested category
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_district ON products(district);
CREATE INDEX idx_products_division ON products(division);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price_per_unit);
-- Full text search index
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- ============================================================
-- TABLE: product_images
-- ============================================================

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT, -- Supabase storage path for deletion
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Ensure only one primary image per product
CREATE UNIQUE INDEX idx_product_images_primary ON product_images(product_id) 
  WHERE is_primary = true;

-- ============================================================
-- TABLE: orders
-- ============================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  -- Price captured at time of order (immutable after creation)
  price_per_unit NUMERIC(10,2) NOT NULL CHECK (price_per_unit > 0),
  total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount > 0),
  status order_status NOT NULL DEFAULT 'pending',
  buyer_note TEXT,
  farmer_note TEXT,
  delivery_address TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  -- Timestamps for status changes
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Ensure total is correct (server-computed)
  CONSTRAINT total_amount_check CHECK (
    ABS(total_amount - (quantity * price_per_unit)) < 0.01
  )
);

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================================
-- TABLE: notifications
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'order_new', 'order_accepted', 'order_rejected', 
    'order_status_change', 'product_low_stock', 
    'inquiry_new', 'system', 'farmer_verified'
  )),
  is_read BOOLEAN NOT NULL DEFAULT false,
  reference_id UUID, -- ID of related entity (order, product, etc.)
  reference_type TEXT, -- 'order', 'product', 'inquiry', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================
-- TABLE: favorites
-- ============================================================

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(buyer_id, product_id)
);

CREATE INDEX idx_favorites_buyer ON favorites(buyer_id);

-- ============================================================
-- TABLE: inquiries
-- ============================================================

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  replied_at TIMESTAMPTZ,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiries_farmer ON inquiries(farmer_id);
CREATE INDEX idx_inquiries_buyer ON inquiries(buyer_id);

-- ============================================================
-- TABLE: farmer_verifications
-- ============================================================

CREATE TABLE farmer_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES profiles(id),
  status verification_status NOT NULL DEFAULT 'pending',
  nid_document_url TEXT,
  land_document_url TEXT,
  selfie_url TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_farmer_verifications_status ON farmer_verifications(status);

-- ============================================================
-- TABLE: price_history
-- ============================================================

CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  district TEXT,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_category ON price_history(category, recorded_at DESC);
CREATE INDEX idx_price_history_district ON price_history(district, category);

-- ============================================================
-- TABLE: product_reports
-- ============================================================

CREATE TABLE product_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reporter_id, product_id) -- One report per user per product
);

CREATE INDEX idx_product_reports_status ON product_reports(status);

-- ============================================================
-- TRIGGERS: Updated At Auto-Update
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER farmer_profiles_updated_at BEFORE UPDATE ON farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER buyer_profiles_updated_at BEFORE UPDATE ON buyer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER farmer_verifications_updated_at BEFORE UPDATE ON farmer_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCTION: Create profile on user signup (via trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create role-specific profile
  IF (NEW.raw_user_meta_data->>'role') = 'farmer' THEN
    INSERT INTO farmer_profiles (profile_id) VALUES (NEW.id);
  ELSE
    INSERT INTO buyer_profiles (profile_id) VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: Order placement with stock check (atomic)
-- ============================================================

CREATE OR REPLACE FUNCTION place_order(
  p_buyer_id UUID,
  p_product_id UUID,
  p_quantity NUMERIC,
  p_buyer_note TEXT DEFAULT NULL,
  p_delivery_address TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_product products%ROWTYPE;
  v_order orders%ROWTYPE;
  v_total NUMERIC;
BEGIN
  -- Lock the product row to prevent race conditions
  SELECT * INTO v_product FROM products 
  WHERE id = p_product_id AND status = 'active'
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Product not found or not available');
  END IF;
  
  IF v_product.quantity < p_quantity THEN
    RETURN json_build_object('error', 'Insufficient stock. Available: ' || v_product.quantity || ' ' || v_product.unit);
  END IF;
  
  IF v_product.farmer_id = p_buyer_id THEN
    RETURN json_build_object('error', 'You cannot order your own product');
  END IF;
  
  -- Calculate total server-side (never trust client)
  v_total := p_quantity * v_product.price_per_unit;
  
  -- Create order
  INSERT INTO orders (
    buyer_id, farmer_id, product_id, quantity, 
    price_per_unit, total_amount, status,
    buyer_note, delivery_address
  ) VALUES (
    p_buyer_id, v_product.farmer_id, p_product_id, p_quantity,
    v_product.price_per_unit, v_total, 'pending',
    p_buyer_note, p_delivery_address
  ) RETURNING * INTO v_order;
  
  -- Deduct stock immediately (reserve it)
  UPDATE products 
  SET quantity = quantity - p_quantity,
      status = CASE WHEN quantity - p_quantity <= 0 THEN 'sold_out'::product_status ELSE status END
  WHERE id = p_product_id;
  
  -- Notify farmer
  INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type)
  VALUES (
    v_product.farmer_id,
    'New Order Received',
    'You have a new order for ' || p_quantity || ' ' || v_product.unit || ' of ' || v_product.name,
    'order_new',
    v_order.id,
    'order'
  );
  
  -- Record price history
  INSERT INTO price_history (product_id, category, district, price, unit)
  VALUES (p_product_id, v_product.category, v_product.district, v_product.price_per_unit, v_product.unit);
  
  RETURN json_build_object('success', true, 'order_id', v_order.id, 'total', v_total);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: Update order status (farmer only, with rollback logic)
-- ============================================================

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_farmer_id UUID,
  p_new_status order_status,
  p_farmer_note TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_order orders%ROWTYPE;
  v_allowed_transitions order_status[];
BEGIN
  SELECT * INTO v_order FROM orders 
  WHERE id = p_order_id AND farmer_id = p_farmer_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Order not found or not authorized');
  END IF;
  
  -- Define valid status transitions
  CASE v_order.status
    WHEN 'pending' THEN v_allowed_transitions := ARRAY['accepted', 'rejected']::order_status[];
    WHEN 'accepted' THEN v_allowed_transitions := ARRAY['preparing']::order_status[];
    WHEN 'preparing' THEN v_allowed_transitions := ARRAY['ready_for_delivery']::order_status[];
    WHEN 'ready_for_delivery' THEN v_allowed_transitions := ARRAY['delivered']::order_status[];
    ELSE v_allowed_transitions := ARRAY[]::order_status[];
  END CASE;
  
  IF NOT (p_new_status = ANY(v_allowed_transitions)) THEN
    RETURN json_build_object('error', 'Invalid status transition from ' || v_order.status || ' to ' || p_new_status);
  END IF;
  
  -- Update order
  UPDATE orders SET
    status = p_new_status,
    farmer_note = COALESCE(p_farmer_note, farmer_note),
    accepted_at = CASE WHEN p_new_status = 'accepted' THEN now() ELSE accepted_at END,
    rejected_at = CASE WHEN p_new_status = 'rejected' THEN now() ELSE rejected_at END,
    delivered_at = CASE WHEN p_new_status = 'delivered' THEN now() ELSE delivered_at END
  WHERE id = p_order_id;
  
  -- Restore stock if rejected
  IF p_new_status = 'rejected' THEN
    UPDATE products SET 
      quantity = quantity + v_order.quantity,
      status = 'active'
    WHERE id = v_order.product_id;
  END IF;
  
  -- Update farmer sales count on delivery
  IF p_new_status = 'delivered' THEN
    UPDATE farmer_profiles SET total_sales = total_sales + 1
    WHERE profile_id = p_farmer_id;
    UPDATE buyer_profiles SET total_orders = total_orders + 1
    WHERE profile_id = v_order.buyer_id;
  END IF;
  
  -- Notify buyer
  INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type)
  VALUES (
    v_order.buyer_id,
    'Order ' || initcap(replace(p_new_status::text, '_', ' ')),
    'Your order status has been updated to: ' || initcap(replace(p_new_status::text, '_', ' ')),
    'order_status_change',
    p_order_id,
    'order'
  );
  
  RETURN json_build_object('success', true, 'new_status', p_new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: Get market insights (AI-ready analytics)
-- ============================================================

CREATE OR REPLACE FUNCTION get_market_insights(
  p_category TEXT DEFAULT NULL,
  p_district TEXT DEFAULT NULL,
  p_days INTEGER DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'avg_prices', (
      SELECT json_agg(row_to_json(r)) FROM (
        SELECT 
          category,
          unit,
          district,
          ROUND(AVG(price_per_unit)::numeric, 2) as avg_price,
          MIN(price_per_unit) as min_price,
          MAX(price_per_unit) as max_price,
          COUNT(*) as listing_count
        FROM products
        WHERE status = 'active'
          AND (p_category IS NULL OR category = p_category)
          AND (p_district IS NULL OR district = p_district)
          AND created_at >= now() - (p_days || ' days')::interval
        GROUP BY category, unit, district
        ORDER BY listing_count DESC
        LIMIT 20
      ) r
    ),
    'recent_orders', (
      SELECT json_agg(row_to_json(r)) FROM (
        SELECT 
          p.category,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as total_value
        FROM orders o
        JOIN products p ON p.id = o.product_id
        WHERE o.status IN ('delivered', 'accepted', 'preparing', 'ready_for_delivery')
          AND o.created_at >= now() - (p_days || ' days')::interval
        GROUP BY p.category
        ORDER BY order_count DESC
      ) r
    ),
    'price_trend', (
      SELECT json_agg(row_to_json(r)) FROM (
        SELECT 
          category,
          district,
          DATE_TRUNC('week', recorded_at) as week,
          ROUND(AVG(price)::numeric, 2) as avg_price,
          unit
        FROM price_history
        WHERE (p_category IS NULL OR category = p_category)
          AND (p_district IS NULL OR district = p_district)
          AND recorded_at >= now() - (p_days || ' days')::interval
        GROUP BY category, district, week, unit
        ORDER BY week DESC
        LIMIT 50
      ) r
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
