# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (Turbopack enabled)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Development server runs at **http://localhost:3000**

## Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.1 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.0.7 | Utility-first styling |
| Motion | 12.0.5 | Animations (Framer Motion) |
| Radix UI | Latest | Accessible headless components |
| shadcn/ui | Latest | Pre-built component library |
| Lucide React | 0.507.0 | Icon library |
| next-themes | 0.4.4 | Dark mode support |

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (/)
│   ├── layout.tsx                # Root layout with Header & ThemeProvider
│   ├── globals.css               # Tailwind v4 config & design tokens
│   ├── not-found.tsx             # 404 page
│   └── robots.txt                # SEO robots
│
├── components/                   # React Components
│   ├── Header/                   # Navigation header
│   │   ├── index.tsx             # Main export
│   │   ├── DesktopNavigation.tsx # Desktop nav
│   │   ├── MobileNav.tsx         # Mobile nav drawer
│   │   ├── NavigationData.ts     # Nav links config
│   │   └── ...                   # Other header parts
│   │
│   ├── HeroSection/              # Landing page hero
│   │   ├── index.tsx             # Main export
│   │   ├── HeroContent.tsx       # Headline & description
│   │   ├── HeroImage.tsx         # Hero visual
│   │   └── SignInOptions.tsx     # CTA buttons
│   │
│   ├── Feature/                  # Features showcase
│   │   ├── index.tsx             # Main export
│   │   ├── FeatureData.ts        # Features config
│   │   └── ...                   # Feature components
│   │
│   ├── FAQSection/               # FAQ accordion
│   │   ├── index.tsx             # Main export
│   │   ├── FAQData.ts            # FAQ Q&A config
│   │   └── Accordion.tsx         # Accordion logic
│   │
│   ├── PricingSection/           # Pricing tiers
│   │   ├── index.tsx             # Main export
│   │   └── PricingData.ts        # Pricing config
│   │
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx            # Button with variants
│   │   ├── card.tsx              # Card container
│   │   ├── dropdown-menu.tsx     # Dropdown menu
│   │   ├── input.tsx             # Text input
│   │   ├── label.tsx             # Form label
│   │   └── navigation-menu.tsx   # Nav menu
│   │
│   ├── icons/                    # SVG icon components
│   │   ├── logo.tsx              # Site logo
│   │   └── ...                   # AI provider icons
│   │
│   └── footer.tsx                # Site footer
│
├── config/
│   └── site.ts                   # Site metadata config
│
├── lib/
│   └── utils.ts                  # Utility functions (cn)
│
├── public/                       # Static assets
│   ├── hero-video.mp4            # Videos for features
│   └── ...
│
├── docs/                         # Documentation
│   ├── DEVELOPMENT.md            # This file
│   ├── API_CONTRACT.md           # API specification
│   └── ...
│
└── [Config files]
    ├── next.config.ts            # Next.js config
    ├── tailwind.config.ts        # Tailwind config
    ├── tsconfig.json             # TypeScript config
    ├── components.json           # shadcn/ui config
    ├── biome.jsonc               # Linter config
    └── postcss.config.mjs        # PostCSS config
```

## Component Patterns

### Page Composition

Pages compose section components:

```tsx
// app/page.tsx
import HeroSection from "@/components/HeroSection";
import Feature from "@/components/Feature";
import FAQSection from "@/components/FAQSection";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Feature />
      <FAQSection />
      <Footer />
    </div>
  );
}
```

### Section Components

Each section has its own folder with:
- `index.tsx` - Main component export
- `*Data.ts` - Configuration/content data
- Supporting components

```tsx
// components/Feature/index.tsx
import { FeatureHeader } from "./FeatureHeader";
import { FeatureList } from "./FeatureList";
import { features } from "./FeatureData";

export default function Feature() {
  return (
    <section id="features">
      <FeatureHeader />
      <FeatureList features={features} />
    </section>
  );
}
```

### UI Components (shadcn/ui)

Button variants example:

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

## Styling Guide

### Tailwind CSS v4

This project uses Tailwind CSS v4 with CSS-first configuration:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #your-color;
}

@custom-variant dark (&:is(.dark *));
```

### Key Differences from Tailwind v3

| v3 Syntax | v4 Syntax |
|-----------|-----------|
| `bg-opacity-50` | `bg-black/50` |
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |

### Design Tokens

```css
/* Color tokens in globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --primary: 220 90% 56%;
  /* ... */
}

.dark {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  /* ... */
}
```

### Typography

```tsx
// Headings
<h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl tracking-tight">

// Body text
<p className="text-black/60 dark:text-white/60 leading-relaxed">

// Tight tracking throughout
className="tracking-tight" // or tracking-tighter
```

### Hover States

```tsx
// Subtle background change
className="hover:bg-black/15 dark:hover:bg-white/15"

// Button primary
className="bg-black dark:bg-white hover:opacity-90"
```

## Dark Mode

Uses `next-themes` for dark mode:

```tsx
// In layout.tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

Toggle theme:

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme(theme === "dark" ? "light" : "dark");
```

## Adding New Components

### 1. Create Component Folder

```bash
mkdir components/NewSection
touch components/NewSection/index.tsx
touch components/NewSection/NewSectionData.ts
```

### 2. Create Data File

```ts
// components/NewSection/NewSectionData.ts
export interface Item {
  id: string;
  title: string;
  description: string;
}

export const items: Item[] = [
  { id: "1", title: "Item 1", description: "..." },
];
```

### 3. Create Component

```tsx
// components/NewSection/index.tsx
import { items } from "./NewSectionData";

export default function NewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-semibold text-3xl tracking-tight">Section Title</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border p-6">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 4. Add to Page

```tsx
// app/page.tsx
import NewSection from "@/components/NewSection";

export default function Home() {
  return (
    <div>
      {/* ... other sections */}
      <NewSection />
    </div>
  );
}
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add avatar
```

Components are added to `components/ui/`.

## Configuration Files

### next.config.ts

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "village.app" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  reactStrictMode: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};
```

### tsconfig.json

Path aliases configured:
- `@/*` maps to `./*`

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### components.json (shadcn/ui)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "iconLibrary": "lucide"
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run Biome linter |

## Troubleshooting

### Build Errors

**`new Date()` in Server Component:**
```tsx
// Add "use client" to component or use a different approach
"use client";
```

**`Math.random()` prerender error:**
```ts
// Disable cacheComponents in next.config.ts
cacheComponents: false,
```

### TypeScript Errors

**Legacy folder conflicts:**
```json
// tsconfig.json - exclude legacy folders
"exclude": ["node_modules", "frontend", "backend"]
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` for local development:

```env
# API endpoints (if needed)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run build` to verify
4. Submit PR

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Motion](https://motion.dev)
- [Lucide Icons](https://lucide.dev)
