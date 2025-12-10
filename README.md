# been there

> **Peer support platform connecting people to authentic recovery stories**
> Real human experiences, not AI therapy.

🌐 **Live Demo:** https://needleinthehashtaghackathon.vercel.app

---

## Overview

**been there** uses AI-powered semantic matching to connect people struggling with difficult issues to authentic mentor stories from those who have overcome similar challenges. Built to combat online radicalization and toxic echo chambers by providing diverse, compassionate peer perspectives.

**Key Features:**
- AI chat interface to help articulate feelings
- Semantic matching to relevant mentor stories
- Private journaling for personal reflection
- Anonymous, stigma-free environment
- Curated professional resources

**Built for:** eSafety Hackathon - "Needle in the Hashtag" (Nov 2025)

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

The app connects to production services by default. For local backend development, see [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md).

## Tech Stack & Architecture

**Frontend (Vercel):** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
**Backend (HF Space):** FastAPI, sentence-transformers, scikit-learn
**Database:** Supabase (PostgreSQL + Row-Level Security)
**AI Services:** OpenRouter API (Gemini 2.0 Flash)

```
frontend/          # Next.js app (Vercel)
├── app/           # Pages & API routes
├── components/    # React components
└── lib/           # Supabase client, utilities

huggingface-space/ # Semantic matching API (HF Space)
└── app.py         # FastAPI + embeddings

backend/           # Development scripts
└── services/      # AI services, data processing
```

## Features

**Core Functionality:**
- AI chat interface for compassionate listening
- Semantic matching to relevant mentor stories
- Story browsing with theme-based filtering
- Private journaling for reflection
- Authentication (email/password + anonymous)
- Dark mode support
- Fully responsive design

**In Development:**
- Enhanced semantic matching with embeddings
- Full diary integration with Supabase
- Like/favorite functionality
- Professional resources directory

## Environment Setup

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Backend** (`backend/.env`):
```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-key
```

## Documentation

- **[Deployment Architecture](DEPLOYMENT_ARCHITECTURE.md)** - System architecture and deployment guide
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Supabase tables and RLS policies
- **[Development Guide](docs/DEVELOPMENT.md)** - Component patterns and setup

See [`docs/`](docs/) for complete documentation.

## Crisis Support

**Australia:**
- Lifeline: 13 11 14 (24/7)
- Beyond Blue: 1300 22 4636
- MensLine Australia: 1300 78 99 78
- Emergency: 000

**International:** [findahelpline.com](https://findahelpline.com)

---

## Contributing

Built during the eSafety Hackathon (Nov 29-30, 2025). Contributions welcome!

## License

MIT License - Built for the eSafety Hackathon
**Theme:** 16 Days of Activism Against Gender-Based Violence
