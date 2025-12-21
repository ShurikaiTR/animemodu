# Auth Database Schema

Bu klasör kullanıcı kimlik doğrulama ve profil yönetimi için gerekli SQL dosyalarını içerir.

## Kurulum

1. Supabase Dashboard'a giriş yapın
2. SQL Editor'ü açın
3. `schema.sql` dosyasındaki tüm SQL komutlarını çalıştırın

## Tablolar

### `profiles`
Kullanıcı profil bilgilerini saklar. `auth.users` tablosu ile ilişkilidir.

**Kolonlar:**
- `id` (uuid): auth.users tablosuna referans
- `username` (text): Kullanıcı adı (unique)
- `full_name` (text): Tam ad
- `bio` (text): Kullanıcı biyografisi
- `location` (text): Kullanıcı konumu
- `avatar_url` (text): Profil resmi URL'si
- `banner_url` (text): Profil banner resmi URL'si
- `social_media` (jsonb): Sosyal medya linkleri (JSON formatında)
- `role` (text): Kullanıcı yetkisi ('user' veya 'admin')
- `created_at` (timestamp): Oluşturulma tarihi
- `updated_at` (timestamp): Güncellenme tarihi

## Otomatik İşlemler

### Yeni Kullanıcı Kaydı
Yeni bir kullanıcı kaydolduğunda otomatik olarak `profiles` tablosunda bir kayıt oluşturulur.

## Row Level Security (RLS)

- Kullanıcılar kendi profilini görebilir ve güncelleyebilir
- Herkes herkesin profilini görebilir (public profiles)
- Sadece kendi profilini silebilir

## Notlar

- `auth.users` tablosu Supabase tarafından otomatik yönetilir
- Bu schema sadece profil bilgilerini yönetir
- Email doğrulama ve şifre sıfırlama Supabase'in built-in özelliklerini kullanır




















