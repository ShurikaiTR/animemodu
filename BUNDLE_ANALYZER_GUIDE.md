# Bundle Analyzer Kullanım Kılavuzu

## Kurulum

Bundle analyzer zaten kurulu ve yapılandırılmış durumda.

## Kullanım

### 1. Bundle Analizi Çalıştırma

```bash
npm run analyze
```

Bu komut:
- Build'i çalıştırır
- Bundle analizini otomatik açar
- Tarayıcıda 2 tab açılır:
  - `http://localhost:3000` - Client bundles
  - `http://localhost:3000` - Server bundles

### 2. Analiz Sonuçlarını İnceleme

Bundle analyzer şunları gösterir:
- **Her chunk'ın boyutu** (KB/MB)
- **Hangi dosyalar hangi chunk'a dahil**
- **Dependency tree** (hangi paketler ne kadar yer kaplıyor)
- **Code splitting** etkinliği

### 3. Optimizasyon Önerileri

#### Büyük Paketler
- `framer-motion` - Animasyon kütüphanesi (büyük olabilir)
- `@radix-ui/*` - UI component'leri
- `lucide-react` - Icon kütüphanesi

#### Dynamic Import Önerileri
Aşağıdaki component'ler lazy load edilebilir:

1. **VideoPlayer** (100 satır)
   - Sadece izleme sayfasında kullanılıyor
   - Video.js script'leri yükleniyor

2. **AddContentModal** (144 satır)
   - Sadece admin panelinde kullanılıyor
   - Modal açıldığında yüklenebilir

3. **EditProfileModal** (121 satır)
   - Sadece profil sayfasında kullanılıyor
   - Modal açıldığında yüklenebilir

4. **CommentsSection** (127 satır)
   - Sadece anime detay sayfasında kullanılıyor
   - Scroll ile lazy load edilebilir

## Dynamic Import Örneği

```typescript
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/anime/VideoPlayer'), {
  loading: () => <div>Video yükleniyor...</div>,
  ssr: false
});
```

## Sonuçları Yorumlama

- **Yeşil**: Küçük dosyalar (< 50KB)
- **Sarı**: Orta dosyalar (50-200KB)
- **Kırmızı**: Büyük dosyalar (> 200KB) - Optimize edilmeli

## Notlar

- Bundle analyzer sadece build sırasında çalışır
- Production build'de otomatik devre dışı
- `ANALYZE=true` environment variable ile aktif edilir












