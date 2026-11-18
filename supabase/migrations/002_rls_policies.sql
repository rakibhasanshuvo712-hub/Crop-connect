-- ============================================================
-- Row Level Security Policies for CropConnect
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS for role checking
-- ============================================================

CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_farmer()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'farmer')
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES policies
-- ============================================================

-- Anyone can view profiles (needed for farmer profiles/product pages)
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- System can insert profiles (via handle_new_user trigger)
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (is_admin());

-- ============================================================
-- FARMER_PROFILES policies
-- ============================================================

CREATE POLICY "farmer_profiles_public_read" ON farmer_profiles
  FOR SELECT USING (true);

CREATE POLICY "farmer_profiles_self_update" ON farmer_profiles
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "farmer_profiles_self_insert" ON farmer_profiles
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "farmer_profiles_admin_update" ON farmer_profiles
  FOR UPDATE USING (is_admin());

-- ============================================================
-- BUYER_PROFILES policies
-- ============================================================

CREATE POLICY "buyer_profiles_self_read" ON buyer_profiles
  FOR SELECT USING (auth.uid() = profile_id OR is_admin());

CREATE POLICY "buyer_profiles_self_update" ON buyer_profiles
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "buyer_profiles_self_insert" ON buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ============================================================
-- PRODUCTS policies
-- ============================================================

-- Public can view active products
CREATE POLICY "products_public_read_active" ON products
  FOR SELECT USING (status = 'active' OR farmer_id = auth.uid() OR is_admin());

-- Farmers can insert their own products
CREATE POLICY "products_farmer_insert" ON products
  FOR INSERT WITH CHECK (
    auth.uid() = farmer_id AND is_farmer()
  );

-- Farmers can update their own products only
CREATE POLICY "products_farmer_update" ON products
  FOR UPDATE USING (
    auth.uid() = farmer_id AND is_farmer()
  ) WITH CHECK (
    auth.uid() = farmer_id AND is_farmer()
  );

-- Farmers can delete their own products (soft delete via status)
CREATE POLICY "products_farmer_delete" ON products
  FOR DELETE USING (
    auth.uid() = farmer_id AND is_farmer()
  );

-- Admins can manage all products
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (is_admin());

-- ============================================================
-- PRODUCT_IMAGES policies
-- ============================================================

-- Public can view images of active products
CREATE POLICY "product_images_public_read" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_images.product_id 
      AND (status = 'active' OR farmer_id = auth.uid())
    )
  );

-- Farmers can manage images of their own products
CREATE POLICY "product_images_farmer_insert" ON product_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_images.product_id AND farmer_id = auth.uid()
    )
  );

CREATE POLICY "product_images_farmer_delete" ON product_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_images.product_id AND farmer_id = auth.uid()
    )
  );

-- ============================================================
-- ORDERS policies
-- ============================================================

-- Buyers can see their own orders
CREATE POLICY "orders_buyer_read" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);

-- Farmers can see orders for their products
CREATE POLICY "orders_farmer_read" ON orders
  FOR SELECT USING (auth.uid() = farmer_id);

-- Buyers can create orders (via place_order function which handles validation)
CREATE POLICY "orders_buyer_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Buyers can cancel their own pending orders
CREATE POLICY "orders_buyer_cancel" ON orders
  FOR UPDATE USING (
    auth.uid() = buyer_id AND status = 'pending'
  ) WITH CHECK (
    auth.uid() = buyer_id AND status = 'cancelled'
  );

-- Farmers can update status of their orders (via update_order_status function)
CREATE POLICY "orders_farmer_update" ON orders
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Admins can see all orders
CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (is_admin());

-- ============================================================
-- NOTIFICATIONS policies
-- ============================================================

-- Users can see their own notifications
CREATE POLICY "notifications_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System functions can insert notifications (via SECURITY DEFINER functions)
CREATE POLICY "notifications_system_insert" ON notifications
  FOR INSERT WITH CHECK (true); -- Controlled by SECURITY DEFINER functions

-- ============================================================
-- FAVORITES policies
-- ============================================================

CREATE POLICY "favorites_buyer_read" ON favorites
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "favorites_buyer_insert" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "favorites_buyer_delete" ON favorites
  FOR DELETE USING (auth.uid() = buyer_id);

-- ============================================================
-- INQUIRIES policies
-- ============================================================

-- Buyers can see their own inquiries
CREATE POLICY "inquiries_buyer_read" ON inquiries
  FOR SELECT USING (auth.uid() = buyer_id);

-- Farmers can see inquiries sent to them
CREATE POLICY "inquiries_farmer_read" ON inquiries
  FOR SELECT USING (auth.uid() = farmer_id);

-- Buyers can create inquiries
CREATE POLICY "inquiries_buyer_insert" ON inquiries
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Farmers can reply to inquiries
CREATE POLICY "inquiries_farmer_reply" ON inquiries
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Admins can read all inquiries
CREATE POLICY "inquiries_admin_read" ON inquiries
  FOR SELECT USING (is_admin());

-- ============================================================
-- FARMER_VERIFICATIONS policies
-- ============================================================

CREATE POLICY "verifications_farmer_read" ON farmer_verifications
  FOR SELECT USING (auth.uid() = farmer_id OR is_admin());

CREATE POLICY "verifications_farmer_insert" ON farmer_verifications
  FOR INSERT WITH CHECK (auth.uid() = farmer_id AND is_farmer());

CREATE POLICY "verifications_admin_update" ON farmer_verifications
  FOR UPDATE USING (is_admin());

-- ============================================================
-- PRICE_HISTORY policies
-- ============================================================

-- Public read for market insights
CREATE POLICY "price_history_public_read" ON price_history
  FOR SELECT USING (true);

-- Only system functions can insert
CREATE POLICY "price_history_system_insert" ON price_history
  FOR INSERT WITH CHECK (true); -- Via SECURITY DEFINER functions

-- ============================================================
-- PRODUCT_REPORTS policies
-- ============================================================

CREATE POLICY "reports_read_own" ON product_reports
  FOR SELECT USING (auth.uid() = reporter_id OR is_admin());

CREATE POLICY "reports_insert" ON product_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_admin_update" ON product_reports
  FOR UPDATE USING (is_admin());
