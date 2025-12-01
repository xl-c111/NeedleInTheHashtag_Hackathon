# Team Workflows

## Team Composition & Roles

| Role | Focus Areas | AI Tools |
|------|-------------|----------|
| **Tech Lead / AI Integration** | Backend API, AI matching algorithm, classification, integration | Claude Code |
| **Backend Engineer** | Database design, schema, data models | TBD |
| **Frontend / Design** | Loveable skeleton generation, hand-drawn assets (owl/scroll theme) | Loveable |
| **Business Analyst** | Mentor post curation, pitch narrative, user research | TBD |
| **Developer** | Testing, integration support, documentation | TBD |

---

## Communication

### Recommended Setup
- **Slack/Discord channel** — Quick questions, updates
- **Notion** — Documentation, planning, task tracking
- **GitHub** — Code collaboration

### Daily Standups (During Hackathon)
Quick sync at key moments:
- **Morning** (10:30am) — What's the plan for today?
- **After lunch** (1:30pm) — Progress check, blockers?
- **Evening** (7:30pm) — What's done? What's carrying over?

---

## Git Workflow

### Branch Strategy (Simple)
```
main
├── feature/classification
├── feature/frontend
├── feature/api
└── fix/whatever
```

### Commit Often
- Commit working code frequently
- Use descriptive commit messages
- Push to remote to share progress

### Merge Process
1. Create feature branch
2. Do work
3. Push and create PR (or just merge if moving fast)
4. Quick review if time permits
5. Merge to main

**Hackathon reality:** Don't over-engineer the git process. Speed > process purity.

---

## Working with Claude Code

### For the Tech Lead (Primary Claude Code User)

1. **Start each session by updating CLAUDE.md**
   - Current status
   - Current focus
   - Any blockers

2. **Use clear task framing**
   ```
   Good: "Create a FastAPI endpoint at /classify that accepts POST with JSON 
         body {text: string}, calls our classifier, and returns {category, confidence}"
   
   Bad: "Make the API work"
   ```

3. **Let Claude Code read context first**
   ```
   "Read src/classifiers/api_classifiers.py, then help me add a new method 
   for batch classification"
   ```

4. **Checkpoint with git**
   - Before major changes: `git add . && git commit -m "checkpoint before X"`
   - After working features: `git commit -m "feat: add X"`

### Parallel Workstreams

Work happens in parallel on different components:
- **Tech Lead** builds AI matching endpoint + integrates with frontend
- **Frontend/Design** generates Loveable skeleton + creates hand-drawn assets
- **Backend Engineer** designs database schema
- **BA** curates mentor posts from r/IncelExit + writes pitch
- **Developer** helps with testing, integration, documentation

Define interface contracts early (see `docs/API_CONTRACT.md`) so work can happen in parallel.

---

## Loveable Integration Workflow

### Step 1: Generate Frontend Skeleton in Loveable
**Owner:** Frontend/Design team

1. Use Loveable AI to generate initial UI structure
2. Specify requirements:
   - 7-step user journey (describe struggle → match → interact → diary → resources)
   - Owl delivering messages theme
   - Hand-written scrolls/parchments aesthetic
   - Quill/pen imagery
   - Beach or Space background themes
   - Mobile-responsive
3. Iterate in Loveable until layout feels right
4. Export code from Loveable

### Step 2: Export and Share
**Owner:** Frontend/Design team

1. Export Loveable project code
2. Share with team via GitHub or zip file
3. Document any Loveable-specific dependencies or quirks
4. Provide screenshots/walkthrough of intended user flow

### Step 3: Replace Loveable Assets with Hand-Drawn
**Owner:** Frontend/Design team

1. Identify all visual assets in Loveable export
2. Create hand-drawn versions:
   - Owl character delivering messages
   - Scroll/parchment backgrounds
   - Quill pen imagery
   - UI elements in hand-drawn style
3. Replace Loveable defaults with custom assets
4. Ensure visual consistency across all screens

### Step 4: Tech Lead Creates Matching API Endpoints
**Owner:** Tech Lead (using Claude Code)

1. Read Loveable frontend code to understand data requirements
2. Implement `/api/match` endpoint (see `docs/API_CONTRACT.md`)
3. Use existing utilities:
   - `src/classifiers/api_classifiers.py` for embeddings
   - `src/utils/text_utils.py` for text cleaning
4. Curate 10-20 sample mentor posts for demo
5. Pre-compute embeddings for mentor posts
6. Test endpoint with sample queries

### Step 5: Integration Testing
**Owner:** All team members

1. Connect Loveable frontend to backend API
2. Update API base URL in frontend config
3. Test each step of 7-step user journey:
   - User input → backend receives it ✓
   - Backend returns matched posts ✓
   - Frontend displays posts correctly ✓
   - Interactions (save, navigate) work ✓
   - Diary/resources pages render ✓
4. Fix integration issues
5. Rehearse demo flow

### Step 6: Polish and Prepare Demo
**Owner:** All team members

1. **Frontend/Design:** Final visual polish, animations, transitions
2. **Tech Lead:** Optimize API response times, add error handling
3. **Backend Engineer:** Integrate database (if ready) or finalize mock data
4. **BA:** Prepare demo script, practice narration
5. **Developer:** Test on different browsers/devices, document known issues

---

---

## Task Handoff

### When Handing Off Work
1. Commit and push your code
2. Update the Notion task with notes
3. Slack/tell the person what's done, what's remaining

### When Receiving Work
1. Pull latest from main
2. Read the relevant code
3. Check Notion for context
4. Ask questions if unclear

---

## Decision Log

Track key decisions to avoid re-litigating:

| Decision | Chosen Option | Why | Date |
|----------|---------------|-----|------|
| *Example: Tech stack* | *FastAPI + React* | *Team familiarity, speed* | *Nov 29* |
| | | | |
| | | | |

---

## Integration Points

### Frontend ↔ Backend Contract

**Source of truth:** `docs/API_CONTRACT.md`

Key endpoints for peer-support platform:

```typescript
// Story matching endpoint (PRIMARY for demo)
POST /api/match
Request:  { user_message: string, context?: string[], limit?: number }
Response: {
  matched_posts: Array<{...}>,
  themes_detected: string[],
  suggested_resources: Array<{...}>
}

// Classification endpoints (for moderation - existing)
POST /api/classify
Request:  { text: string }
Response: { category: string, confidence: number, indicators: string[] }
```

### Loveable Export → Backend Integration

1. **Frontend generates API calls** - Loveable exports fetch/axios calls
2. **Backend implements matching contract** - See `docs/API_CONTRACT.md` for request/response shapes
3. **Environment configuration** - Frontend uses `API_BASE_URL` env var
4. **CORS setup** - Backend allows `localhost:3000` or Loveable dev server

### Database Schema (Awaiting Design)

**Owner:** Backend Engineer

Required tables/collections:
- Users (anonymous profiles, preferences)
- Mentor Posts (content, embeddings, themes, engagement)
- Diary Entries (user_id, content, mood, timestamp, private flag)
- Interactions (user_id, post_id, type: save/helpful, timestamp)
- Mood Tracking (user_id, mood, note, timestamp)
- Resources (type, title, url, themes, description)

**Integration:** Once schema is ready, Tech Lead will migrate from in-memory/JSON to database queries.

### Shared Types/Models

Define equivalent types across stack:

```python
# Python (backend/models.py)
class MatchedPost(BaseModel):
    post_id: str
    author_persona: str
    content: str
    relevance_score: float
    themes: list[str]
    created_at: datetime
```

```typescript
// TypeScript (frontend/types.ts)
interface MatchedPost {
  post_id: string;
  author_persona: string;
  content: string;
  relevance_score: number;
  themes: string[];
  created_at: string;  // ISO datetime
}
```

---

## Demo Day Checklist

Before the final demo:

- [ ] Backend API running and stable
- [ ] Frontend connected to real API (not mocks)
- [ ] Sample data prepared for demo
- [ ] Error handling for edge cases
- [ ] Demo script written and practiced
- [ ] Screen recording done
- [ ] Backup plan if live demo fails

---

## Troubleshooting

### "I'm blocked"
1. Post in team chat immediately
2. Describe what you're trying to do
3. Describe what's not working
4. Share relevant code/errors
5. Tag someone who might help

### "I don't know what to work on"
1. Check Notion task board
2. Ask in team chat
3. Look for "To Do" items in your category
4. Help test someone else's work

### "Git is messed up"
```bash
# Nuclear option (save your work first!)
git stash
git checkout main
git pull
git checkout -b fresh-branch
git stash pop
```

### "API key not working"
1. Check `.env` file exists and has the key
2. Check key is not expired
3. Check rate limits
4. Try the key in a simple curl/test script

---

## End of Day Checklist

Before leaving each day:

- [ ] Commit and push all work
- [ ] Update Notion task statuses
- [ ] Note any blockers for tomorrow
- [ ] Quick team sync on progress
- [ ] Charge laptops!
