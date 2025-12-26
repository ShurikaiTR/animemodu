-- =====================================================
-- SUPABASE LEGACY FUNCTION CLEANUP SCRIPT
-- =====================================================
-- Bu script, artik kullanilmayan ve linter uyarisi veren 
-- eski fonksiyonlari temizlemek icin hazirlanmistir.
-- 
-- ! DIKKAT: Bu scripti calistirmadan once asagidaki kontrol
-- sorgusunu calistirarak fonksiyonlarin hala bir trigger 
-- tarafindan kullanilip kullanilmadigini teyit edebilirsiniz.
-- =====================================================

/*
-- KONTROL SORGUSU (Hangi fonksiyon hangi trigger tarafindan kullaniliyor?)
SELECT 
    trigger_name, 
    event_object_table as table_name,
    action_statement as function_call
FROM information_schema.triggers
WHERE action_statement LIKE ANY (ARRAY[
    '%update_characters_updated_at%',
    '%update_comments_updated_at%',
    '%update_comment_likes_count%',
    '%update_page_seo_settings_updated_at%',
    '%update_anime_updated_at%',
    '%update_site_settings_timestamp%',
    '%update_anime_episodes_updated_at%'
]);
*/

-- 1. Eski karakter guncelleme fonksiyonu
DROP FUNCTION IF EXISTS public.update_characters_updated_at() CASCADE;

-- 2. Eski yorum guncelleme fonksiyonu
DROP FUNCTION IF EXISTS public.update_comments_updated_at() CASCADE;

-- 3. Eski yorum begeni sayaci (Cogul isimli olan)
DROP FUNCTION IF EXISTS public.update_comment_likes_count() CASCADE;

-- 4. Eski SEO ayarlari fonksiyonu
DROP FUNCTION IF EXISTS public.update_page_seo_settings_updated_at() CASCADE;

-- 5. Eski anime guncelleme fonksiyonu (handle_anime_updated_at su anki valid ismimiz)
DROP FUNCTION IF EXISTS public.update_anime_updated_at() CASCADE;

-- 6. Eski site ayarlari timestamp fonksiyonu
DROP FUNCTION IF EXISTS public.update_site_settings_timestamp() CASCADE;

-- 7. Eski anime bolum guncelleme fonksiyonu
DROP FUNCTION IF EXISTS public.update_anime_episodes_updated_at() CASCADE;

-- =====================================================
-- BILGI: CASCADE kullanildigi icin, eger bu fonksiyonlara
-- bagli "olmamasi gereken" eski triggerlar varsa onlar da 
-- otomatik olarak silinecektir.
-- =====================================================
