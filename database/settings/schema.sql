-- Site Settings Table
-- Genel site ayarlarını saklar

CREATE TABLE IF NOT EXISTS site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    label VARCHAR(200),
    description TEXT,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public site bilgileri için)
CREATE POLICY "Site settings are viewable by everyone"
    ON site_settings FOR SELECT
    USING (true);

-- Sadece admin güncelleyebilir
CREATE POLICY "Only admins can update site settings"
    ON site_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = (select auth.uid())
            AND profiles.role = 'admin'
        )
    );

-- Sadece admin ekleyebilir
CREATE POLICY "Only admins can insert site settings"
    ON site_settings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = (select auth.uid())
            AND profiles.role = 'admin'
        )
    );

-- Sadece admin silebilir
CREATE POLICY "Only admins can delete site settings"
    ON site_settings FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = (select auth.uid())
            AND profiles.role = 'admin'
        )
    );

-- Updated_at trigger (uses shared handle_updated_at function)
drop trigger if exists set_site_settings_updated_at on site_settings;
create trigger set_site_settings_updated_at
    before update on site_settings
    for each row
    execute function public.handle_updated_at();

-- Default site bilgileri
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
    ('site_name', 'AnimeModu', 'text', 'general', 'Site Adı', 'Sitenin ana adı'),
    ('site_footer_text', 'Movies & TV Shows, Online cinema, Movie database. Türkçe altyazılı anime arşivi.', 'textarea', 'general', 'Footer Tanıtım Metni', 'Sitenin en altında (footer) görünen kısa tanıtım yazısı'),
    ('site_logo', '/img/animemodu-logo.svg', 'image', 'general', 'Site Logosu', 'Header''da görünen logo'),
    ('site_favicon', '/favicon.ico', 'image', 'general', 'Favicon', 'Tarayıcı sekmesinde görünen ikon'),
    -- Feature toggles
    ('maintenance_mode', 'false', 'boolean', 'advanced', 'Bakım Modu', 'Site bakım modunda olduğunda ziyaretçilere bakım sayfası gösterilir'),
    ('watch_together', 'false', 'boolean', 'content', 'Birlikte İzle', 'Kullanıcıların birlikte izleme özelliğini aktifleştirir'),
    -- Social media
    ('social_x', '', 'text', 'social', 'X (Twitter)', 'X hesabı URL''si'),
    ('social_instagram', '', 'text', 'social', 'Instagram', 'Instagram hesabı URL''si'),
    ('social_telegram', '', 'text', 'social', 'Telegram', 'Telegram kanal/grup URL''si'),
    ('social_discord', '', 'text', 'social', 'Discord', 'Discord sunucu davet linki'),
    ('social_reddit', '', 'text', 'social', 'Reddit', 'Reddit subreddit URL''si'),
    -- SEO - General
    ('seo_og_image', '/img/opengraph/opengraph.webp', 'text', 'seo', 'OG Görsel', 'Sosyal medya paylaşımlarında görünen varsayılan görsel'),
    -- SEO - Home
    ('seo_home_title', 'AnimeModu - Türkçe Altyazılı Anime İzle', 'text', 'seo', 'Ana Sayfa Başlığı', 'Ana sayfa meta başlık'),
    ('seo_home_description', 'En yeni animeleri Türkçe altyazılı olarak izleyin. Binlerce anime ve film arşivi.', 'text', 'seo', 'Ana Sayfa Açıklaması', 'Ana sayfa meta açıklama'),
    -- SEO - Discover
    ('seo_discover_title', 'Anime Keşfet - Tüm Animeler', 'text', 'seo', 'Keşfet Başlığı', 'Keşfet sayfası meta başlık'),
    ('seo_discover_description', 'Binlerce anime arasından arama yapın, türe göre filtreleyin ve izleme listenizi oluşturun.', 'text', 'seo', 'Keşfet Açıklaması', 'Keşfet sayfası meta açıklama'),
    -- SEO - Animes
    ('seo_animes_title', 'Anime Serileri - AnimeModu', 'text', 'seo', 'Animeler Başlığı', 'Animeler sayfası meta başlık'),
    ('seo_animes_description', 'En popüler anime serilerini keşfedin. Aksiyon, romantik, komedi ve daha fazlası.', 'text', 'seo', 'Animeler Açıklaması', 'Animeler sayfası meta açıklama'),
    -- SEO - Movies
    ('seo_movies_title', 'Anime Filmleri - AnimeModu', 'text', 'seo', 'Filmler Başlığı', 'Filmler sayfası meta başlık'),
    ('seo_movies_description', 'En iyi anime filmlerini Türkçe altyazılı izleyin. Ghibli, Makoto Shinkai ve daha fazlası.', 'text', 'seo', 'Filmler Açıklaması', 'Filmler sayfası meta açıklama'),
    -- SEO - Calendar
    ('seo_calendar_title', 'Yayın Takvimi - Haftalık Anime Programı', 'text', 'seo', 'Takvim Başlığı', 'Takvim sayfası meta başlık'),
    ('seo_calendar_description', 'Anime yayın takvimini takip edin. Hangi gün hangi anime yayınlanıyor görün.', 'text', 'seo', 'Takvim Açıklaması', 'Takvim sayfası meta açıklama'),
    -- SEO - Anime Detail
    ('seo_anime_title', '{anime_title} İzle', 'text', 'seo', 'Anime Detay Başlığı', 'Anime detay sayfası meta başlık şablonu'),
    ('seo_anime_description', '{anime_title} animesini Türkçe altyazılı izle. {overview}', 'text', 'seo', 'Anime Detay Açıklaması', 'Anime detay sayfası meta açıklama şablonu'),
    -- SEO - Watch
    ('seo_watch_title', '{anime_title} {episode} İzle', 'text', 'seo', 'İzle Başlığı', 'İzle sayfası meta başlık şablonu'),
    ('seo_watch_description', '{anime_title} {episode} Türkçe altyazılı izle.', 'text', 'seo', 'İzle Açıklaması', 'İzle sayfası meta açıklama şablonu')
ON CONFLICT (key) DO NOTHING;

