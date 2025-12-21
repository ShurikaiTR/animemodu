# Supabase Client Dosyaları

Bu klasör Supabase bağlantılarını yönetir. Her dosya farklı bir ortam için optimize edilmiştir.

## Dosyalar

### `client.ts` - Browser Client
**Ne zaman kullanılır:**
- `"use client"` component'lerinde
- Form işlemlerinde
- Kullanıcı etkileşimlerinde
- Real-time subscriptions

**Örnek:**
```typescript
"use client";
import { createClient } from "@/lib/supabase/client";

export default function MyComponent() {
    const supabase = createClient();
}
```

### `server.ts` - Server Client
**Ne zaman kullanılır:**
- Server Component'lerde
- API Route'larda
- Server Actions'da
- SSR/SSG işlemlerinde

**Örnek:**
```typescript
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
    const supabase = await createClient();
    const { data } = await supabase.from("animes").select("*");
}
```

### `middleware.ts` - Middleware Helper
**Ne zaman kullanılır:**
- Next.js middleware'de
- Her istekte oturum kontrolü için

**Örnek:**
```typescript
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}
```

## Type Safety

Tüm client'lar `@/types/supabase.ts` dosyasındaki type tanımlarını kullanır. Bu sayede:
- ✅ Otomatik tamamlama
- ✅ Type checking
- ✅ Hata önleme

## Güvenlik

- **Client**: Public API key kullanır (güvenli, RLS ile korunur)
- **Server**: Public API key kullanır (cookie'ler ile güvenlik)
- **Middleware**: Her istekte oturum kontrolü yapar

## Önemli Notlar

1. **Client Component'lerde** `client.ts` kullanın
2. **Server Component'lerde** `server.ts` kullanın
3. **await** sadece server.ts için gerekli
4. Her iki client da aynı type'ları kullanır (`Database`)




















