# CLAUDE.md - Project Context for Claude Code

## Project Overview

**Project:** been there - Peer Support Platform
**Tagline:** Real human experiences, not AI therapy
**Event:** eSafety Hackathon - "Needle in the Hashtag"
**Theme:** 16 Days of Activism Against Gender-Based Violence
**Dates:** Nov 29-30, 2025 (Stone & Chalk, Melbourne)
**Submission:** Dec 5, 11:59pm | Pitch Day: Dec 11

## Tech Stack

### Frontend
| Component | Version |
|-----------|---------|
| Next.js | 16.0.5 |
| React | 19.2.0 |
| TypeScript | 5.x |
| Tailwind CSS | 4.0.7 |
| Motion | 12.0.5 |
| shadcn/ui | Latest |
| Supabase | @supabase/ssr |

### Backend
| Component | Version |
|-----------|---------|
| FastAPI | Latest |
| Python | 3.x |
| sentence-transformers | Latest |
| OpenRouter API | Gemini 2.0 Flash |

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
│   ├── diary/page.tsx      # Diary entries list (protected)
│   ├── write/page.tsx      # Write new diary entry (protected)
│   └── api/chat/route.ts   # Chat API endpoint (OpenRouter)
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

### Completed ✅
- [x] Landing page complete (Hero, Features, FAQ, Footer)
- [x] Dark mode support (next-themes)
- [x] Responsive design (mobile-first)
- [x] Build passes
- [x] Chat interface with OpenRouter API (Gemini 2.0 Flash)
- [x] Stories page with Supabase data fetching
- [x] Story detail pages with related stories
- [x] Supabase authentication system
- [x] Route protection (middleware)
- [x] Diary UI pages (/diary and /write)

### In Progress ⚠️
- [ ] Diary Supabase integration (uses mock data currently)
  - `frontend/app/write/page.tsx:47` - TODO: Save to Supabase
  - `frontend/app/diary/page.tsx:49,89` - TODO: Fetch/delete from Supabase
- [ ] Backend semantic matching (embeddings not generated)
- [ ] Like/Favorite functionality

### Planned 📋
- [ ] Professional resources page
- [ ] User profile management
- [ ] Story submission form
- [ ] Content moderation integration

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

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Backend** (`.env`):
```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-key
```

## Backend Integration

### Chat API
- **Endpoint:** `frontend/app/api/chat/route.ts`
- **LLM Provider:** OpenRouter (using Gemini 2.0 Flash model)
- **Fallback:** Mock responses when API unavailable
- **Purpose:** Compassionate AI to help users articulate feelings (NOT therapy)

### Semantic Matching (TODO)
- **Backend:** `backend/services/matcher.py` (SemanticMatcher class)
- **Status:** Code complete, needs embeddings file generated
- **Required:** Run `backend/scripts/generate_embeddings.py` after seeding posts
- **Purpose:** Match user descriptions to relevant mentor stories using cosine similarity

### Database Schemas
See [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) for:
- Profiles table (auto-created on signup)
- Posts table (mentor stories)
- Diary entries table (private journaling)
- User favorites table (NEW - for like/favorite feature)

## Notes for Claude Code

1. **Hackathon context** - Speed matters, working solutions over perfect code
2. **Demo-first** - Focus on the happy path for judges
3. **Check existing code** - Look in `components/` before creating new
4. **Keep it simple** - Don't over-engineer
5. **Tailwind v4** - Use new syntax, not v3 patterns
6. **Auth pattern** - Use `useAuth()` hook for client components, `createClient()` from server.ts for server components
