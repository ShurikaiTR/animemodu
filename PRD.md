# AnimeModu - Ürün Gereksinim Dokümanı (PRD)

**Versiyon:** 1.0.0  
**Tarih:** 16 Aralık 2025  
**Durum:** Geliştirme Aşamasında (Beta Öncesi)

---

## 1. Yönetici Özeti
**AnimeModu**, Türkiye'deki anime izleyicileri için geliştirilmiş; modern arayüze (Glassmorphism), güçlü topluluk özelliklerine ve oyunlaştırma (gamification) mekaniklerine sahip yeni nesil bir streaming platformudur. Sadece içerik tüketimi değil, kullanıcı etkileşimi (yorum, takip, seviye sistemi) üzerine kuruludur.

## 2. Hedef Kitle
*   **İzleyiciler:** Güncel animeleri yüksek kalitede, reklamsız/az reklamlı izlemek isteyenler.
*   **Topluluk Odaklı Kullanıcılar:** Anime hakkında tartışmak, profil kasmak (level/rozet) ve sosyalleşmek isteyenler.
*   **Küratörler:** Kendi izleme listelerini oluşturan ve paylaşan kullanıcılar.

## 3. Teknik Özellikler ve Standartlar

### 3.1. Teknoloji Yığını
*   **Framework:** Next.js 16.0.7 (App Router, Server Actions, Turbo)
*   **Dil:** TypeScript 5 (Strict Mode)
*   **UI Kütüphanesi:** React 19.2.0
*   **Stil:** Tailwind CSS v4 (Design System: Glassmorphism, `--light-blue` accent)
*   **Veritabanı:** PostgreSQL (Custom Schema) + `pg` driver
*   **Auth:** Özel JWT Auth (Argon2id hashing, HTTPOnly Cookies)
*   **Dış Servisler:** TMDB API (Görsel/Meta), AniList API (Karakterler/Meta)

### 3.2. Performans Hedefleri
*   Lighthouse Skoru: 100/100 (SEO, Best Practices, Accessibility, Performance)
*   Görsel Optimizasyonu: Next.js `Image` component ile WebP/AVIF formatları.
*   Modülerlik: Hiçbir dosya 150 satırı geçmemeli (DRY prensibi).

---

## 4. Temel Özellikler (Core Features)

### 4.1. Kimlik Doğrulama ve Kullanıcı Yönetimi
*   **Kayıt/Giriş:** Email ve şifre ile güvenli giriş.
*   **JWT Auth:** Session yönetimi cookie tabanlı JWT ile sağlanır.
*   **Profil Yönetimi:** Avatar yükleme, Biyografi, Sosyal Medya linkleri.
*   **Güvenlik:** Şifreler Argon2id ile hashlenir.

### 4.2. İçerik Keşfi ve İzleme
*   **Ana Sayfa:**
    *   Hero Slider (Admin tarafından seçilen öne çıkanlar).
    *   Son Eklenen Bölümler.
    *   Popüler Animeler ve Filmler.
*   **Gelişmiş Arama (Searchbar):**
    *   FlixTV tarzı, responsive, header-entegre arama modülü.
    *   Anlık sonuç filtreleme.
*   **Katalog (Keşfet):** Tür, Yıl, Puan ve Duruma göre filtreleme.
*   **İzleme Sayfası:**
    *   Özel Video Player (Skinning destekli).
    *   Sinema Modu / Işıkları Kapat.
    *   Sonraki/Önceki bölüm navigasyonu.
    *   İzleme geçmişi kaydı (Kaldığı yerden devam etme).

### 4.3. Topluluk ve Sosyal (Social Features)
*   **Yorum Sistemi:**
    *   İç içe geçmiş (Nested) yanıtlar.
    *   Spoiler etiketi (Blur efektli).
    *   Beğeni/Dislike sistemi.
    *   Zengin metin editörü.
*   **Takip Sistemi:** Kullanıcılar birbirini takip edebilir, aktivite akışı.
*   **Bildirimler:** Yanıtlar, beğeniler ve yeni bölümler için bildirim merkezi.

### 4.4. Oyunlaştırma (Gamification)
*   **XP ve Seviye:** İzlenen bölüm ve yapılan yorum başına XP kazanımı.
*   **Rütbe Sistemi:** Naruto temalı rütbeler (Genin, Chunin, Jonin, Kage vb.).
*   **Rozetler:** Belirli görevleri tamamlayanlara özel profil rozetleri.
*   **İstatistikler:** Toplam izleme süresi, bölüm sayısı, yorum sayısı.

### 4.5. Admin Paneli (`/panel`)
*   **Dashboard:** Günlük/Aylık istatistikler.
*   **İçerik Yönetimi:**
    *   TMDB entegrasyonu ile tek tıkla Anime/Film ekleme.
    *   AniList entegrasyonu ile karakterleri çekme.
    *   Bölüm yönetimi ve toplu güncelleme.
*   **Kullanıcı Yönetimi:** Rol atama, Banlama, Düzenleme.

---

## 5. Veritabanı Mimarisi (Özet)

Proje modüler veritabanı şemaları kullanır:

1.  **`public` (Core):** `users`, `animes`, `episodes`
2.  **`gamification`:** `user_levels`, `badges`, `user_badges`
3.  **`interactions`:** `comments`, `likes`, `follows`, `watch_history`
4.  **`system`:** `notifications`, `settings`

---

## 6. Tasarım Dili (UI/UX)
*   **Konsept:** Dark Mode + Glassmorphism.
*   **Renk Paleti:**
    *   Arkaplan: `#131720` (Derin Lacivert/Siyah)
    *   İkincil: `#151f30`
    *   Vurgu (Primary): `#2f80ed` (Parlak Mavi)
    *   Metin: `#e0e0e0`
*   **Tipografi:** Inter (Gövde), Rubik (Başlıklar).

---

## 7. Gelecek Planları (Roadmap)
*   [ ] Mobil Uygulama (PWA veya Native).
*   [ ] Takvim entegrasyonu (Yeni bölümler için).
*   [ ] Discord entegrasyonu (Rich Presence).
*   [ ] Kullanıcıların kendi listelerini oluşturması (Custom Lists).

