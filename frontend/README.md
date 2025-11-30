# Frontend - Village Peer Support Platform

Next.js 16 + React 19 + Tailwind CSS 4 frontend for the eSafety Hackathon.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Environment Setup

Create `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Landing page (Hero, Features, FAQ)
│   ├── layout.tsx            # Root layout (AuthProvider wrapped)
│   ├── (auth)/               # Auth route group
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Signup page
│   ├── auth/callback/        # OAuth callback handler
│   ├── chat/page.tsx         # AI chat interface (protected)
│   ├── posts/page.tsx        # Posts listing with filters
│   ├── stories/page.tsx      # Stories listing (protected)
│   ├── stories/[id]/page.tsx # Individual story detail (public)
│   └── api/chat/route.ts     # Chat API endpoint
├── components/
│   ├── Auth/                 # Authentication components
│   │   ├── AuthProvider.tsx  # Global auth context
│   │   ├── LoginForm.tsx     # Login form
│   │   ├── SignupForm.tsx    # Signup form
│   │   └── UserButton.tsx    # Header user menu
│   ├── Header/               # Navigation components
│   ├── HeroSection/          # Landing hero
│   ├── Feature/              # Features section
│   ├── FAQSection/           # FAQ accordion
│   ├── Chat/                 # Chat interface components
│   ├── Stories/              # Stories page components
│   ├── PostCard.tsx          # Post card component
│   ├── ui/                   # shadcn/ui primitives
│   └── icons/                # SVG icon components
├── lib/
│   ├── supabase.ts           # Supabase client & fetch functions
│   ├── supabase/             # Supabase SSR utilities
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server component client
│   │   └── middleware.ts     # Auth middleware logic
│   ├── utils.ts              # Utility functions
│   └── data/stories.ts       # Seed stories (fallback)
├── middleware.ts             # Route protection middleware
└── config/site.ts            # Site metadata
```

## Pages

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Landing page with Hero, Features, FAQ | No |
| `/login` | Login page | No |
| `/signup` | Signup page | No |
| `/chat` | AI peer support chat interface | Yes |
| `/posts` | Posts listing with search and category filters | No |
| `/stories` | Recovery stories from Supabase `posts` table | Yes |
| `/stories/[id]` | Individual story detail view | No |

## Supabase Integration

### Database Tables

**`posts`** - Stores supportive community posts
- `id` (UUID)
- `user_id` (TEXT)
- `content` (TEXT)
- `topic_tags` (TEXT[]) - Categories for filtering
- `timestamp`, `created_at`

### Fetch Functions (`lib/supabase.ts`)

```typescript
// Get Supabase client (lazy initialization)
getSupabase(): SupabaseClient | null

// Fetch all stories from posts table
fetchMentorStories(): Promise<Story[]>

// Fetch single story by ID
fetchMentorStoryById(id: string): Promise<Story | null>

// Fetch stories filtered by categories
fetchStoriesByCategories(categories: string[]): Promise<Story[]>

// Fetch all unique categories from posts
fetchUniqueCategories(): Promise<string[]>
```

### Post to Story Transformation

Posts from Supabase are transformed to Story format:
- **Title**: Generated from first sentence of content (max 80 chars)
- **Author**: `Anonymous XXXX` (last 4 digits of user_id)
- **Excerpt**: First 200 characters
- **Tags**: `topic_tags` directly from Supabase (used as categories)
- **Read Time**: Calculated from word count (200 wpm)

### Dynamic Categories

Categories are fetched dynamically from Supabase `topic_tags`:
- No hardcoded category mappings
- Filter buttons show actual categories present in database
- Categories include: "Mental health history", "Views on women", "Dating history", etc.

## Chat Feature

The chat interface at `/chat`:
- Uses OpenRouter API (Google Gemini 2.0 Flash)
- Falls back to mock responses if API unavailable
- Prompts users to explore stories after 4+ messages
- System prompt guides compassionate peer support

## Tech Stack

| Package | Version |
|---------|---------|
| Next.js | 16.0.5 |
| React | 19.2.0 |
| TypeScript | 5.x |
| Tailwind CSS | 4.0.7 |
| Supabase | @supabase/ssr |
| Motion | 12.0.5 |
| shadcn/ui | Latest |

## Authentication

### Overview
Uses Supabase Auth with `@supabase/ssr` (the recommended SSR package).

### Features
- Email/password authentication
- Anonymous browsing (temporary users)
- Anonymous-to-permanent account conversion
- Route protection via middleware

### Auth Flow
1. Unauthenticated users visiting protected routes → redirected to `/login`
2. Login options: email/password or "Browse Anonymously"
3. Anonymous users see prompt to convert to permanent account
4. `useAuth()` hook provides user state in client components

### Key Files
| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection |
| `lib/supabase/client.ts` | Browser client |
| `lib/supabase/server.ts` | Server client |
| `components/Auth/AuthProvider.tsx` | Global auth context |
| `components/Auth/UserButton.tsx` | Header sign-in/out UI |

### Usage
```tsx
// Client component
import { useAuth } from '@/components/Auth'

function MyComponent() {
  const { user, isAnonymous, signOut } = useAuth()
  // ...
}

// Server component
import { createClient } from '@/lib/supabase/server'

async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ...
}
```

## Component Patterns

Each section follows a consistent pattern:
- `index.tsx` - Main component
- `*Data.ts` - Configuration/content data
- Sub-components for composition

Example:
```
Stories/
├── index.tsx           # Main export (fetches from Supabase)
├── StoriesHeader.tsx   # Page header
├── StoryFilters.tsx    # Dynamic category filters
└── StoryCard.tsx       # Individual story card
```

## Styling (Tailwind v4)

- CSS-first config in `app/globals.css`
- Use `bg-black/50` not `bg-opacity-50`
- Dark mode: `dark:` prefix
- Custom theme via CSS variables

## Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

```bash
npm run build
npm run start
```

Or deploy to Vercel:
```bash
npx vercel
```
