# CLAUDE.md - Project Context for Claude Code

> This file provides context for Claude Code. Update it as the project evolves.

## Project Overview

**Event:** eSafety Hackathon - "Needle in the Hashtag"
**Theme:** 16 Days of Activism Against Gender-Based Violence
**Dates:** Nov 29-30, 2025 (Stone & Chalk, Melbourne)
**Submission Deadline:** Friday Dec 5, 11:59pm
**Pitch Day:** Thursday Dec 11

## The Challenges

### Mini-Challenge: Persona Classification
Classify AI personas from millions of messages on a fake social media platform:
- Body dysmorphia indicators
- Incel language patterns
- LinkedIn Lunatic posting style
- Other behavioral patterns

### Grand Challenge: eSafety Solution Demo
Design and build a demo addressing online safety issues. Interview mentors and researchers to understand problems deeply, then pitch your solution.

## Team

5 members with complementary skills:
- Tech Lead / AI Integration (Physics/Data Science/SWE background) — uses Claude Code
- Backend Engineer
- Frontend / Design specialist
- Business Analyst (pitch narrative, user research)
- Developer (CS student)

## Current Status

> **Last Updated:** Nov 30, 2025

- [x] Problem statement defined - Online radicalization & echo chambers → gender-based violence
- [x] Solution decided - Peer-support platform with AI-powered story matching
- [x] Tech stack decided - Loveable frontend + FastAPI backend + AI matching
- [x] Architecture designed - See docs/SOLUTION_CONCEPT.md
- [ ] Frontend skeleton from Loveable - In progress
- [ ] AI matching endpoint implemented - Pending
- [ ] Mentor post curation - Pending
- [ ] Demo ready - Target: Dec 4
- [ ] Pitch recorded - Target: Dec 5

**Current Focus:** Implementing peer-support platform (Grand Challenge)
- Frontend team generating skeleton in Loveable
- Tech Lead designing AI matching algorithm
- Database teammate working on schema
- All teams aligned on 7-step user journey

## Tech Stack

- **Frontend:** Loveable (skeleton generation) → Hand-drawn assets (owl/scroll/parchment theme)
  - Design: Owl delivering messages, hand-written scrolls/parchments, quills
  - Themes: Beach and Space backgrounds (MVP has 2 options)
  - Inspiration: "Kind Words" game aesthetic
  - Previous Next.js code available for reference
- **Backend:** FastAPI (Python) - existing infrastructure
- **AI/ML:**
  - Sentence-transformers (`all-MiniLM-L6-v2`) for story matching
  - Claude API for conversational AI (optional)
  - Perspective API for content moderation
  - Existing classification utilities repurposed
- **Database:** TBD by teammate (user profiles, mentor posts, diary, interactions, mood)
- **Deployment:** Localhost for demo, consider Vercel/Railway for post-hackathon

## Project Structure

```
esafety-hackathon/
├── CLAUDE.md              # This file - project context
├── docs/                  # Documentation
│   ├── API_CONTRACT.md    # Frontend ↔ Backend interface
│   ├── HACKATHON_CONTEXT.md
│   ├── TECHNICAL_APPROACHES.md
│   ├── PITCH_GUIDE.md
│   └── TEAM_WORKFLOWS.md
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # Reusable components
│   │   └── lib/           # API client, utilities
│   └── package.json
├── backend/               # FastAPI backend
│   ├── main.py            # API routes
│   ├── services/          # Business logic
│   └── requirements.txt
├── src/                   # Shared Python utilities
│   ├── classifiers/       # Classification logic
│   └── utils/             # Text processing
├── notebooks/             # Jupyter notebooks
├── scripts/               # CLI scripts
└── data/                  # Data files (gitignored)
```

## Solution Overview

**Motto:** "Bringing a village to your screen"

### The Problem
Online echo chambers (particularly incel communities) are radicalizing young people, increasing misogyny, and correlating with higher rates of gender-based violence. Current approaches (deplatforming) don't address root causes.

### Our Solution
A peer-support platform that connects people struggling with difficult issues (loneliness, relationships, self-esteem) to **real stories from mentors with lived experiences** who have overcome similar challenges.

### Key Innovation
**AI for matching, not therapy.** We use AI to connect users to authentic human stories, not to generate advice. This breaks echo chambers through:
1. Semantic matching (embeddings) to find relevant mentor posts
2. Multi-perspective content (different genders, backgrounds)
3. Professional resources + personal journaling
4. Wholesome interactions (inspired by "Kind Words" game)

### 7-Step Demo Flow
1. User describes their struggle (e.g., loneliness)
2. AI chat helps articulate issues (doesn't give advice)
3. Matched to relevant mentor posts via semantic similarity
4. Favorite/save posts that resonate
5. View perspectives from other genders/backgrounds
6. Write in private diary for self-reflection
7. Access curated resources (mental health services, articles)

### Core Features
- **AI Conversation Matcher** - Understands user issues, finds relevant stories
- **Mentor Post Feed** - Real stories from r/IncelExit and similar communities
- **Personal Diary** - Private reflection and progress tracking
- **Multi-Perspective Content** - Break echo chambers with diverse voices
- **Resources Hub** - Professional help, crisis support, educational content
- **Wholesome Interactions** - Positive engagement, no toxic comments
- **Mood Tracking** - Self-reported emotional state over time

### Why This Matters
Prevention through de-radicalization reduces the risk of gender-based violence by addressing root causes (isolation, harmful beliefs) before they become entrenched.

**For more details, see:** `docs/SOLUTION_CONCEPT.md`

---

## Coding Conventions

- **Python:** Use type hints, docstrings, f-strings
- **Naming:** snake_case for Python, camelCase for JS/TS
- **Error handling:** Always handle API failures gracefully
- **Comments:** Explain *why*, not *what*

## Key Files to Know

- `src/classifiers/api_classifiers.py` — Wrappers for Perspective API, LLM classification, embeddings
- `src/utils/text_utils.py` — Text cleaning, feature extraction, pattern detection
- `scripts/classify_messages.py` — CLI script for batch classification
- `notebooks/02_classification.ipynb` — Classification approach examples

## API Keys & Secrets

Store in `.env` file (gitignored). Copy from `.env.example`:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`  
- `GOOGLE_API_KEY` (for Perspective API)

## Quick Commands

### Windows Setup
```bash
# Setup (first time)
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env

# Activate venv (every new terminal session)
venv\Scripts\activate

# Run classification script
python scripts/classify_messages.py input.csv output.csv --text-column text

# Start Jupyter
jupyter notebook
```

### macOS/Linux Setup
```bash
# Setup (first time)
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Activate venv (every new terminal session)
source venv/bin/activate

# Run classification script
python scripts/classify_messages.py input.csv output.csv --text-column text

# Start Jupyter
jupyter notebook
```

## Current Problems / Blockers

> **Update when stuck**

None yet.

## Links

- **Notion:** [Add link to Notion workspace]
- **GitHub:** [Add repo link]
- **Hackathon Info:** Stone & Chalk, Melbourne

---

## Notes for Claude Code

When working on this project:

1. **Hackathon context** — Speed matters. Prefer working solutions over perfect code. We can refactor later.

2. **Demo-first** — The goal is a compelling demo for judges. Focus on the happy path (7-step user journey).

3. **AI for matching, not therapy** — Most tasks relate to:
   - Matching user messages to mentor posts (semantic similarity)
   - Content moderation (existing classification infrastructure)
   - Theme detection (to recommend resources)
   - **NOT** generating AI advice or therapy

4. **Check existing code** — Before creating new utilities, check if something similar exists in:
   - `src/utils/text_utils.py` - Text cleaning, feature extraction
   - `src/classifiers/api_classifiers.py` - Embeddings, LLM classification, Perspective API
   - `backend/services/classifier.py` - Pattern-based classification

5. **Keep it simple** — We have ~48 hours of hacking plus a few days to polish. Don't over-engineer.

6. **Database TBD** — Another teammate is designing the database schema. Use in-memory/JSON storage for MVP if needed before database is ready.

7. **Frontend theme** — Owl delivering messages, hand-written scrolls/parchments, quills. Wholesome and warm aesthetic.

## Parallel Workstreams

The team works in parallel on different areas:

| Area | Owner | Directory |
|------|-------|-----------|
| Backend API + AI Matching | Tech Lead (uses Claude Code) | `backend/`, `src/` |
| Frontend UI (Loveable + Assets) | Frontend/Design | Loveable → Export |
| Database Design | Backend Engineer | Database schema (TBD) |
| Pitch/Content Curation | Business Analyst | `docs/`, mentor post curation |
| Testing/Support | Developer (CS student) | Cross-functional |

**Integration points:**
- `docs/API_CONTRACT.md` - Frontend ↔ Backend interface
- `docs/SOLUTION_CONCEPT.md` - Team alignment on vision
- Database schema (awaiting design from teammate)

### Quick Commands

**Frontend:**
```bash
cd frontend && npm install && npm run dev
# Runs at http://localhost:3000
# Uses mock data by default (no backend needed)
```

**Backend:**
```bash
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
# Runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```

**Connect frontend to backend:**
In `frontend/src/lib/api.ts`, set `USE_MOCK = false`
