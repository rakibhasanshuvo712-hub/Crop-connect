-- ============================================================
-- Supabase Storage Buckets
-- ============================================================

-- Product images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 
  'product-images', 
  true, -- Public access for product images
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Avatar images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Verification documents bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-docs', 
  'verification-docs', 
  false, -- Private
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage RLS Policies
-- ============================================================

-- Product images: Public read
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Product images: Authenticated farmers can upload
CREATE POLICY "product_images_farmer_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- Product images: Farmers can delete their own
CREATE POLICY "product_images_farmer_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars: Public read
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Avatars: Users can upload their own
CREATE POLICY "avatars_self_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_self_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Verification docs: Only the farmer and admins
CREATE POLICY "verification_docs_farmer_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-docs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "verification_docs_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-docs'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- ============================================================
-- Seed: Create admin account (requires manual auth setup)
-- Instructions: Create user in Supabase Auth dashboard first,
-- then run this with the user's UUID
-- ============================================================

-- Create a function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM profiles WHERE email = user_email;
  
  IF NOT FOUND THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  UPDATE profiles SET role = 'admin' WHERE id = v_user_id;
  
  -- Remove any existing role-specific profile and clean up
  RETURN 'User ' || user_email || ' promoted to admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
