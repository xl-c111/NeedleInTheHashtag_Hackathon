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
│   ├── layout.tsx            # Root layout with theme provider
│   ├── chat/page.tsx         # AI chat interface
│   ├── stories/page.tsx      # Stories listing (from Supabase)
│   ├── stories/[id]/page.tsx # Individual story detail
│   └── api/chat/route.ts     # Chat API endpoint
├── components/
│   ├── Header/               # Navigation components
│   ├── HeroSection/          # Landing hero
│   ├── Feature/              # Features section
│   ├── FAQSection/           # FAQ accordion
│   ├── Chat/                 # Chat interface components
│   ├── Stories/              # Stories page components
│   ├── ui/                   # shadcn/ui primitives
│   └── icons/                # SVG icon components
├── lib/
│   ├── supabase.ts           # Supabase client & fetch functions
│   ├── types.ts              # TypeScript types
│   ├── utils.ts              # Utility functions
│   └── data/stories.ts       # Seed stories (fallback)
└── config/site.ts            # Site metadata
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with Hero, Features, FAQ |
| `/chat` | AI peer support chat interface |
| `/stories` | Recovery stories from Supabase `posts` table |
| `/stories/[id]` | Individual story detail view |

## Supabase Integration

### Database Tables

**`posts`** - Stores supportive community posts
- `id` (UUID)
- `user_id` (TEXT)
- `content` (TEXT)
- `topic_tags` (TEXT[])
- `timestamp`, `created_at`

### Fetch Functions (`lib/supabase.ts`)

```typescript
// Fetch all stories from posts table
fetchMentorStories(): Promise<Story[]>

// Fetch single story by ID
fetchMentorStoryById(id: string): Promise<Story | null>

// Fetch stories filtered by themes
fetchStoriesByThemes(themes: string[]): Promise<Story[]>
```

### Post to Story Transformation

Posts from Supabase are transformed to Story format:
- **Title**: Generated from first sentence of content
- **Author**: `Anonymous XXXX` (last 4 digits of user_id)
- **Excerpt**: First 200 characters
- **Themes**: Mapped from `topic_tags`:
  - "Mental health history" -> "therapy"
  - "Views on women" -> "relationships"
  - "Dating history" -> "rejection"
  - "Friendship history" -> "loneliness"
  - etc.

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
| Supabase | @supabase/auth-helpers-nextjs |
| Motion | 12.0.5 |
| shadcn/ui | Latest |

## Component Patterns

Each section follows a consistent pattern:
- `index.tsx` - Main component
- `*Data.ts` - Configuration/content data
- Sub-components for composition

Example:
```
FAQSection/
├── index.tsx        # Main export
├── FAQData.ts       # FAQ content array
├── FAQHeader.tsx    # Section header
├── FAQList.tsx      # List container
└── FAQItem.tsx      # Individual item
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
