# Frontend

Next.js + Tailwind CSS frontend for the eSafety Hackathon.

## Quick Start

```bash
# From the frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000

## Development Modes

### Mock Mode (No Backend Required)

By default, the frontend uses mock data. Great for frontend-only development.

In `src/lib/api.ts`:
```typescript
const USE_MOCK = true  // Uses mock data
```

### Real Backend Mode

When the backend is running, switch to real API:

In `src/lib/api.ts`:
```typescript
const USE_MOCK = false  // Uses real backend
```

Make sure the backend is running at http://localhost:8000

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── layout.tsx       # Root layout (header, footer)
│   │   ├── page.tsx         # Home page
│   │   ├── analyze/         # Analysis page (TODO)
│   │   └── dashboard/       # Dashboard page (TODO)
│   ├── components/          # Reusable components
│   │   ├── CategoryBadge.tsx
│   │   ├── ConfidenceBar.tsx
│   │   └── RiskBadge.tsx
│   └── lib/
│       └── api.ts           # API client
├── tailwind.config.js
└── package.json
```

## Key Files

- **src/app/page.tsx** — Main home page with text analysis
- **src/lib/api.ts** — API client (toggle mock mode here)
- **src/components/** — Reusable UI components

## Available Components

### CategoryBadge
Displays category with color coding.
```tsx
<CategoryBadge category="linkedin_lunatic" size="md" />
```

### ConfidenceBar
Visual confidence meter.
```tsx
<ConfidenceBar confidence={0.85} showLabel={true} />
```

### RiskBadge
Risk level indicator with icon.
```tsx
<RiskBadge level="high" showIcon={true} />
```

## Styling

Using Tailwind CSS. Custom utility classes in `globals.css`:
- `.btn-primary` — Primary button
- `.btn-secondary` — Secondary button
- `.card` — Card container
- `.input` — Form input
- `.badge` — Small badge

Custom colors in `tailwind.config.js`:
- `safety-*` — Green shades for safe content
- `danger-*` — Red shades for concerning content

## Pages to Build

- [ ] `/analyze` — Bulk analysis page
- [ ] `/dashboard` — Statistics dashboard
- [ ] `/user/[id]` — User profile analysis

## Environment Variables

Create `.env.local` if needed:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
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
