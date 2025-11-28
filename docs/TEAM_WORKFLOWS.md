# Team Workflows

## Team Composition & Roles

| Role | Focus Areas | AI Tools |
|------|-------------|----------|
| **Tech Lead / AI Integration** | Architecture, classification pipeline, AI integration | Claude Code |
| **Backend Engineer** | API design, data processing, database | TBD |
| **Frontend / Design** | UI/UX, CSS, visual polish | TBD |
| **Business Analyst** | Problem framing, user research, pitch narrative | TBD |
| **Developer** | Supporting tasks, testing, documentation | TBD |

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

While Tech Lead works on classification:
- **Frontend** can build UI with mock data
- **Backend** can set up project structure, API skeleton
- **BA** can interview mentors, draft pitch
- **Developer** can help with testing, documentation

Define interface contracts early so work can happen in parallel.

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

Define API contracts early:

```typescript
// Example: Classification endpoint
POST /api/classify
Request:  { text: string }
Response: { category: string, confidence: number, indicators: string[] }

// Example: Batch classification
POST /api/classify/batch
Request:  { texts: string[] }
Response: { results: Array<{ text: string, category: string, confidence: number }> }
```

### Shared Types/Models

If using TypeScript frontend + Python backend, define equivalent types:

```python
# Python (backend)
class ClassificationResult(BaseModel):
    category: str
    confidence: float
    indicators: list[str]
```

```typescript
// TypeScript (frontend)
interface ClassificationResult {
  category: string;
  confidence: number;
  indicators: string[];
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
