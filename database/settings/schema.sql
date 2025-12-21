-- Site Settings Table
-- Genel site ayarlarını saklar

CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    label VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Sadece admin ekleyebilir
CREATE POLICY "Only admins can insert site settings"
    ON site_settings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Sadece admin silebilir
CREATE POLICY "Only admins can delete site settings"
    ON site_settings FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();

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
    ('social_reddit', '', 'text', 'social', 'Reddit', 'Reddit subreddit URL''si')
ON CONFLICT (key) DO NOTHING;

