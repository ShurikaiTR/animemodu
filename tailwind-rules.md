# Tailwind CSS Rules and Best Practices

> AnimeModu projesi için Tailwind CSS kodlama standartları.
> Tüm geliştiriciler ve yapay zeka asistanları bu kurallara uymalıdır.

---

## Core Principles

- **Always use Tailwind CSS v4.1+** - Ensure the codebase is using the latest version
- **Do not use deprecated or removed utilities** - ALWAYS use the replacement
- **Never use `@apply`** - Use CSS variables, the `--spacing()` function, or framework components instead
- **Check for redundant classes** - Remove any classes that aren't necessary
- **Group elements logically** to simplify responsive tweaks later
- **Use CSS variables** - Never hardcode hex colors like `#12141a`, use theme variables like `bg-bg-dark`

---

## Color System

### ✅ Doğru Kullanım (CSS Variables)

```tsx
// Modal backgrounds
className="bg-bg-dark"

// Dropdown backgrounds  
className="bg-bg-dropdown"

// Video player backgrounds
className="bg-bg-video"

// Gradients
className="from-gradient-dark via-gradient-dark/50 to-transparent"

// Social media colors
className="text-twitter focus:border-twitter/50"
className="text-instagram hover:bg-instagram/10"

// Danger/Error colors
className="text-danger bg-danger/10"
```

### ❌ Yanlış Kullanım (Hardcoded Hex)

```tsx
// YANLIŞ - Hex renk kullanma!
className="bg-[#12141a]"
className="text-[#1DA1F2]"
className="from-[#0f1115]"
```

### Mevcut CSS Değişkenleri

| Değişken | Tailwind Class | Kullanım |
|----------|----------------|----------|
| `--bg-main` | `bg-bg-main` | Ana sayfa arka planı |
| `--bg-secondary` | `bg-bg-secondary` | İkincil arka planlar |
| `--bg-dark` | `bg-bg-dark` | Modal arka planları |
| `--bg-dropdown` | `bg-bg-dropdown` | Dropdown menüler |
| `--bg-video` | `bg-bg-video` | Video player |
| `--gradient-dark` | `from-gradient-dark` | Gradient'ler |
| `--color-primary` | `bg-primary`, `text-primary` | Ana marka rengi |
| `--color-danger` | `bg-danger`, `text-danger` | Hata/Silme rengi |
| `--color-twitter` | `text-twitter`, `border-twitter` | Twitter marka rengi |
| `--color-instagram` | `text-instagram`, `border-instagram` | Instagram marka rengi |

---

## Upgrading to Tailwind CSS v4

### Before Upgrading

- **Always read the upgrade documentation first** - Read https://tailwindcss.com/docs/upgrade-guide
- Ensure the git repository is in a clean state before starting

### Upgrade Process

1. Run the upgrade command: `npx @tailwindcss/upgrade@latest` for both major and minor updates
2. The tool will convert JavaScript config files to the new CSS format
3. Review all changes extensively to clean up any false positives
4. Test thoroughly across your application

---

## Breaking Changes Reference

### Renamed Utilities (v4)

| v3 Syntax | v4 Syntax |
|-----------|-----------|
| `flex-grow` | `grow` |
| `flex-shrink` | `shrink` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-slice` | `box-decoration-slice` |
| `decoration-clone` | `box-decoration-clone` |

### Removed Features

- `@apply` directive - Use CSS variables or components instead
- `tailwind.config.js` - Use CSS-based configuration with `@theme`

---

## tw-merge & shadcn/ui Compatibility

### tailwind-merge

`tailwind-merge` (cn utility) CSS değişkenleriyle **tamamen uyumlu** çalışır:

```tsx
import { cn } from "@/lib/utils";

// Bu düzgün çalışır
cn("bg-bg-dark", condition && "bg-bg-secondary")
// Sonuç: condition true ise "bg-bg-secondary"
```

### shadcn/ui

shadcn/ui component'ları CSS değişkenleriyle **uyumlu**:

```tsx
// Button variant'larında CSS değişkenleri kullanılabilir
<Button className="bg-primary hover:bg-primary/90" />

// Theme colors component'larda çalışır
<Badge className="bg-twitter text-white" />
```

---

## Class Ordering Convention

Tailwind class'larını şu sırayla yazın:

1. **Layout** - `flex`, `grid`, `block`, `hidden`
2. **Positioning** - `absolute`, `relative`, `fixed`, `z-10`
3. **Box Model** - `w-full`, `h-10`, `p-4`, `m-2`, `gap-4`
4. **Typography** - `text-sm`, `font-bold`, `text-white`
5. **Visual** - `bg-bg-dark`, `border`, `rounded-xl`, `shadow-lg`
6. **Effects** - `opacity-50`, `blur-sm`, `backdrop-blur-xl`
7. **Transitions** - `transition-all`, `duration-300`, `ease-out`
8. **States** - `hover:`, `focus:`, `active:`, `group-hover:`
9. **Responsive** - `sm:`, `md:`, `lg:`, `xl:`

### Örnek

```tsx
// ✅ Doğru sıralama
className="flex items-center justify-between gap-4 p-4 bg-bg-secondary border border-white/5 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/5 md:p-6"

// ❌ Karışık sıralama
className="hover:bg-white/5 rounded-xl bg-bg-secondary p-4 gap-4 flex justify-between items-center"
```

---

## Responsive Design

### Mobile-First Approach

```tsx
// ✅ Mobile-first (varsayılan mobile, büyük ekranlar için override)
className="text-sm md:text-base lg:text-lg"

// ❌ Desktop-first
className="text-lg md:text-base sm:text-sm"
```

### Common Breakpoints

| Prefix | Min Width | Kullanım |
|--------|-----------|----------|
| (none) | 0px | Mobile default |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

---

## Performance Tips

1. **Avoid long class strings** - 15+ class varsa component'a çıkar
2. **Use semantic components** - Tekrar eden pattern'lar için component yaz
3. **Minimize arbitrary values** - `w-[347px]` yerine `w-80` veya `w-96` kullan
4. **Group with cn()** - Conditional class'lar için cn utility kullan

---

*Son Güncelleme: Aralık 2025*
