# Next.js Cache API Rehberi

Bu dosya Next.js cache API'lerinin ne işe yaradığını ve projede nasıl kullanıldığını açıklar.

## Cache Türleri

Next.js'de 4 ana cache türü vardır:

1. **Full Route Cache** - Sayfa HTML'i ve RSCP cache'i
2. **Data Cache** - `fetch()` isteklerinin sonuçları
3. **Request Memoization** - Aynı render içinde aynı `fetch()` çağrıları
4. **Router Cache** - Client-side route cache'i (otomatik)

## Cache API'leri

### 1. `revalidatePath` - Route Cache'ini Yenileme

**Ne işe yarar:** Belirli bir route'un cache'ini yeniler.

**Kullanım:**
```typescript
import { revalidatePath } from "next/cache"

// Ana sayfayı yenile
revalidatePath("/")

// Arşiv sayfasını yenile
revalidatePath("/arsiv")

// Anime detay sayfasını yenile (dinamik route)
revalidatePath("/anime/[slug]", "page")

// Layout'u da yenile
revalidatePath("/anime/[slug]", "layout")
```

**Path türleri:**
- `"/"` - Ana sayfa
- `"/arsiv"` - Arşiv sayfası
- `"/anime/[slug]"` - Dinamik route pattern
- `"/anime/[slug]", "page"` - Sadece page.tsx'i yenile
- `"/anime/[slug]", "layout"` - Layout'u da yenile

**Ne zaman kullanılır:**
- Server Action'larda veri değiştiğinde
- Panelden anime eklenince/güncellenince
- Kullanıcı profili güncellenince

**Projede kullanım:**
- `addAnime.ts` - Anime eklendiğinde ana sayfa ve arşiv cache'ini yeniler
- `updateAnime.ts` - Anime güncellendiğinde ilgili sayfaların cache'ini yeniler

---

### 2. `revalidateTag` - Tag'lenmiş Cache'i Yenileme

**Ne işe yarar:** Tag'lenmiş cache entry'lerini yeniler.

**Kullanım:**
```typescript
import { revalidateTag } from "next/cache"

// Stale-while-revalidate (önerilen)
revalidateTag("animes", "max")

// Hemen expire et (deprecated)
revalidateTag("animes")
```

**Ne zaman kullanılır:**
- `fetch()` ile tag'lenmiş verileri yenilemek için
- Cache Components ile tag'lenmiş verileri yenilemek için

**Örnek:**
```typescript
// fetch ile tag'leme
fetch(url, { next: { tags: ["animes"] } })

// Sonra yenileme
revalidateTag("animes", "max")
```

---

### 3. `updateTag` - Cache'i Hemen Expire Etme

**Ne işe yarar:** Tag'lenmiş cache'i hemen expire eder (sadece Server Action'larda).

**Kullanım:**
```typescript
import { updateTag } from "next/cache"

updateTag("animes")
```

**Ne zaman kullanılır:**
- Read-your-own-writes senaryolarında
- Yeni veri eklenince hemen görünmesi gerektiğinde
- Server Action içinde kullanılmalı

**Fark:**
- `revalidateTag` - Stale-while-revalidate (eski veri gösterirken arka planda yeniler)
- `updateTag` - Hemen expire eder (yeni veri gelene kadar bekle)

---

### 4. `cacheTag` - Cache Entry'lerini Tag'leme

**Ne işe yarar:** Cache Components ile cache'lenmiş veriyi tag'ler.

**Kullanım:**
```typescript
import { cacheTag } from "next/cache"

export async function getAnimes() {
  "use cache"
  cacheTag("animes")
  
  const data = await supabase.from("animes").select("*")
  return data
}
```

**Ne zaman kullanılır:**
- Supabase sorgularını cache'lemek için
- Database query'lerini cache'lemek için
- Cache Components ile birlikte kullanılır

---

### 5. `fetch` - HTTP İsteklerini Cache'leme

**Ne işe yarar:** `fetch()` isteklerini cache'ler.

**Kullanım:**
```typescript
// Zaman bazlı cache
fetch(url, { next: { revalidate: 3600 } }) // 1 saat

// Tag bazlı cache
fetch(url, { next: { tags: ["animes"] } })

// Cache'i devre dışı bırak
fetch(url, { cache: "no-store" })
```

**Projede kullanım:**
- TMDB API çağrıları (`getPopularAnimeMovies`, `getTVGenres`)
- `next: { revalidate: 3600 }` ile 1 saat cache

---

### 6. `unstable_cache` - Database Sorgularını Cache'leme (Legacy)

**Ne işe yarar:** Database sorgularını ve async fonksiyonları cache'ler.

**Kullanım:**
```typescript
import { unstable_cache } from "next/cache"

const cachedData = unstable_cache(
  async () => supabase.from("animes").select("*"),
  ["animes"],
  {
    revalidate: 3600,
    tags: ["animes"]
  }
)
```

**Not:** Artık `use cache` directive öneriliyor, `unstable_cache` legacy.

---

## Route Seviyesi Cache

### `export const revalidate`

**Ne işe yarar:** Tüm route'un cache süresini belirler.

**Kullanım:**
```typescript
export const revalidate = 300 // 5 dakika
```

**Projede kullanım:**
- `page.tsx` - Ana sayfa 5 dakika cache
- `takvim/page.tsx` - Takvim sayfası 1 saat cache

---

## Path Pattern'leri

### Absolute Path
```typescript
revalidatePath("/")           // Ana sayfa
revalidatePath("/arsiv")      // Arşiv sayfası
revalidatePath("/takvim")     // Takvim sayfası
```

### Dynamic Path
```typescript
revalidatePath("/anime/[slug]")                    // Tüm anime detay sayfaları
revalidatePath("/anime/one-piece")                 // Belirli bir anime
revalidatePath("/anime/[slug]", "page")            // Sadece page.tsx
revalidatePath("/anime/[slug]", "layout")          // Layout'u da yenile
```

### Path Type'ları
- `"page"` - Sadece page.tsx'i yenile
- `"layout"` - Layout'u da yenile (default)

---

## Projede Kullanım Senaryoları

### Senaryo 1: Anime Ekleme
```typescript
// addAnime.ts
export async function addAnimeToDB(...) {
  // ... anime ekleme kodu
  
  revalidatePath("/")        // Ana sayfa
  revalidatePath("/arsiv")   // Arşiv sayfası
}
```

### Senaryo 2: Anime Güncelleme
```typescript
// updateAnime.ts
export async function updateAnime(id, data) {
  // ... güncelleme kodu
  
  revalidatePath("/")                    // Ana sayfa
  revalidatePath("/arsiv")                // Arşiv
  revalidatePath(`/anime/${data.slug}`)   // Detay sayfası
}
```

### Senaryo 3: Profil Güncelleme
```typescript
// profile.ts
export async function updateProfile(...) {
  // ... güncelleme kodu
  
  revalidatePath("/profile")  // Profil sayfası
}
```

---

## Best Practices

1. **Server Action'larda kullan:** Cache yenileme işlemleri Server Action'larda yapılmalı
2. **İlgili sayfaları yenile:** Veri değiştiğinde etkilenen tüm sayfaları yenile
3. **Tag kullan:** Granular kontrol için tag'leme kullan
4. **Stale-while-revalidate:** `revalidateTag` ile `"max"` profile kullan
5. **Route cache:** Statik sayfalar için `revalidate` kullan

---

## Özet

| API | Ne İşe Yarar | Nerede Kullanılır |
|-----|--------------|-------------------|
| `revalidatePath` | Route cache'ini yeniler | Server Action'larda |
| `revalidateTag` | Tag'lenmiş cache'i yeniler | Server Action/Route Handler'da |
| `updateTag` | Cache'i hemen expire eder | Server Action'larda (read-your-own-writes) |
| `cacheTag` | Cache entry'lerini tag'ler | Cache Components içinde |
| `fetch` + `next.revalidate` | HTTP isteklerini cache'ler | API çağrılarında |
| `export const revalidate` | Route cache süresini belirler | Page component'lerinde |
