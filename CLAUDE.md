# CLAUDE.md - Project Context for Claude Code

## Project Overview

**Project:** Village - Peer Support for Young Men
**Event:** eSafety Hackathon - "Needle in the Hashtag"
**Theme:** 16 Days of Activism Against Gender-Based Violence
**Dates:** Nov 29-30, 2025 (Stone & Chalk, Melbourne)
**Submission:** Dec 5, 11:59pm | Pitch Day: Dec 11

## Tech Stack

| Component | Version |
|-----------|---------|
| Next.js | 16.0.1 |
| React | 19.2.0 |
| TypeScript | 5.x |
| Tailwind CSS | 4.0.7 |
| Motion | 12.0.5 |
| shadcn/ui | Latest |

## Quick Commands

```bash
# Development
npm install
npm run dev          # http://localhost:3000

# Production
npm run build
npm start

# Linting
npm run lint
```

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Tailwind v4 config
├── components/
│   ├── Header/             # Navigation
│   ├── HeroSection/        # Landing hero
│   ├── Feature/            # Features
│   ├── FAQSection/         # FAQ accordion
│   ├── PricingSection/     # Pricing
│   ├── ui/                 # shadcn/ui components
│   ├── icons/              # SVG icons
│   └── footer.tsx          # Footer
├── config/site.ts          # Site metadata
├── lib/utils.ts            # Utilities
├── docs/                   # Documentation
│   ├── DEVELOPMENT.md      # Dev guide
│   ├── COMPONENTS.md       # Component reference
│   └── API_CONTRACT.md     # API spec
└── public/                 # Static assets
```

## Key Patterns

### Component Structure
Each section has its own folder:
- `index.tsx` - Main component
- `*Data.ts` - Configuration data
- Supporting sub-components

### Styling (Tailwind v4)
- CSS-first config in `globals.css`
- Use `bg-black/50` not `bg-opacity-50`
- `shadow-xs` replaces `shadow-sm`
- Dark mode: `dark:` prefix

### Page Composition
```tsx
import HeroSection from "@/components/HeroSection";
import Feature from "@/components/Feature";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Feature />
    </>
  );
}
```

## Coding Conventions

- **TypeScript:** Strict mode, explicit types
- **Naming:** camelCase for JS/TS, kebab-case for files
- **Imports:** Use `@/` path alias
- **Components:** Prefer composition over props drilling
- **Styling:** Tailwind utilities, consistent spacing

## Current Status

- [x] Landing page complete (Hero, Features, FAQ, Footer)
- [x] Dark mode support
- [x] Responsive design
- [x] Build passes
- [ ] Chat interface
- [ ] Stories page
- [ ] Backend integration

## Notes for Claude Code

1. **Hackathon context** - Speed matters, working solutions over perfect code
2. **Demo-first** - Focus on the happy path for judges
3. **Check existing code** - Look in `components/` before creating new
4. **Keep it simple** - Don't over-engineer
5. **Tailwind v4** - Use new syntax, not v3 patterns

## Documentation

- `docs/DEVELOPMENT.md` - Full development guide
- `docs/COMPONENTS.md` - Component reference
- `docs/API_CONTRACT.md` - API specification
