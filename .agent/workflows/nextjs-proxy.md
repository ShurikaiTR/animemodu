---
description: Next.js 16 Proxy (eski adıyla Middleware) kullanım kılavuzu
---

# Next.js 16 Proxy Kılavuzu

> **ÖNEMLİ:** Next.js 16'dan itibaren **Middleware** artık **Proxy** olarak adlandırılıyor!

## Temel Bilgiler

- Dosya adı: `src/proxy.ts` (veya `proxy.ts` root'ta)
- Middleware DEĞİL, Proxy kullanılıyor
- Fonksiyon adı: `proxy` veya `default export`

## Dosya Yapısı

```typescript
import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  // İstek işleme mantığı
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Kullanım Alanları

1. **Auth kontrolü** - Panel erişimi için admin kontrolü
2. **Bakım modu** - Site bakımdayken kullanıcıları yönlendirme
3. **A/B testleri** - Farklı sayfalara yönlendirme
4. **Header modifikasyonu** - Request/response header'larını değiştirme

## Önemli Notlar

- `fetch` ile `options.cache`, `options.next.revalidate`, `options.next.tags` Proxy'de çalışmaz
- Yavaş data fetching için kullanılmamalı
- Sadece hızlı kontroller için (permission-based redirects gibi)

## Proje Örneği

Bu projede `src/proxy.ts` şunları yapıyor:
1. Supabase session güncelleme
2. Bakım modu kontrolü (site_settings'ten)
3. Panel erişim kontrolü (admin role kontrolü)

## Dokümantasyon

- [Next.js Proxy Docs](https://nextjs.org/docs/app/getting-started/proxy)
- [Proxy API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

---

*Bu bilgileri her zaman hatırla - middleware.ts yerine proxy.ts kullan!*
