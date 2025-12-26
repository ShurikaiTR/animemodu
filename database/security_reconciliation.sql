-- =====================================================
-- SUPABASE SECURITY RECONCILIATION SCRIPT
-- =====================================================
-- Bu script, yerel kod tabanında bulunmayan ancak Supabase Linter 
-- tarafından raporlanan "hayalet" (legacy veya manuel oluşturulmuş) 
-- fonksiyonları güvenli hale getirmek için hazırlanmıştır.
-- =====================================================

-- 1. Character updated_at hook
ALTER FUNCTION IF EXISTS public.update_characters_updated_at() SET search_path = public;

-- 2. Comments updated_at hook
ALTER FUNCTION IF EXISTS public.update_comments_updated_at() SET search_path = public;

-- 3. Comment likes count hook (Plural version)
ALTER FUNCTION IF EXISTS public.update_comment_likes_count() SET search_path = public;

-- 4. SEO settings updated_at hook
ALTER FUNCTION IF EXISTS public.update_page_seo_settings_updated_at() SET search_path = public;

-- 5. Anime updated_at hook (Alternate name)
ALTER FUNCTION IF EXISTS public.update_anime_updated_at() SET search_path = public;

-- 6. Site settings timestamp hook
ALTER FUNCTION IF EXISTS public.update_site_settings_timestamp() SET search_path = public;

-- 7. Anime episodes updated_at hook
ALTER FUNCTION IF EXISTS public.update_anime_episodes_updated_at() SET search_path = public;

-- 8. General updated_at hook
ALTER FUNCTION IF EXISTS public.handle_updated_at() SET search_path = public;

-- 9. General anime updated_at hook
ALTER FUNCTION IF EXISTS public.handle_anime_updated_at() SET search_path = public;

-- 10. Reports hook
ALTER FUNCTION IF EXISTS public.handle_reports_updated_at() SET search_path = public;

-- 11. New user hook (Security Definer functions should ideally have search_path = '')
ALTER FUNCTION IF EXISTS public.handle_new_user() SET search_path = public;

-- =====================================================
-- BILGI: "Leaked Password Protection" ayarı SQL ile değil, 
-- Dashboard -> Auth -> Settings üzerinden yapılmalıdır.
-- =====================================================
