# Next.js Proxy Rehberi

Bu dosya Next.js Proxy (eski adıyla Middleware) API'sinin ne işe yaradığını ve projede nasıl kullanıldığını açıklar.

## Proxy Nedir?

**Proxy**, Next.js 16'da Middleware'in yeni adıdır. İstek tamamlanmadan önce çalışan kod bloğudur.

**Ne işe yarar:**
- Her istekte otomatik çalışır
- İstek/response'u değiştirebilir
- Header'ları değiştirebilir
- Redirect yapabilir
- Rewrite yapabilir
- Cookie'leri yönetebilir

## Kullanım Senaryoları

### 1. Authentication (Kimlik Doğrulama)
- Her istekte kullanıcı oturumunu kontrol eder
- Cookie'leri günceller
- Oturum süresini yeniler

### 2. Header Manipülasyonu
- Tüm sayfalara header ekler
- CORS header'ları ayarlar
- Security header'ları ekler

### 3. Redirect/Rewrite
- A/B test için farklı sayfalara yönlendirir
- URL'leri yeniden yazar
- Koşullu redirect'ler

### 4. Rate Limiting
- İstek sayısını sınırlar
- Bot koruması

## Projede Kullanım

### Dosya: `src/proxy.ts`

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Ne yapıyor:**
- Her istekte Supabase oturumunu kontrol eder
- Cookie'leri günceller
- Kullanıcı oturumunu yeniler

### Matcher Pattern Açıklaması

```typescript
matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
]
```

**Ne işe yarar:**
- `_next/static` - Next.js static dosyalarını hariç tutar
- `_next/image` - Next.js Image Optimization'ı hariç tutar
- `favicon.ico` - Favicon'u hariç tutar
- `.*\\.(?:svg|png|jpg|jpeg|gif|webp)$` - Resim dosyalarını hariç tutar

**Sonuç:** Sadece sayfa route'larında çalışır, static dosyalarda çalışmaz (performans için).

## Proxy Fonksiyonu

### Export Türleri

```typescript
// Named export (önerilen)
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

// Default export (alternatif)
export default function proxy(request: NextRequest) {
  return NextResponse.next()
}
```

### Request ve Response

```typescript
import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Request bilgileri
  const url = request.url
  const pathname = request.nextUrl.pathname
  const headers = request.headers
  const cookies = request.cookies
  
  // Response oluşturma
  return NextResponse.next()                    // İsteği devam ettir
  return NextResponse.redirect(url)             // Redirect yap
  return NextResponse.rewrite(url)             // URL'i yeniden yaz
  return new NextResponse("Hello")             // Direkt response döndür
}
```

## Projede Kullanılan: Supabase Session Yönetimi

### `src/lib/supabase/middleware.ts`

```typescript
export async function updateSession(request: NextRequest) {
  // Supabase client oluştur (cookie'ler ile)
  const supabase = createServerClient(...)
  
  // Kullanıcı oturumunu kontrol et
  await supabase.auth.getUser()
  
  // Cookie'leri güncelle
  return supabaseResponse
}
```

**Ne yapıyor:**
1. Her istekte Supabase client oluşturur
2. Cookie'lerden oturum bilgisini alır
3. Kullanıcıyı kontrol eder
4. Cookie'leri günceller (oturum yenileme)
5. Response'u döndürür

## Örnek Kullanımlar

### Örnek 1: Basit Redirect

```typescript
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/old") {
    return NextResponse.redirect(new URL("/new", request.url))
  }
  return NextResponse.next()
}
```

### Örnek 2: Header Ekleme

```typescript
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set("X-Custom-Header", "value")
  return response
}
```

### Örnek 3: Koşullu Redirect

```typescript
export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get("session")
  
  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/panel")) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }
  
  return NextResponse.next()
}
```

### Örnek 4: URL Rewrite

```typescript
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/home") {
    return NextResponse.rewrite(new URL("/", request.url))
  }
  return NextResponse.next()
}
```

## Matcher Pattern'leri

### Basit Pattern

```typescript
export const config = {
  matcher: "/about/:path*"  // /about ve alt route'lar
}
```

### Multiple Pattern

```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*"
  ]
}
```

### Negative Pattern (Projede kullanılan)

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ]
}
```

**Açıklama:**
- `(?!...)` - Negative lookahead (bunları hariç tut)
- `_next/static` - Static dosyalar
- `_next/image` - Image optimization
- `favicon.ico` - Favicon
- `.*\\.(?:svg|png|...)$` - Resim dosyaları

## Önemli Notlar

### 1. Cache Etkisi Yok
Proxy içinde `fetch` ile cache kullanılamaz:
```typescript
// ❌ Çalışmaz
fetch(url, { next: { revalidate: 3600 } })

// ✅ Çalışır
fetch(url, { cache: "no-store" })
```

### 2. Edge Runtime
Proxy Edge Runtime'da çalışır (hızlı, sınırlı API'ler).

### 3. Performans
- Her istekte çalışır, hızlı olmalı
- Ağır işlemler yapılmamalı
- Database sorguları yapılmamalı (hafif kontroller yapılabilir)

### 4. Tek Dosya
Projede sadece bir `proxy.ts` dosyası olabilir.

## Projede Kullanım Senaryosu

### Senaryo: Supabase Session Yönetimi

**Akış:**
1. Kullanıcı bir sayfaya istek atar
2. Proxy çalışır (`proxy.ts`)
3. `updateSession` çağrılır
4. Supabase client oluşturulur (cookie'lerden)
5. `getUser()` ile oturum kontrol edilir
6. Cookie'ler güncellenir (oturum yenileme)
7. İstek devam eder

**Faydalar:**
- Her istekte oturum kontrolü
- Otomatik oturum yenileme
- Cookie yönetimi
- Server Component'lerde `createClient()` ile oturum bilgisi hazır

## Best Practices

1. **Hafif işlemler:** Proxy'de ağır işlemler yapma
2. **Matcher kullan:** Gereksiz route'larda çalışmasın
3. **Cookie yönetimi:** Oturum yönetimi için ideal
4. **Header manipülasyonu:** Security header'ları ekle
5. **Redirect:** Basit redirect'ler için kullan

## Özet

| Özellik | Açıklama |
|---------|----------|
| **Ne zaman çalışır** | Her istekte (matcher'a uyuyorsa) |
| **Ne yapabilir** | Redirect, Rewrite, Header değiştirme, Cookie yönetimi |
| **Ne yapamaz** | Ağır işlemler, Cache kullanma, Database sorguları |
| **Runtime** | Edge Runtime (hızlı, sınırlı) |
| **Dosya** | `proxy.ts` (proje kökünde veya `src/` içinde) |

## Kaynaklar

- [Next.js Proxy Docs](https://nextjs.org/docs/app/getting-started/proxy)
- [Proxy API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
