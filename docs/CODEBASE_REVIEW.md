# been there - Codebase Review & Pre-Submission Checklist

**Review Date**: December 1, 2025
**Submission Deadline**: December 5, 11:59pm (4 days remaining)
**Pitch Day**: December 11

---

## Executive Summary

**Overall Completion**: ~70% → **Target**: 95% by Dec 5

**Status**: Core features working, authentication solid, but critical integrations needed:
- ✅ **Frontend UI** - Landing, chat, stories, diary pages complete
- ✅ **Authentication** - Supabase Auth with anonymous sign-in working
- ⚠️ **Diary Feature** - UI complete but needs Supabase integration
- ⚠️ **Backend Matching** - Code ready but needs embeddings generated
- ❌ **Like/Favorite** - Not implemented (new feature)
- ❌ **Resources Page** - Not implemented (new feature)

---

## 60-Second Demo Flow Readiness

| Step | Feature | Status | Owner | Priority |
|------|---------|--------|-------|----------|
| 1 | User types issues/tags | ✅ READY | - | Complete |
| 2 | AI chat responds | ✅ READY | Backend/AI | Complete (OpenRouter) |
| 3 | Story matching | ⚠️ BACKEND NEEDED | Backend/AI | **HIGH** |
| 4 | Like/favorite stories | ❌ NOT IMPLEMENTED | Frontend C | **MEDIUM** |
| 5 | Diverse perspectives | ✅ READY | - | Complete (theme filtering) |
| 6 | Diary writing | ⚠️ INTEGRATION NEEDED | Frontend B | **HIGH** |
| 7 | Professional resources | ❌ NOT IMPLEMENTED | Frontend D | **MEDIUM** |

---

## Critical Bugs (Must Fix Before Demo)

### Bug 1: `seedStories` Undefined Variable ⚠️ **BLOCKER**

**Location**: [`frontend/app/stories/[id]/page.tsx:190`](../frontend/app/stories/[id]/page.tsx)

**Issue**: References undefined `seedStories` variable, causing crash in "More stories" section

**Impact**: Story detail page crashes when trying to show related stories

**Fix**: Change `seedStories` to `relatedStories` (already fetched on line 106)

**Owner**: Frontend Team Member A

**Estimated Time**: 5 minutes

```typescript
// Current (line 190):
const relatedStoriesData = seedStories.filter(...) // ❌ CRASHES

// Fix:
const relatedStoriesData = relatedStories.filter(...) // ✅ WORKS
```

---

### Bug 2: `alert()` Dialogs in Production ⚠️ **UX ISSUE**

**Locations**:
- `frontend/app/write/page.tsx` - Error handling
- `frontend/app/diary/page.tsx` - Delete confirmation

**Issue**: Using browser `alert()` which breaks user experience (especially mobile)

**Impact**: Poor UX, not production-ready

**Fix**: Replace with toast notifications (install `sonner` or `react-hot-toast`)

**Owner**: Frontend Team Member C

**Estimated Time**: 30 minutes

---

### Bug 3: console.log Statements in Code ⚠️ **CLEANUP**

**Locations**:
- `frontend/app/write/page.tsx:57`
- Various other files

**Issue**: Development logs left in production code

**Impact**: Console noise, unprofessional

**Fix**: Remove or convert to proper logging

**Owner**: Frontend Team Member A

**Estimated Time**: 15 minutes

---

## Incomplete Features (Prioritized by Demo Impact)

### Priority 1: Backend Semantic Matching 🔴 **CRITICAL FOR DEMO**

**Status**: Code complete, needs data setup

**What's Missing**:
1. Deploy database schemas to Supabase
2. Seed mentor posts from `data/seed/posts.json`
3. Run `backend/scripts/generate_embeddings.py` to create `mentor_embeddings.pkl`
4. Test `/api/match` endpoint returns ranked stories

**Impact**: Demo Step 3 won't work without this

**Owner**: Backend & AI Lead

**Files**:
- `backend/schema_profiles.sql` - Deploy to Supabase
- `backend/schema_posts.sql` - Deploy to Supabase
- `backend/schema_diary.sql` - Deploy to Supabase
- `data/seed/posts.json` - Upload to posts table
- `backend/scripts/generate_embeddings.py` - Run after seeding

**Estimated Time**: 1.5 hours
- 20 min: Deploy schemas
- 30 min: Seed posts data
- 20 min: Generate embeddings
- 20 min: Test matching API

---

### Priority 2: Diary Supabase Integration 🔴 **CRITICAL FOR DEMO**

**Status**: UI complete, backend mock data

**What's Missing**:
- Implement `saveDiaryEntry()` in `frontend/lib/supabase.ts`
- Implement `fetchUserDiaryEntries()` in `frontend/lib/supabase.ts`
- Implement `deleteDiaryEntry()` in `frontend/lib/supabase.ts`
- Replace mock data in Write page (`write/page.tsx:47`)
- Replace mock data in Diary page (`diary/page.tsx:49,89`)

**Impact**: Demo Step 6 won't persist data

**Owner**: Frontend Team Member B

**Files**:
- `frontend/lib/supabase.ts` - Add 3 new functions
- `frontend/app/write/page.tsx:47` - Replace mock setTimeout
- `frontend/app/diary/page.tsx:49` - Replace mock data fetch
- `frontend/app/diary/page.tsx:89` - Replace mock delete

**Reference**: See [`docs/DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) for SQL and function signatures

**Estimated Time**: 2 hours
- 45 min: Implement Supabase functions
- 45 min: Replace mock data in pages
- 30 min: Test and handle errors

---

### Priority 3: Like/Favorite System 🟡 **IMPORTANT FOR DEMO**

**Status**: Not implemented

**What's Needed**:
1. Create `user_favorites` table in Supabase (SQL provided below)
2. Implement `toggleFavorite()` function in `frontend/lib/supabase.ts`
3. Add heart icon to StoryCard component
4. Show favorite count and user's favorited state
5. Optimistic UI updates on click

**Impact**: Demo Step 4 - user interaction with content

**Owner**: Frontend Team Member C

**Database Schema**:
```sql
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Indexes
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_post_id ON user_favorites(post_id);

-- RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);
```

**Files**:
- Deploy SQL above to Supabase
- `frontend/components/Stories/StoryCard.tsx` - Add heart icon
- `frontend/lib/supabase.ts` - Add `toggleFavorite()`, `getUserFavorites()`, `getFavoriteCount()`

**Estimated Time**: 2 hours
- 30 min: Deploy schema
- 60 min: Implement frontend functions
- 30 min: UI integration and testing

---

### Priority 4: Professional Resources Page 🟡 **IMPORTANT FOR DEMO**

**Status**: Not implemented

**What's Needed**:
1. Create `frontend/app/resources/page.tsx`
2. Create `frontend/lib/data/resources.ts` with curated Australian resources
3. Add Resources link to navigation
4. Design cards/grid layout similar to stories page
5. Add category filtering (mental health, crisis, self-esteem, community)

**Impact**: Demo Step 7 - access to professional help

**Owner**: Frontend Team Member D

**Suggested Resources** (Australian focus):
- **Crisis Support**: Lifeline (13 11 14), Beyond Blue (1300 22 4636)
- **Men's Support**: MensLine Australia (1300 78 99 78)
- **Youth Mental Health**: Headspace, ReachOut
- **Peer Support Forums**: r/IncelExit, r/MensLib
- **Self-Esteem Resources**: CBT worksheets, therapy finder tools

**Files**:
- `frontend/app/resources/page.tsx` - CREATE
- `frontend/lib/data/resources.ts` - CREATE
- `frontend/components/Header/NavigationData.ts` - ADD /resources route

**Estimated Time**: 3 hours
- 60 min: Create page structure
- 90 min: Curate and add resource content
- 30 min: Add navigation and test

---

### Priority 5: Navigation Menu Updates 🟢 **POLISH**

**Status**: Missing authenticated routes

**What's Missing**:
- Add `/chat`, `/diary`, `/write`, `/resources` to navigation
- Show authenticated routes only when logged in
- Update mobile nav to include new routes

**Impact**: Users can't discover all features

**Owner**: Frontend Team Member C

**Files**:
- `frontend/components/Header/NavigationData.ts`

**Estimated Time**: 30 minutes

---

## Code Quality Issues (Non-Blocking)

### TypeScript Type Inconsistencies

**Issue**: Story type in `lib/types.ts` missing `theme` field used in components

**Impact**: Minor - doesn't break functionality but TypeScript may warn

**Owner**: Any team member

**Priority**: Low

**Estimated Time**: 10 minutes

---

### Missing Error Boundaries

**Issue**: No React error boundaries to catch component crashes gracefully

**Impact**: If a component crashes, whole app goes down

**Priority**: Low (post-hackathon)

**Estimated Time**: 30 minutes

---

## Testing Checklist

### Pre-Demo Testing (Do Before Dec 5)

#### Authentication Flow
- [ ] User can sign up with email/password
- [ ] User can log in
- [ ] Anonymous sign-in works
- [ ] Anonymous user prompted to convert account
- [ ] Protected routes redirect to `/login` when not authenticated
- [ ] User can sign out

#### Chat Feature
- [ ] Chat interface loads
- [ ] User can send messages
- [ ] AI responds (OpenRouter API or fallback)
- [ ] Typing indicator shows during response
- [ ] Auto-scroll works

#### Stories Feature
- [ ] Stories page loads with data from Supabase
- [ ] Theme filtering works (loneliness, relationships, self-esteem, etc.)
- [ ] Story cards display correctly
- [ ] Story detail page loads
- [ ] Related stories section works (fix seedStories bug first!)

#### Diary Feature (After Supabase Integration)
- [ ] User can create new diary entry at `/write`
- [ ] Entry saves to Supabase
- [ ] Diary page shows user's entries
- [ ] Mood filtering works
- [ ] User can delete own entries
- [ ] User CANNOT see other users' entries (RLS working)

#### Like/Favorite Feature (If Implemented)
- [ ] Heart icon shows on story cards
- [ ] Clicking heart toggles favorite state
- [ ] Favorite count updates
- [ ] User's favorites persist across sessions

#### Resources Page (If Implemented)
- [ ] Page loads with curated resources
- [ ] Category filtering works
- [ ] External links open correctly
- [ ] Mobile responsive

---

## Environment Variables Checklist

### Frontend (`.env.local`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] Test with missing vars (graceful degradation?)

### Backend (`.env`)
- [ ] `SUPABASE_URL` configured
- [ ] `SUPABASE_SERVICE_KEY` configured (NOT anon key!)
- [ ] `OPENROUTER_API_KEY` configured
- [ ] Test `/api/health` endpoint

---

## Deployment Readiness

### Database Setup
- [ ] All schemas deployed to Supabase
- [ ] RLS policies enabled on all tables
- [ ] Profiles table auto-creates on signup (test trigger)
- [ ] Posts table seeded with mentor stories
- [ ] Diary entries table ready
- [ ] User favorites table created (if implementing feature)

### Frontend
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console.log statements
- [ ] No alert() dialogs
- [ ] Environment variables documented

### Backend
- [ ] Embeddings file generated
- [ ] All API endpoints tested
- [ ] OpenRouter API key working
- [ ] Error responses documented

---

## Team Task Summary

### Backend & AI Lead (You)
**Priority**: Critical path items
- [ ] Deploy all database schemas to Supabase (20 min)
- [ ] Seed posts data from `data/seed/posts.json` (30 min)
- [ ] Generate embeddings (`mentor_embeddings.pkl`) (20 min)
- [ ] Test `/api/match` endpoint (15 min)
- [ ] Integrate chat → matching flow (45 min)
- [ ] Test demo path end-to-end (30 min)

**Total Time**: ~2.5 hours

---

### Frontend Team Member A (Bug Fixes)
**Priority**: Critical bugs
- [ ] Fix `seedStories` crash (5 min)
- [ ] Remove console.log statements (15 min)
- [ ] Test story detail pages (10 min)

**Total Time**: 30 minutes

---

### Frontend Team Member B (Diary Integration)
**Priority**: Critical feature completion
- [ ] Implement Supabase diary CRUD in `lib/supabase.ts` (45 min)
- [ ] Replace mock data in `/write` page (30 min)
- [ ] Replace mock data in `/diary` page (45 min)
- [ ] Test diary flow end-to-end (30 min)

**Total Time**: 2.5 hours

---

### Frontend Team Member C (UX & Interactions)
**Priority**: User experience improvements
- [ ] Install `sonner` toast library (5 min)
- [ ] Replace alert() with toasts in write/diary pages (30 min)
- [ ] Implement Like/Favorite system (2 hours)
- [ ] Update navigation menu (30 min)

**Total Time**: 3 hours

---

### Frontend Team Member D (Resources Page)
**Priority**: New feature for demo step 7
- [ ] Create `/resources` page structure (60 min)
- [ ] Curate Australian mental health resources (90 min)
- [ ] Add to navigation (15 min)
- [ ] Test on mobile (15 min)

**Total Time**: 3 hours

---

## Implementation Timeline

### Day 1 (Dec 1 - Today) - Critical Path
**Focus**: Backend setup + critical bug fixes

**Backend**:
- Deploy schemas (20 min)
- Seed data (30 min)
- Generate embeddings (20 min)

**Frontend**:
- Fix seedStories bug (5 min)
- Start diary integration (90 min)
- Create resources page structure (60 min)

---

### Day 2 (Dec 2) - Feature Completion
**Focus**: Complete all integrations

**Backend**:
- Integrate chat → matching
- Test end-to-end

**Frontend**:
- Complete diary Supabase integration
- Add like/favorite system (with schema)
- Populate resources content
- Update navigation

---

### Day 3 (Dec 3) - Polish & Testing
**Focus**: Code quality and testing

**Everyone**:
- Replace alert() with toasts
- Remove console.logs
- Test full demo flow (all 7 steps)
- Fix any bugs discovered
- Update documentation

---

### Day 4 (Dec 4) - Rehearsal
**Focus**: Demo preparation

- End-to-end demo testing
- Fix any last issues
- Pitch rehearsal with live demo
- Final documentation review

---

### Day 5 (Dec 5) - Submission Day
**Focus**: Final review and submit

- Final code review
- **Submit before 11:59pm** ⏰
- Prepare for Dec 11 pitch

---

## Post-Hackathon Improvements

*Mark these as "Future Enhancements" - NOT required for Dec 5 submission*

### Code Quality
- [ ] Add React error boundaries
- [ ] Implement retry logic for failed API calls
- [ ] Improve form validation
- [ ] Add loading skeleton screens

### Features
- [ ] Mood tracking analytics and visualizations
- [ ] User profile editing
- [ ] Story submission form (let users create posts)
- [ ] Comments/replies on stories
- [ ] Notification system

### AI/ML
- [ ] Train content moderator model (on `competition_train.jsonl`)
- [ ] Improve semantic matching with fine-tuning
- [ ] Add crisis detection alerts

### Infrastructure
- [ ] Analytics/tracking integration
- [ ] Accessibility audit (ARIA, keyboard nav)
- [ ] Performance optimization
- [ ] Mobile app (React Native)

---

## Success Criteria

### Demo Must Work (All 7 Steps)
1. ✅ User types issues → Chat input working
2. ✅ AI responds → OpenRouter integration working
3. ✅ Matching shows stories → Embeddings generated, API working
4. ✅ Like/favorite → New feature implemented
5. ✅ Diverse perspectives → Theme filtering working
6. ✅ Diary saves → Supabase integration complete
7. ✅ Resources accessible → Page created and linked

### Code Quality Standards
- ✅ No crashes or undefined variables
- ✅ No alert() dialogs (toasts instead)
- ✅ No console.log in production
- ✅ TypeScript types consistent
- ✅ Build passes without errors

### Documentation Complete
- ✅ README reflects current state
- ✅ All docs in `/docs` directory
- ✅ CODEBASE_REVIEW provides task list
- ✅ Demo flow documented

---

## Notes

- **Source of Truth**: [`HACKATHON_CONTEXT.md`](HACKATHON_CONTEXT.md)
- **Priority**: Demo flow > edge cases
- **Timeline**: 4 days to submission
- **Team Size**: 5 members (coordinate to avoid conflicts)
- **Your Focus**: Backend & AI (matching system is critical!)

---

*Last Updated: December 1, 2025 - 10:30 PM*
*Next Review: December 3, 2025 (Pre-submission check)*
