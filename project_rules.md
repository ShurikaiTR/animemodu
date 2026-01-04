# AnimeModu - Proje Kuralları ve Kodlama Standartları (v2.0)

> **MİSYON:** Sürdürülebilir, yüksek performanslı ve "Production-Ready" bir kod tabanı oluşturmak.
> **HEDEF KİTLE:** Yapay zeka asistanları ve proje geliştiricileri.

---

## 🏗 Mimari Prensipler (Architecture)

Projemiz **Feature-Based Architecture** ve **Service Pattern** kullanır. Kodun rastgele dağılmasına izin verilmez.

### 1. Katmanlı Yapı (Layered Structure)

| Katman | Sorumluluk | Örnek Dosya |
|--------|------------|-------------|
| **UI (Components)** | Sadece görüntüleme ve kullanıcı etkileşimi. Veritabanına ASLA dokunmaz. | `AnimeCard.tsx`, `HeroSection.tsx` |
| **Actions (Controllers)** | Yetki kontrolü (Auth), doğrulama (Validation) ve Servis çağrısı. İş mantığı içermez. | `add-anime.ts`, `auth-actions.ts` |
| **Services (Business)** | İş ve veri erişim mantığı. Veritabanı ve gerekirse harici API entegrasyonları burada yapılır. | `anime-service.ts`, `profile-service.ts` |
| **Lib (Shared)** | Yardımcı fonksiyonlar, sabitler ve yapılandırmalar. | `utils.ts`, `constants.ts` |

### 2. Service Pattern (ZORUNLU)

Veritabanı işlemleri ve "Business Logic" sadece **Service** dosyalarında bulunur.
*   ❌ **Yanlış:** Server Action içinde `supabase.from('users').insert(...)` yazmak.
*   ✅ **Doğru:** Server Action içinde `UserService.create(...)` çağırmak.

```typescript
// src/features/user/services/user-service.ts
export const UserService = {
  async getById(id: string) { /* DB logic */ },
  async update(id: string, data: any) { /* DB logic */ }
};
```

---

## 🛠 Teknoloji Stack ve Kurallar

| Kategori | Teknoloji | Kural |
|----------|-----------|-------|
| Framework | **Next.js 16** | App Router, Server Components varsayılan. |
| Language | **TypeScript 5** | `Strict Mode` açık. `any` kesinlikle yasak. |
| Styling | **Tailwind CSS 4** | Utility-first. Karmaşık stiller için `cn()` helper kullan. |
| Database | **Supabase** | Client/Server component ayrımına dikkat et (`createClient`). |
| State | **URL & Server** | Client state (useState) minimize edilmeli. URL parametrelerini kullan. |
| Validation| **Zod** | API ve Action girişlerinde ZORUNLU. |

---

## 📏 Kodlama Standartları (Coding Standards)

### 1. Dosya Limitleri ve Modülerlik
*   **İdeal Sınır:** Bir dosya için hedef **150 satırdır**.
*   **İstisna:** Tek bir sorumluluğu (Single Responsibility) yerine getiriyorsa, okunabilirliği bozulmuyorsa ve bütünlük gerekiyorsa bu sınır aşılabilir (örn. aşırı bölünmüş yapılar context kopukluğu yaratabilir).
*   **Review Tetikleyici:** 200 satırı aşan dosyalar refactoring için adaydır, gözden geçirilmelidir.

### 2. TypeScript Kuralları
*   **No Explicit Any:** `any` kullanımı yasak.
    *   Veri tipi bilinmiyorsa önce **Zod** (`z.infer`) ile şema çıkar.
    *   Gerçekten dinamik bir yapıysa `unknown` kullan ve **Type Guard** ile daralt.
*   **Interface vs Type:** Objeler için `interface`, birleşimler (union) için `type` kullan.
*   **Domain Types:** Veritabanı tiplerini (`Row`) ham kullanmak yerine Domain tiplerine (`Anime`) map et.

### 3. Fonksiyon Yazımı
*   **Single Responsibility:** Bir fonksiyon sadece bir iş yapmalı.
*   **Async/Await:** `.then()` zincirleri yerine `async/await` kullan.
*   **Early Return:** `if (error) return;` yapısını kullanarak iç içe `if`lerden kaçın.

---

## 🔐 Güvenlik ve Performans

### 1. Server Actions
*   Her action'ın başında **mutlaka** Auth Guard olmalı (`requireAdmin` veya `requireUser`).
*   Tüm inputlar **Zod** ile doğrulanmalı.
*   Hatalar kullanıcıya dostça, loglara detaylı basılmalı (`logError`).

### 2. Veritabanı (Supabase)
*   Asla `Select *` kullanma. Sadece ihtiyaç duyulan alanları çek (`select('id, name')`).
*   Büyük listelerde `pagination` veya `infinite scroll` kullan.
*   Client tarafında hassas veri (email, telefon) gösterme.

### 3. Caching
*   Server Component'ler varsayılan olarak cachelenir.
*   Data mutasyonundan sonra (`insert/update`) ilgili path'i revalidate et (`revalidatePath`).

---

## 📂 Klasör Yapısı (Feature-Based)

Klasörler yeteneklere (features) göre ayrılır, dosya türüne göre değil.

```
src/
├── app/                    # Sayfalar (Pages)
├── features/               # YETENEKLER (Burada yaşarız)
│   ├── anime/              # Anime modülü
│   │   ├── components/     # UI
│   │   ├── actions/        # Server Actions (Controllers)
│   │   ├── services/       # Business Logic (DB)
│   │   └── hooks/          # React Hooks
│   ├── profile/            # Profil modülü
│   └── auth/               # Kimlik doğrulama
├── shared/                 # PAYLAŞILANLAR
│   ├── components/         # Button, Input, Modal (UI Kit)
│   ├── lib/                # Utils, Supabase, Constants
│   └── types/              # Global Tipler
```

---

## 🤖 AI Asistan Talimatları

Bu projede çalışan bir AI asistanı isen:

1.  **Önce Oku:** Değişiklik yapmadan önce ilgili dosyayı ve "import" ettiği dosyaları oku.
2.  **Planla:** Karmaşık işlerde önce `implementation_plan.md` oluştur.
3.  **Küçük Parçala:** Dosyayı baştan aşağı değiştirmek yerine, sadece gereken fonksiyonu veya bloğu değiştir (`replace_file_content`).
4.  **Test Et:** Bir kodu değiştirdikten sonra (özellikle TS dosyaları), `npm run build` ile patlamadığını doğrula.
5.  **Kuralları Koru:** 150 satırı geçen bir dosya görürsen, refactor öner.

---

*Versiyon 2.0 - Ocak 2026*
