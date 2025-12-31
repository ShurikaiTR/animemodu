# AnimeModu - Proje Kuralları ve Kodlama Standartları

> Bu dosya, projede yapılacak tüm geliştirmeler için referans niteliğindedir.
> Yapay zeka asistanları ve geliştiriciler bu kurallara uymalıdır.

---

## 🛠 Teknoloji Stack

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | Next.js (App Router) | 16.x |
| Runtime | React | 19.x |
| Language | TypeScript | 5.x (Strict Mode) |
| Styling | Tailwind CSS | 4.x |
| Database | Supabase (PostgreSQL) | Latest |
| UI Components | Radix UI + shadcn/ui | Latest |
| Icons | Lucide React | Latest |
| Validation | Zod | 4.x |
| Testing | Vitest | Latest |
| Notifications | Sonner | Latest |

### ⚠️ Next.js 16 Önemli Değişiklikler

> **KRİTİK:** Next.js 16'da **Middleware artık Proxy** olarak adlandırılıyor!

| Eski (v15) | Yeni (v16) |
|------------|------------|
| `middleware.ts` | `src/proxy.ts` |
| `export function middleware()` | `export default function proxy()` |

**Proxy dosyası:** `src/proxy.ts` - Auth kontrolü, bakım modu, redirectler için kullanılıyor.

```typescript
// src/proxy.ts - DOĞRU
import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  // İstek işleme mantığı
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

---

## 📁 Klasör Yapısı

```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Public routes (grup)
│   ├── panel/             # Admin panel routes
│   ├── api/               # API Route Handlers
│   └── auth/              # Auth routes
├── actions/               # Server Actions (anime/, profile/, user/)
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, Modal...)
│   ├── anime/             # Anime-specific components
│   ├── layout/            # Layout components (Navbar, Footer, Sidebar...)
│   └── panel/             # Admin panel components
├── lib/
│   ├── auth/              # Auth utilities (guards.ts)
│   ├── cache/             # Cache utilities (revalidate.ts)
│   ├── constants/         # App constants
│   ├── supabase/          # Supabase clients (server.ts, client.ts)
│   ├── tmdb/              # TMDB API utilities
│   ├── validations/       # Zod schemas
│   └── errors.ts          # Error handling utilities
├── types/
│   ├── domain/            # Business domain types (anime.ts, interaction.ts)
│   ├── supabase/          # Database types
│   └── helpers.ts         # Type helpers
└── contexts/              # React contexts
```

---

## 🔐 Server Actions Pattern

### Auth Guard Kullanımı

Tüm admin işlemleri için `requireAdmin()`, kullanıcı işlemleri için `requireUser()` kullanılmalı:

```typescript
"use server";

import { requireAdmin, isAuthError } from "@/lib/auth/guards";

export async function adminAction(data: FormData) {
    // Her zaman ilk satırda auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // İş mantığı...
}
```

### Zod Validation

Tüm Server Actions'ta input validation zorunlu:

```typescript
import { parseFormData, formatZodError } from "@/lib/validations/anime";
import { mySchema } from "@/lib/validations/anime";

export async function myAction(formData: FormData) {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation her zaman auth'dan sonra
    const validation = parseFormData(formData, mySchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { field1, field2 } = validation.data;
    // ...
}
```

### Revalidation Pattern

Cache invalidation için merkezi helper'lar kullan:

```typescript
import { revalidateAnimeData, revalidateEpisodeData } from "@/lib/cache/revalidate";

// Anime ekleme/güncelleme/silme sonrası:
revalidateAnimeData(slug);

// Episode ekleme/güncelleme sonrası:
revalidateEpisodeData(animeSlug);
```

---

## 🧩 Component Pattern'ları

### Server Component (Varsayılan)

```typescript
// Dosya başında "use client" OLMAMALI
import { createClient } from "@/lib/supabase/server";

export default async function MyServerComponent() {
    const supabase = await createClient();
    const { data } = await supabase.from("table").select("*");
    
    return <div>{/* ... */}</div>;
}
```

### Client Component

```typescript
"use client";

import { useState, useTransition } from "react";

export default function MyClientComponent() {
    const [state, setState] = useState(initialState);
    const [isPending, startTransition] = useTransition();
    
    return <div>{/* ... */}</div>;
}
```

### Server/Client Split Pattern

Büyük sayfalarda data fetching Server Component'ta, interaktivite Client Component'ta:

```typescript
// page.tsx (Server Component)
import { createClient } from "@/lib/supabase/server";
import MyClient from "./MyClient";

export default async function Page() {
    const supabase = await createClient();
    const { data } = await supabase.from("table").select("*");
    
    return <MyClient initialData={data || []} />;
}

// MyClient.tsx (Client Component)
"use client";

interface Props {
    initialData: DataType[];
}

export default function MyClient({ initialData }: Props) {
    const [data, setData] = useState(initialData);
    // Interactive logic...
}
```

### Cache Pattern (Server Components)

```typescript
import { cacheLife, cacheTag } from "next/cache";

export default async function CachedComponent() {
    "use cache";
    cacheLife("minutes");  // veya "hours", "days"
    cacheTag("my-cache-tag");

    // Data fetching...
}
```

### Empty State Component

Boş durum gösterimi için reusable component:

```typescript
import EmptyState from "@/components/ui/EmptyState";
import { Film } from "lucide-react";

<EmptyState
    icon={Film}
    title="İçerik Bulunamadı"
    description="Henüz eklenmiş içerik yok."
/>
```

---

## 📝 Type Tanımlama Kuralları

### Domain Types (Önerilen)

```typescript
// src/types/domain/anime.ts
export interface Episode {
    id: number;
    title: string | null;
    season_number: number;
    episode_number: number;
    // ...
}
```

### Database Types

```typescript
// Database row type'ları helpers.ts'den import et
import type { AnimeRow, EpisodeRow } from "@/types/helpers";
```

### API Response Types

```typescript
type ActionResult<T = void> = 
    | { success: true; data?: T }
    | { success: false; error: string };
```

---

## 🎨 Styling Kuralları

### Tailwind CSS Conventions

```typescript
// Doğru: Utility-first, okunabilir sıralama
className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-xl"

// Yanlış: Karmaşık, sırasız
className="rounded-xl bg-white/5 justify-between p-4 flex gap-4 items-center"
```

### Renk Sistemi

```css
/* Tema renkleri CSS variables olarak tanımlı */
--primary: oklch(...);
--bg-main: oklch(...);
--bg-secondary: oklch(...);
--text-main: oklch(...);
```

### Glassmorphism Pattern

```typescript
className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
```

---

## ⚠️ Kesin Kurallar

### ✅ YAPILMASI GEREKENLER

1. **TypeScript Strict Mode** - `any` kullanma, tüm tipler tanımlı olmalı
2. **Auth Guard** - Tüm admin/user işlemlerinde guard kullan
3. **Zod Validation** - Tüm form input'ları validate et
4. **Error Handling** - `logError()` ile merkezi hata logla
5. **Reusable Components** - Tekrar eden UI'lar component'a çıkar
6. **Cache Strategy** - Public data için cache directive kullan
7. **Loading States** - Suspense + loading.tsx pattern
8. **Type Safety** - Database query sonuçları typed olmalı

### ❌ YAPILMAMASI GEREKENLER

1. **`any` type kullanma** - Her zaman proper type tanımla
2. **Console.log bırakma** - `logError()` kullan veya kaldır
3. **Hardcoded string** - Constants dosyasından al
4. **Duplicate code** - DRY prensibi, helper/component oluştur
5. **150+ satır dosya** - Modüler parçalara böl
6. **Client Component'a fonksiyon prop** - String key ile mapping kullan
7. **Inline styles** - Tailwind utility class'ları kullan
8. **Gereksiz state** - Server Component'ta fetch et, client'a geç

---

## 🧪 Test Yapısı

### Vitest Kurulumu

```bash
npm test           # Tüm testleri çalıştır
npm test:coverage  # Coverage raporu
```

### Test Dosyası Pattern

```typescript
// src/lib/validations/anime.test.ts
import { describe, it, expect } from "vitest";
import { mySchema } from "./anime";

describe("mySchema", () => {
    it("should validate valid input", () => {
        const result = mySchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });

    it("should reject invalid input", () => {
        const result = mySchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });
});
```

---

## 📦 Import Sıralaması

```typescript
// 1. React/Next.js imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party imports
import { toast } from "sonner";

// 3. Internal imports (@ alias)
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { AnimeRow } from "@/types/helpers";

// 4. Relative imports
import { localHelper } from "./utils";
```

---

## 🔄 Git Commit Kuralları

```
feat: Yeni özellik ekle
fix: Bug düzelt
refactor: Kod yeniden yapılandır
style: Formatting, styling değişiklikleri
docs: Dokümantasyon güncelle
test: Test ekle/güncelle
chore: Build, config değişiklikleri
```

---

## 📚 Referanslar

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

---

*Son Güncelleme: Aralık 2025*
