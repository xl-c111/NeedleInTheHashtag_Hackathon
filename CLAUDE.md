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
| Next.js | 16.0.5 |
| React | 19.2.0 |
| TypeScript | 5.x |
| Tailwind CSS | 4.0.7 |
| Motion | 12.0.5 |
| shadcn/ui | Latest |
| Supabase | @supabase/ssr |

## Quick Commands

```bash
# Development (from frontend/)
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
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout (AuthProvider wrapped)
│   ├── globals.css         # Tailwind v4 config
│   ├── (auth)/             # Auth route group
│   │   ├── login/page.tsx  # Login page
│   │   └── signup/page.tsx # Signup page
│   ├── auth/callback/      # OAuth callback handler
│   ├── chat/page.tsx       # Chat interface (protected)
│   ├── stories/            # Stories section
│   │   ├── page.tsx        # Stories listing (protected)
│   │   └── [id]/page.tsx   # Story detail (public)
│   ├── posts/page.tsx      # Posts page
│   └── api/chat/route.ts   # Chat API endpoint
├── components/
│   ├── Auth/               # Authentication components
│   │   ├── AuthProvider.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── UserButton.tsx
│   ├── Chat/               # Chat interface
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageList.tsx
│   │   └── TypingIndicator.tsx
│   ├── Stories/            # Stories components
│   │   ├── StoriesHeader.tsx
│   │   ├── StoryCard.tsx
│   │   └── StoryFilters.tsx
│   ├── Header/             # Navigation
│   ├── HeroSection/        # Landing hero
│   ├── Feature/            # Features section
│   ├── FAQSection/         # FAQ accordion
│   ├── PricingSection/     # Pricing section
│   ├── ui/                 # shadcn/ui components
│   ├── icons/              # SVG icons
│   └── footer.tsx          # Footer
├── lib/
│   ├── supabase.ts         # Supabase client & types
│   ├── supabase/           # Supabase utilities
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Auth middleware logic
│   └── utils.ts            # Utilities
├── middleware.ts           # Route protection
├── config/site.ts          # Site metadata
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
- [x] Chat interface with AI integration
- [x] Stories page with Supabase data
- [x] Supabase authentication system
- [x] Route protection (middleware)
- [ ] User profile management
- [ ] Story submission form

## Authentication

### Overview
- **Provider:** Supabase Auth with `@supabase/ssr`
- **Methods:** Email/password, anonymous browsing
- **Protected Routes:** `/chat`, `/stories` (listing)
- **Public Routes:** `/`, `/stories/[id]` (individual stories)

### Key Files
| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/server.ts` | Server component client |
| `lib/supabase/middleware.ts` | Route protection logic |
| `middleware.ts` | Next.js middleware entry |
| `components/Auth/AuthProvider.tsx` | Global auth context |
| `components/Auth/UserButton.tsx` | Header sign-in/out UI |

### Auth Flow
1. Unauthenticated users redirected to `/login`
2. Users can sign in with email/password or browse anonymously
3. Anonymous users prompted to convert to permanent accounts
4. `useAuth()` hook provides user state throughout app

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Notes for Claude Code

1. **Hackathon context** - Speed matters, working solutions over perfect code
2. **Demo-first** - Focus on the happy path for judges
3. **Check existing code** - Look in `components/` before creating new
4. **Keep it simple** - Don't over-engineer
5. **Tailwind v4** - Use new syntax, not v3 patterns
6. **Auth pattern** - Use `useAuth()` hook for client components, `createClient()` from server.ts for server components
