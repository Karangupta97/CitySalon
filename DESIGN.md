# CitySalon — Design System & Brand Guidelines

## Project Overview

**CitySalon** is a premium natural skincare e-commerce platform built with a mobile-first, responsive approach. The brand communicates organic luxury, gentle rituals, and ethical beauty through an earthy, warm visual language. The application is a Progressive Web App (PWA) delivering a native-like experience across all devices.

### Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + CSS Variables + `class-variance-authority`
- **UI Components:** shadcn/ui (New York style) + Radix UI primitives
- **Icons:** Lucide React (professional line icons only)
- **Fonts:** Google Fonts (DM Sans, Playfair Display)
- **State:** React Context (Cart), URL state (filters)
- **Animations:** CSS keyframes + IntersectionObserver scroll reveals

### Key Components

| Component | Purpose |
|-----------|---------|
| `Header` | Fixed frosted-glass navigation with cart indicator |
| `Hero` | Full-screen video background with animated text |
| `TrustBadges` | Organic/vegan/clean certifications grid |
| `ProductGrid` | Filterable product catalog with category tabs |
| `FeatureSection` | Bento grid with video + feature cards |
| `Testimonials` | Auto-scrolling three-column review wall |
| `CTABanner` | Full-bleed image banner with benefits |
| `Newsletter` | Email subscription with olive background |
| `Footer` | Brand info, navigation links, social icons |
| `CartDrawer` | Right-side slide-out cart (vaul drawer) |

---

## Color Palette

### Light Theme (Default)

| Token | Hex | Swatch | Role |
|-------|-----|--------|------|
| `--background` | `#F7F4EF` | 🟫 Cream | Page background |
| `--foreground` | `#2C2C2C` | ⬛ Charcoal | Primary text |
| `--card` | `#EDE6DC` | 🟫 Sand | Card surfaces |
| `--card-foreground` | `#2C2C2C` | ⬛ Charcoal | Card text |
| `--primary` | `#4F5B3A` | 🟢 Olive Green | Brand accent, CTAs |
| `--primary-foreground` | `#F7F4EF` | 🟫 Cream | Text on primary |
| `--secondary` | `#D8CFC4` | 🟫 Warm Beige | Secondary surfaces |
| `--secondary-foreground` | `#2C2C2C` | ⬛ Charcoal | Text on secondary |
| `--muted` | `#EDE6DC` | 🟫 Sand | Subtle backgrounds |
| `--muted-foreground` | `#6B6560` | 🟤 Warm Gray | Subdued text |
| `--accent` | `#B8ADA3` | 🟫 Soft Taupe | Decorative accent |
| `--accent-foreground` | `#2C2C2C` | ⬛ Charcoal | Text on accent |
| `--destructive` | `#A65D57` | 🔴 Terracotta Red | Errors, sale badges |
| `--destructive-foreground` | `#F7F4EF` | 🟫 Cream | Text on destructive |
| `--border` | `#D8CFC4` | 🟫 Warm Beige | Borders, dividers |
| `--input` | `#EDE6DC` | 🟫 Sand | Input backgrounds |
| `--ring` | `#4F5B3A` | 🟢 Olive Green | Focus rings |

**Chart Colors (Light):**
| Token | Hex | Role |
|-------|-----|------|
| `--chart-1` | `#4F5B3A` | Primary data |
| `--chart-2` | `#B8ADA3` | Secondary data |
| `--chart-3` | `#D8CFC4` | Tertiary data |
| `--chart-4` | `#8B9A6D` | Quaternary data |
| `--chart-5` | `#6B6560` | Quinary data |

### Dark Theme

| Token | Hex | Swatch | Role |
|-------|-----|--------|------|
| `--background` | `#2C2C2C` | ⬛ Dark Charcoal | Page background |
| `--foreground` | `#F7F4EF` | 🟫 Cream | Primary text |
| `--card` | `#3D3D3D` | ⬛ Dark Surface | Card surfaces |
| `--card-foreground` | `#F7F4EF` | 🟫 Cream | Card text |
| `--primary` | `#8B9A6D` | 🟢 Sage Green | Brand accent, CTAs |
| `--primary-foreground` | `#2C2C2C` | ⬛ Dark Charcoal | Text on primary |
| `--secondary` | `#4A4540` | ⬛ Dark Warm | Secondary surfaces |
| `--secondary-foreground` | `#F7F4EF` | 🟫 Cream | Text on secondary |
| `--muted` | `#3D3D3D` | ⬛ Dark Surface | Subtle backgrounds |
| `--muted-foreground` | `#B8ADA3` | 🟫 Soft Taupe | Subdued text |
| `--accent` | `#4A4540` | ⬛ Dark Warm | Decorative accent |
| `--accent-foreground` | `#F7F4EF` | 🟫 Cream | Text on accent |
| `--destructive` | `#A65D57` | 🔴 Terracotta Red | Errors, sale badges |
| `--destructive-foreground` | `#F7F4EF` | 🟫 Cream | Text on destructive |
| `--border` | `#4A4540` | ⬛ Dark Warm | Borders, dividers |
| `--input` | `#3D3D3D` | ⬛ Dark Surface | Input backgrounds |
| `--ring` | `#8B9A6D` | 🟢 Sage Green | Focus rings |

**Chart Colors (Dark):**
| Token | Hex | Role |
|-------|-----|------|
| `--chart-1` | `#8B9A6D` | Primary data |
| `--chart-2` | `#B8ADA3` | Secondary data |
| `--chart-3` | `#6B6560` | Tertiary data |
| `--chart-4` | `#4F5B3A` | Quaternary data |
| `--chart-5` | `#D8CFC4` | Quinary data |

---

## Typography

### Font Families

| Token | Family | Use Case |
|-------|--------|----------|
| `--font-sans` | `DM Sans` (300, 400, 500, 600) | Body text, UI elements, navigation |
| `--font-serif` | `Playfair Display` (400, 500, 600, 700) | Headlines, brand name, product titles |
| `--font-mono` | `Geist Mono` | Code snippets (reserved) |

### Type Scale

| Element | Classes | Size |
|---------|---------|------|
| Hero headline | `font-serif text-5xl md:text-6xl lg:text-7xl xl:text-9xl` | 48→72→96px |
| Section headline | `font-serif text-4xl md:text-7xl` | 36→72px |
| Product card title | `font-serif text-lg` or `text-xl` | 18–20px |
| Body text | `text-lg` | 18px |
| Small body | `text-sm` | 14px |
| Overline/Label | `text-sm tracking-[0.3em] uppercase` | 14px, spaced |
| Logo | `font-serif text-3xl tracking-wider` | 30px |
| Badge | `text-xs tracking-wide` | 12px |

### Font Weight Usage

- **300 (Light):** Rarely, for very subtle UI text
- **400 (Regular):** Body text, descriptions
- **500 (Medium):** Navigation links, button labels, subheadings
- **600 (Semi-bold):** Hero text, emphasis
- **700 (Bold):** Serif headlines, footer brand watermark

---

## Spacing System

### Container

```
max-w-7xl mx-auto px-6 lg:px-8
```

Max width: 1280px. Horizontal padding: 24px (mobile), 32px (desktop).

### Section Spacing

| Context | Padding | Value |
|---------|---------|-------|
| Standard section | `py-24` | 96px top + bottom |
| Compact section | `py-20` | 80px top + bottom |
| Page with fixed header | `pt-28 pb-20` | 112px top, 80px bottom |
| Between grid items | `gap-6` | 24px |
| Between content blocks | `gap-12 lg:gap-20` | 48px → 80px |
| Footer columns | `gap-10` | 40px |
| Section margin below header | `mb-16` | 64px |
| Content margin bottom | `mb-10` | 40px |

### Component Internal Spacing

| Context | Padding | Value |
|---------|---------|-------|
| Card content area | `p-5` or `p-6` | 20–24px |
| Bento grid item | `p-6 md:p-8` | 24–32px |
| Button (primary CTA) | `px-8 py-4` | 32px × 16px |
| Button (small) | `px-4 py-2` or `px-6 py-2.5` | 16–24px × 8–10px |
| Trust badge card | `p-6 lg:p-8` | 24–32px |
| Input field | `px-6 py-4` | 24px × 16px |

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius` (base) | `16px` (1rem) | Base reference |
| `--radius-sm` | `12px` | Small elements, badges |
| `--radius-md` | `14px` | Buttons (shadcn default) |
| `--radius-lg` | `16px` | Standard cards |
| `--radius-xl` | `24px` | Large cards |
| `--radius-2xl` | `32px` | Hero elements |
| `rounded-3xl` | `24px` | Product cards, bento grid, images |
| `rounded-full` | `9999px` | Buttons, pills, avatars, badges |
| `rounded-lg` | `8px` | Navigation bar |
| `rounded-xl` | `12px` | Overlay cards, trust badges |

---

## Shadows

### Primary Shadow — `.boty-shadow`

A multi-layered, ultra-soft shadow creating subtle depth without harsh edges:

```css
box-shadow:
  rgba(14, 63, 126, 0.04) 0px 0px 0px 1px,
  rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px,
  rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
  rgba(42, 51, 70, 0.04) 0px 6px 6px -3px,
  rgba(14, 63, 126, 0.04) 0px 12px 12px -6px,
  rgba(14, 63, 126, 0.04) 0px 24px 24px -12px;
```

**Used on:** Product cards, icon buttons, filter pills, quantity selectors, social icons.

### Header Shadow

```css
box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
```

**Used on:** Fixed navigation bar only.

### Shadow Rules

- DO: Use `.boty-shadow` on all elevated interactive elements
- DO: Layer subtle shadows rather than a single harsh one
- DON'T: Use Tailwind's default `shadow-md` or `shadow-lg` (too harsh)
- DON'T: Use colored shadows that don't match the warm palette

---

## Card Styles

### Product Card

```html
<div class="bg-card rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
  <!-- Image: aspect-square with overflow-hidden -->
  <div class="relative aspect-square bg-muted overflow-hidden">
    <!-- Badge positioned top-left -->
    <!-- Quick-add button bottom-right, hidden until hover -->
  </div>
  <!-- Content: p-5 or p-6 -->
  <div class="p-5">
    <h3 class="font-serif text-lg text-foreground mb-1">Name</h3>
    <p class="text-sm text-muted-foreground mb-3">Description</p>
    <span class="font-medium text-foreground">$Price</span>
  </div>
</div>
```

### Testimonial Card

```html
<div class="rounded-3xl p-6 bg-white boty-shadow">
  <p class="text-foreground/80 leading-relaxed mb-4 font-medium text-xl font-serif tracking-wide">
    "Quote text"
  </p>
  <div class="flex items-start justify-between gap-2">
    <div>
      <p class="text-foreground text-sm font-bold">Name</p>
      <p class="text-xs text-muted-foreground">Location</p>
    </div>
    <span class="text-xs tracking-wide text-primary/70 bg-primary/5 px-2 py-1 rounded-full">
      Product
    </span>
  </div>
</div>
```

### Feature/Trust Card

```html
<div class="group p-5 boty-transition hover:scale-[1.02] rounded-md bg-white">
  <div class="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 group-hover:bg-primary/20 bg-stone-50">
    <Icon class="w-5 h-5 text-primary" />
  </div>
  <h3 class="font-medium text-foreground mb-1">Title</h3>
  <p class="text-sm text-muted-foreground">Description</p>
</div>
```

### Card Rules

- DO: Use `rounded-3xl` (24px) for all standalone cards
- DO: Apply `.boty-shadow` for elevation
- DO: Use `overflow-hidden` on cards with images
- DO: Add `group-hover:scale-[1.02]` for interactive cards
- DON'T: Use hard borders on cards (use shadow for separation)
- DON'T: Exceed `p-6` internal padding (keeps things tight)
- DON'T: Mix card background colors within the same section

---

## Component Stylings

### Buttons

**Primary CTA (Pill):**
```
bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow
```

**Secondary/Outline (Pill):**
```
bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5
```

**Filter Pill (Active/Inactive):**
```
Active:   bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm
Inactive: bg-card text-foreground/70 px-4 py-2 rounded-full text-sm hover:text-foreground boty-shadow
```

**Icon Button:**
```
w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition
```

### Badges

| Type | Style |
|------|-------|
| Sale | `bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs` |
| New | `bg-primary/10 text-primary px-3 py-1 rounded-full text-xs` |
| Bestseller | `bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs` |
| Product tag | `text-primary/70 bg-primary/5 px-2 py-1 rounded-full text-xs` |

### Navigation Header

```
Fixed top, z-50, frosted glass effect:
backdrop-blur-md bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.32)] rounded-lg
Height: h-[68px]
Logo: Centered absolute (font-serif text-3xl tracking-wider)
```

### Form Inputs

```
bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-6 py-4
Placeholder: text-primary-foreground/50
Focus: focus:border-primary-foreground/40
```

### Segmented Control (Category Switcher)

```
Container: inline-flex bg-background rounded-full p-1 gap-1
Active tab: animated sliding bg-foreground rounded-full (text inverts to bg-background)
Inactive tab: text-muted-foreground hover:text-foreground
```

---

## Animations & Transitions

### Base Transition — `.boty-transition`

```css
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

Applied to ALL interactive elements (buttons, links, cards, icons). Creates smooth, natural movement.

### Scroll Reveal — `animate-blur-in`

```css
@keyframes blur-in {
  0% { opacity: 0; filter: blur(12px); transform: translateY(10px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}
animation: blur-in 0.8s ease-out;
```

Used for staggered text reveals with `animationDelay` increments of `0.2s`.

### Header Entrance — `animate-scale-fade-in`

```css
@keyframes scale-fade-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
animation: scale-fade-in 0.6s ease-out;
```

### Scroll-Triggered Card Reveal

```
Initial: opacity-0 scale-95
Visible: opacity-100 scale-100
Duration: duration-500 or duration-700 ease-out
Stagger: transitionDelay: `${index * 80}ms`
```

### Hover Effects

| Element | Effect |
|---------|--------|
| Product card | `group-hover:scale-[1.02]` |
| Product image | `group-hover:scale-105` |
| Arrow icon | `group-hover:translate-x-1` |
| Quick-add button | `opacity-0 translate-y-2 → opacity-100 translate-y-0` |
| Feature card | `hover:scale-[1.02]` |
| Icon container | `group-hover:bg-primary/20` |

### Testimonial Auto-Scroll

```css
@keyframes scroll-down {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
Duration: 30s linear infinite (slows to 60s on hover)
```

### Animation Rules

- DO: Use IntersectionObserver (threshold: 0.1) for scroll reveals
- DO: Stagger children with 80–150ms delays
- DO: Start elements at `opacity-0 scale-95` or `opacity-0 translateY(8px)`
- DON'T: Use spring/bounce physics (keep easing smooth and calm)
- DON'T: Animate more than opacity + transform simultaneously
- DON'T: Use animations faster than 0.4s for transitions or 0.6s for entrances

---

## Layout Principles

### Grid System

| Layout | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Product grid (home) | 1 col | 2 cols | 4 cols |
| Product grid (shop) | 1 col | 2 cols | 3 cols |
| Feature bento | Stack | 4-col grid | 4-col grid |
| Two-col content | Stack | Stack | 2 cols |
| Trust badges | 2 cols | 2 cols | 4 cols |
| Footer | 2 cols | 4 cols | 4 cols |
| Testimonials | 1 col scroll | 3 col scroll | 3 col scroll |

### Section Alternation Pattern

Sections alternate between `bg-background` (#F7F4EF) and `bg-card` (#EDE6DC) to create visual rhythm without hard separators.

```
Hero        → custom (#e3e1e2)
TrustBadges → bg-background
ProductGrid → bg-card
Features    → bg-background
Testimonials→ bg-background
CTABanner   → bg-background (image fill)
Newsletter  → bg-primary (olive green)
Footer      → bg-card
```

### Page Structure

```
<Header />      ← Fixed, z-50, frosted glass
<main>
  <Section />   ← Full-width, max-w-7xl inner container
  <Section />   ← Alternating backgrounds
  ...
</main>
<Footer />      ← bg-card with giant watermark text
```

---

## Responsive Behavior

### Mobile-First Strategy

All styles are written mobile-first. Desktop overrides use `sm:`, `md:`, `lg:`, `xl:` prefixes.

### Breakpoints (Tailwind Defaults)

| Prefix | Min-width | Typical Use |
|--------|-----------|-------------|
| `sm` | 640px | 2-col grids, inline buttons |
| `md` | 768px | Bento grid, desktop nav shows |
| `lg` | 1024px | 3–4 col grids, two-col layouts |
| `xl` | 1280px | Max font sizes |

### Mobile Adaptations

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Navigation | Hamburger + dropdown | Inline links |
| Hero text | `text-5xl` centered | `text-7xl` left-aligned |
| Product grid | Single column | 3–4 columns |
| Cart drawer | Full-width | `max-w-[440px]` |
| Filter panel | Full-screen overlay | Inline pill row |
| Bento grid | Stacked cards | 4-col 2-row grid |
| Footer | 2-col links | 4-col links |
| Account icon | Hidden | Visible |
| Category tabs | Same (horizontal scroll) | Same |

### Touch Targets

- Minimum tap target: `w-10 h-10` (40px) for icon buttons
- CTA buttons: `py-4` minimum height (~56px)
- Navigation items: Generous padding (`p-2`) for touch

### Mobile Detection Hook

```typescript
const MOBILE_BREAKPOINT = 768
// Uses window.matchMedia for real-time detection
```

---

## PWA Configuration

### Requirements

CitySalon must be installable as a Progressive Web App with native-like behavior:

| Feature | Status | Implementation |
|---------|--------|----------------|
| Web App Manifest | Required | `/public/manifest.json` |
| Service Worker | Required | `next-pwa` or custom SW |
| Offline Support | Required | Cache-first for static assets |
| Theme Color | ✅ Set | `#F7F4EF` (light), `#2C2C2C` (dark) |
| Icons (maskable) | Required | 192×192, 512×512, maskable variants |
| Apple Touch Icon | ✅ Set | `/public/apple-icon.png` |
| Splash Screens | Required | Auto-generated from manifest |
| Standalone Display | Required | `"display": "standalone"` |

### Manifest Template

```json
{
  "name": "CitySalon — Beauty & Wellness",
  "short_name": "CitySalon",
  "description": "Natural skincare for those who believe beauty should feel as good as it looks.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F7F4EF",
  "theme_color": "#F7F4EF",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512x512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Offline Strategy

- **Static assets:** Cache-first (CSS, JS, fonts, images)
- **API responses:** Network-first with stale fallback
- **Pages:** Network-first, offline fallback page for uncached routes

---

## Iconography

### Library: Lucide React

Professional, consistent line icons. No emoji. No filled icons unless explicitly required for active states (e.g., filled star ratings).

### Icon Sizing

| Context | Size | Class |
|---------|------|-------|
| Trust badges | 48px | `size-12` |
| Section features | 32px | `w-8 h-8` |
| Card feature icons | 20px | `w-5 h-5` |
| Button inline icons | 16px | `w-4 h-4` |
| Navigation actions | 20px | `w-5 h-5` |
| Cart quantity controls | 12px | `w-3 h-3` |

### Stroke Weight

- Default: `strokeWidth={2}` (Lucide default)
- Large decorative icons: `strokeWidth={1}` (trust badges, CTA icons)

### Icons in Use

| Category | Icons |
|----------|-------|
| Navigation | `Menu`, `X`, `Search`, `User`, `ShoppingBag`, `ChevronLeft` |
| E-commerce | `ShoppingBag`, `Minus`, `Plus`, `Trash2`, `Star`, `Check` |
| Brand/Nature | `Leaf`, `Flower2`, `Globe`, `Recycle`, `Droplets`, `Sparkles` |
| Social | `Instagram`, `Facebook`, `Twitter` |
| UI | `ArrowRight`, `ChevronDown`, `SlidersHorizontal`, `Heart`, `Award` |

### Icon Rules

- DO: Use Lucide icons exclusively throughout the app
- DO: Match icon color to surrounding text (`text-primary`, `text-foreground`, `text-muted-foreground`)
- DO: Wrap icons in circular containers for feature cards (`w-10 h-10 rounded-full bg-stone-50`)
- DON'T: Use emoji anywhere in the UI
- DON'T: Use filled icon variants (keep everything outlined/line-style)
- DON'T: Mix icon libraries (no Font Awesome, no Heroicons, no custom SVGs)
- DON'T: Use icons larger than 48px (they should complement, not dominate)

---

## Behavioral Rules — Do's and Don'ts

### Brand Voice

CitySalon communicates **calm luxury** — natural, gentle, intentional. Every design choice should feel like a spa experience: unhurried, warm, and grounding.

### Visual Do's

- ✅ Use warm, earthy tones (sand, olive, taupe, cream)
- ✅ Prefer generous whitespace over cramped layouts
- ✅ Use `rounded-3xl` and `rounded-full` — everything should feel soft
- ✅ Apply `.boty-shadow` for subtle depth (never harsh drop shadows)
- ✅ Maintain `font-serif` for all headlines and brand elements
- ✅ Keep animations smooth and slow (min 0.4s for transitions)
- ✅ Use real product photography or lifestyle video, never stock illustrations
- ✅ Alternate section backgrounds for visual rhythm
- ✅ Center section headers with overline label pattern
- ✅ Use frosted glass (`backdrop-blur-md`) for overlays and headers

### Visual Don'ts

- ❌ Never use pure black (`#000000`) — use charcoal (`#2C2C2C`) instead
- ❌ Never use pure white (`#FFFFFF`) as a page background — use cream (`#F7F4EF`)
- ❌ No emoji anywhere in the interface
- ❌ No neon, electric, or saturated colors
- ❌ No sharp corners (minimum radius: `rounded-md` / 6px)
- ❌ No default Tailwind shadow utilities (`shadow-md`, `shadow-lg`)
- ❌ No generic sans-serif for headlines (always use Playfair Display)
- ❌ No underlined links in body content (use color change on hover)
- ❌ No pagination — use infinite scroll or "View All" pattern
- ❌ No skeleton loaders with gray pulses — use gradient shimmer on `bg-muted`
- ❌ No harsh border lines between cards — rely on background contrast and shadows
- ❌ No icon-only buttons without `aria-label`
- ❌ No animations faster than 300ms

### Interaction Principles

- ✅ Cards lift slightly on hover (`scale-[1.02]`)
- ✅ Images zoom subtly on card hover (`scale-105`)
- ✅ Buttons use `.boty-transition` (never instant state changes)
- ✅ Quick-action buttons reveal on hover with translate + opacity
- ✅ Page content reveals on scroll via IntersectionObserver
- ✅ Category changes animate out → swap → animate in
- ❌ No layout shift during loading
- ❌ No jarring page transitions (prefer smooth scroll)
- ❌ No auto-playing audio

### Content Guidelines

- Headlines: Short, poetic, lowercase (e.g., "Glow gently.", "Care that breathes.")
- Overlines: ALL CAPS with wide letter-spacing (`tracking-[0.3em]`)
- Body: Warm, conversational, 1–2 sentences max per paragraph
- CTAs: Action-oriented, concise ("Shop Now", "View All Products", "Subscribe")
- Product names: Title case, 2–3 words max

---

## Accessibility

### Requirements

- All interactive elements must have visible focus indicators (`ring` utility)
- All icon-only buttons require `aria-label`
- Color contrast: Meet WCAG 2.1 AA minimum (4.5:1 for text, 3:1 for large text)
- Images must have descriptive `alt` text
- Form inputs must have associated labels
- Motion: Respect `prefers-reduced-motion` — disable animations when set
- Semantic HTML: Use `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>` appropriately
- Focus order: Logical tab order following visual layout
- Skip navigation: Provide skip-to-content link for keyboard users

### Color Contrast Verification

| Combination (Light) | Ratio | Pass |
|---------------------|-------|------|
| Foreground on Background (`#2C2C2C` on `#F7F4EF`) | 11.2:1 | ✅ AAA |
| Primary on Background (`#4F5B3A` on `#F7F4EF`) | 5.8:1 | ✅ AA |
| Muted-foreground on Background (`#6B6560` on `#F7F4EF`) | 4.6:1 | ✅ AA |
| Primary-foreground on Primary (`#F7F4EF` on `#4F5B3A`) | 5.8:1 | ✅ AA |

| Combination (Dark) | Ratio | Pass |
|---------------------|-------|------|
| Foreground on Background (`#F7F4EF` on `#2C2C2C`) | 11.2:1 | ✅ AAA |
| Primary on Background (`#8B9A6D` on `#2C2C2C`) | 4.7:1 | ✅ AA |
| Muted-foreground on Background (`#B8ADA3` on `#2C2C2C`) | 5.9:1 | ✅ AA |

---

## File Structure Convention

```
frontend/
├── app/                     # Next.js App Router pages
│   ├── globals.css          # Design tokens (CSS variables), animations
│   ├── layout.tsx           # Root layout (fonts, metadata, providers)
│   ├── page.tsx             # Homepage (composed from boty components)
│   ├── shop/page.tsx        # Shop catalog page
│   └── product/[id]/page.tsx # Product detail page
├── components/
│   ├── boty/                # Brand-specific feature components
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── product-grid.tsx
│   │   ├── cart-context.tsx
│   │   ├── cart-drawer.tsx
│   │   └── ...
│   ├── ui/                  # shadcn/ui primitives (do not modify styles)
│   └── theme-provider.tsx   # next-themes wrapper
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities (cn, etc.)
└── public/
    ├── images/products/     # Product photography
    ├── icons/               # PWA icons
    └── manifest.json        # PWA manifest
```

---

## Implementation Checklist

- [ ] PWA manifest at `/public/manifest.json`
- [ ] Service worker registration
- [ ] Maskable icons (192×192, 512×512)
- [ ] Offline fallback page
- [ ] Dark mode toggle in header (uses `next-themes`)
- [ ] `prefers-reduced-motion` media query support
- [ ] Skip-to-content link
- [ ] Viewport meta with `viewport-fit=cover` for notched devices
- [ ] Touch-action optimization for scroll areas
- [ ] `theme-color` meta tag that updates with dark/light mode
