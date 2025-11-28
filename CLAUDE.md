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

> **Update this section as work progresses**

- [ ] Problem statement defined
- [ ] Tech stack decided
- [ ] Architecture designed
- [ ] MVP built
- [ ] Demo ready
- [ ] Pitch recorded

**Current Focus:** [Update with current sprint goal]

## Tech Stack

> **Update once decided**

- **Frontend:** TBD (likely React/Next.js or simple HTML/Tailwind)
- **Backend:** TBD (likely Python FastAPI or Node)
- **AI/ML:** Claude API, possibly Perspective API, sentence-transformers
- **Database:** TBD if needed
- **Deployment:** TBD

## Project Structure

```
esafety-hackathon/
├── CLAUDE.md          # This file - project context
├── docs/              # Documentation and context files
├── src/               # Source code
│   ├── classifiers/   # Classification logic
│   ├── utils/         # Utility functions
│   └── features/      # Feature extraction
├── notebooks/         # Jupyter notebooks for exploration
├── scripts/           # Standalone scripts
├── data/              # Data files (gitignored)
└── frontend/          # Frontend code (if separate)
```

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

```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

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

2. **Demo-first** — The goal is a compelling demo for judges. Focus on the happy path.

3. **Classification is core** — Most tasks will relate to text classification or presenting classification results.

4. **Check existing code** — Before creating new utilities, check if something similar exists in `src/utils/` or `src/classifiers/`.

5. **Keep it simple** — We have ~48 hours of hacking plus a few days to polish. Don't over-engineer.
