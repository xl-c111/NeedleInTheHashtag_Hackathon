# Product Design - Been There

> **Project:** Peer-Support Platform for Young Men
> **Hackathon:** eSafety - "Needle in the Hashtag"
> **Theme:** 16 Days of Activism Against Gender-Based Violence

---

## Table of Contents

1. [Vision & Problem](#vision--problem)
2. [Solution Overview](#solution-overview)
3. [User Journey](#user-journey)
4. [Core Features](#core-features)
5. [Architecture & AI Components](#architecture--ai-components)
6. [Design Principles](#design-principles)
7. [User Personas](#user-personas)
8. [Content Strategy](#content-strategy)

---

## Vision & Problem

### The Problem

**Online radicalization and echo chambers increase misogyny and correlate with gender-based violence**

- Vulnerable young men (especially struggling with loneliness, relationships, self-esteem) find online communities that start as support groups but become toxic echo chambers
- These spaces reinforce harmful beliefs about women, relationships, and self-worth
- Research links misogynistic views to higher rates of domestic violence and gender-based violence
- Current approaches (deplatforming, bans) don't address root causes and can worsen isolation
- Young people lack access to authentic stories from those who've overcome similar struggles

### Our Solution

**Been There: A peer-support platform that connects people to real human stories, not AI therapy**

We match users struggling with difficult issues to authentic mentor posts from people who have overcome similar challenges. AI is used for **matching only**, not for generating content. The authenticity of real human experiences is our core value proposition.

**Key Insight:** People trust and learn from those with lived experience. One authentic story from someone who's "been there" is worth more than 100 AI-generated responses.

---

## Solution Overview

### What Makes Been There Different

| Traditional Approach | Been There Approach |
|---------------------|------------------|
| AI chatbots generate responses | Real human stories from reformed community members |
| Generic mental health advice | Lived experience from people who've been there |
| Deplatforming pushes people away | Proactive intervention connects people to support |
| One-size-fits-all content | AI-powered semantic matching to relevant stories |
| Privacy concerns with data | Anonymous profiles, stigma-free environment |
| Expensive 1:1 therapy | Scalable peer support (one story helps thousands) |

### Core Value Propositions

**For Seekers (users struggling):**
- Find authentic stories from people who truly understand your struggles
- Anonymous, stigma-free way to explore perspectives
- Discover you're not alone and change is possible
- Private reflection space (diary) to track your journey
- Access to professional resources when ready

**For Mentors (recovered community members):**
- Your story helps prevent others from going down the same path
- Share your journey anonymously without judgment
- Make a real impact at scale (one post helps many)
- Join a wholesome community focused on growth and healing

---

## User Journey

### Primary Journey: Seeker Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. LANDING PAGE                                                  │
│    User arrives → Understands value prop → Chooses journey       │
│    Options: "I need support" | "Browse stories" | "Share story" │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. DESCRIBE STRUGGLE (Chat or Simple Form)                      │
│    Two modes:                                                    │
│    A) Guided Chat: AI helps articulate feelings                 │
│    B) Direct Input: Text box with helpful prompts               │
│                                                                  │
│    Output: User's description + key themes extracted            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. CONTENT MODERATION CHECK                                     │
│    AI classifier checks input for concerning patterns           │
│                                                                  │
│    IF high risk (>0.8): Show crisis resources                   │
│    ELSE: Continue to matching                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. SEMANTIC MATCHING                                            │
│    AI converts user text → embedding vector                     │
│    Compares to pre-embedded mentor posts                        │
│    Returns top 5-10 most relevant stories                       │
│    Filters out any risky content                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. MATCHED STORIES FEED                                         │
│    Shows mentor posts ranked by relevance                       │
│    Each card: Title | Excerpt | Tags | Similarity score         │
│    User can: Read full story | Save | Reflect                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. READ FULL STORY                                              │
│    Full mentor post with context                                │
│    Key themes highlighted                                       │
│    Related stories at bottom                                    │
│    Actions: Save to diary | Send encouragement | Find resources │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. REFLECTION & NEXT STEPS                                      │
│    Option A: Write in private diary                             │
│    Option B: Explore more stories                               │
│    Option C: Access professional resources                      │
│    Option D: Send anonymous encouragement to mentors            │
└─────────────────────────────────────────────────────────────────┘
```

### Secondary Journey: Mentor Flow

```
Landing → Share Your Story → Guided Form → Review & Submit →
Wait for Approval → Story Published → See Impact Metrics
```

### Crisis Detection Flow

```
User Input → Moderator Detects High Risk →
Immediate Crisis Resources Screen →
Options: Call Crisis Line | Chat with Professional | Browse Stories Anyway
```

---

## Core Features

### 1. AI Conversation Matcher (Core Feature)

**Purpose:** Help users describe their struggles and match them to relevant mentor posts

**How It Works:**
- **Option A (Guided):** Conversational AI (Claude/GPT) helps users articulate feelings through gentle questions
- **Option B (Simple):** Direct text input with helpful prompts

**AI Components:**
- Content moderator checks input for crisis indicators
- Semantic matching finds relevant mentor posts using embeddings
- No AI-generated advice - only matching

**Success Criteria:**
- User can express their struggle in 2-3 minutes
- Matches are highly relevant (>0.7 similarity score)
- User feels understood without judgment

---

### 2. Mentor Stories Feed

**Purpose:** Browse authentic recovery stories from r/IncelExit and similar communities

**Content Sources:**
- Curated posts from r/IncelExit (Reddit)
- Submitted stories from recovered community members
- Verified by moderators for authenticity and safety

**Display Format:**
```
┌─────────────────────────────────────┐
│ 🏷️ Tags: loneliness, relationships  │
│                                     │
│ "How I Stopped Blaming Others"     │
│                                     │
│ For years I thought women were...  │
│ [excerpt - 2-3 lines]              │
│                                     │
│ Anonymous • 8 min read • 92% match │
└─────────────────────────────────────┘
```

**Filters & Sorting:**
- By theme: Loneliness | Relationships | Self-esteem | Anger | Belonging
- By perspective: Different genders/backgrounds to break echo chambers
- By length: Quick reads (5 min) | Deep dives (15+ min)

---

### 3. Private Diary

**Purpose:** Safe space for personal reflection and journey tracking

**Features:**
- Private notes (only visible to user)
- Track stories that resonated
- Write reflections on progress
- Optional mood tracking over time

**Why This Matters:**
- Processing thoughts helps internalize lessons
- Seeing progress builds motivation
- Privacy removes stigma and judgment

**Example Prompts:**
- "What resonated with you about this story?"
- "What's one thing you want to try differently?"
- "How are you feeling today compared to last week?"

---

### 4. Multi-Perspective Content

**Purpose:** Break echo chambers by exposing users to diverse perspectives

**Strategy:**
- Stories from different genders discussing similar struggles
- Perspectives from various cultural backgrounds
- Recovery stories at different stages (early, mid, long-term)
- Focus on common humanity, not "us vs them"

**Example Mix:**
- Young man who overcame loneliness through community
- Young woman who escaped toxic relationship patterns
- Non-binary person who built self-esteem through creativity
- All addressing the same core theme: "feeling unlovable"

---

### 5. Resources Hub

**Purpose:** Connect users to professional help when ready

**Categories:**
- Crisis support (hotlines, chat services)
- Therapy/counseling resources
- Educational content (healthy relationships, emotional regulation)
- Community resources (local groups, online communities)
- Self-help tools (books, podcasts, exercises)

**Integration Points:**
- Flagged during crisis detection
- Suggested after reading certain stories
- Always accessible from main navigation

---

### 6. Wholesome Interactions

**Purpose:** Positive-only engagement inspired by "Kind Words" game

**Allowed Interactions:**
- Send anonymous encouragement to mentors ("Your story helped me")
- Thank mentors for sharing
- Share what you learned (anonymously)

**NOT Allowed:**
- Comments/replies (prevents toxicity)
- User-to-user messaging (prevents grooming/manipulation)
- Public profiles (maintains anonymity)

**Why This Design:**
- Encourages gratitude and positivity
- Prevents toxic debates or attacks
- Protects vulnerable users
- Rewards mentors for vulnerability

---

### 7. Mood Tracking (Optional)

**Purpose:** Help users see emotional progress over time

**How It Works:**
- Optional daily check-in: "How are you feeling today?"
- Simple 1-5 scale or emoji selection
- Private graph shows trends over weeks/months
- No pressure, no streaks, fully optional

**Value:**
- Visual proof that things can improve
- Helps identify patterns (e.g., certain stories help more)
- Data stays private, never shared

---

## Architecture & AI Components

### System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                        │
│  Landing | Chat | Stories Feed | Story Detail | Diary | Profile  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      BACKEND API (FastAPI)                        │
│                                                                   │
│  /api/match        - Match user input to mentor posts            │
│  /api/moderate     - Check content for risk                      │
│  /api/chat         - Optional chat assistance                    │
│  /api/stories      - CRUD operations for mentor posts            │
│  /api/diary        - User's private reflections                  │
│  /api/resources    - Crisis/professional resources               │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
         ┌──────────────────┐  ┌──────────────────┐
         │   AI SERVICES    │  │    DATABASE      │
         │                  │  │   (Supabase)     │
         │ 1. Matcher       │  │                  │
         │ 2. Moderator     │  │ • Users          │
         │ 3. Chat (LLM)    │  │ • Stories        │
         └──────────────────┘  │ • Diary Entries  │
                               │ • Interactions   │
                               │ • Mood Logs      │
                               └──────────────────┘
```

### AI Component 1: Semantic Matcher

**Technology:** sentence-transformers (all-MiniLM-L6-v2)
**Training Required:** ❌ No (pre-trained works)
**Purpose:** Match user descriptions to relevant mentor posts

**How It Works:**
1. User describes struggle: "I feel like no one will ever love me"
2. Convert to embedding vector: [0.2, -0.5, 0.8, ...] (384 dimensions)
3. Compare to pre-computed mentor post embeddings using cosine similarity
4. Return top 5-10 most similar stories (similarity score 0.0 to 1.0)

**Files:**
- `backend/services/matcher.py` - SemanticMatcher class
- `data/processed/mentor_embeddings.pkl` - Pre-computed embeddings

**API Endpoint:** `POST /api/match`

---

### AI Component 2: Content Moderator

**Technology:** Logistic Regression or Neural Network (sklearn/keras)
**Training Required:** ✅ Yes (trained on hackathon competition_train.jsonl)
**Purpose:** Filter harmful content, detect concerning patterns

**How It Works:**
1. Extract features from text (word count, caps ratio, punctuation, etc.)
2. Classify as safe (0) or risky (1) with confidence score
3. If risk_score > 0.8: Flag for crisis resources
4. Used to filter both user input AND mentor posts before display

**Files:**
- `backend/services/moderator.py` - ContentModerator class
- `models/moderator.pkl` - Trained classifier
- `data/raw/competition_train.jsonl` - Training data

**API Endpoint:** `POST /api/moderate`

---

### AI Component 3: Chat Interface (Optional)

**Technology:** LLM API (Groq, Claude, or GPT)
**Training Required:** ❌ No (API call)
**Purpose:** Help users articulate their struggles through conversation

**How It Works:**
1. User says "I don't know how to explain how I feel"
2. LLM asks gentle clarifying questions: "What's been on your mind lately?"
3. After 2-3 exchanges, summarize key themes
4. Use summary as input to semantic matcher

**Important:** This does NOT provide advice or therapy - only helps users express themselves

**Files:**
- `backend/services/chat.py` - ChatAssistant class

**API Endpoint:** `POST /api/chat` (streaming)

**Environment Variables:**
- `GROQ_API_KEY` - Recommended (fast, free)
- `ANTHROPIC_API_KEY` - Alternative (Claude)
- `OPENAI_API_KEY` - Alternative (GPT)

---

### Data Flow Example

```
User Input: "I feel alone and like no one understands me"
     │
     ▼
┌─────────────────────────────────┐
│ Content Moderator               │
│ → risk_score: 0.3 (safe)       │
└─────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Semantic Matcher                │
│ → Embedding: [0.23, -0.51, ...] │
│ → Top matches found             │
└─────────────────────────────────┘
     │
     ▼
Matched Stories:
1. "My journey out of loneliness" (similarity: 0.87)
2. "How I found belonging" (similarity: 0.82)
3. "Learning to connect with others" (similarity: 0.79)
     │
     ▼
┌─────────────────────────────────┐
│ Filter with Moderator           │
│ → Check each story is safe      │
│ → Remove any risky content      │
└─────────────────────────────────┘
     │
     ▼
Display to User
```

---

## Design Principles

### 1. Authenticity Over Automation

**Why:** Trust comes from real human experiences, not AI-generated content

**How:**
- All mentor posts are from real people with lived experiences
- AI is used only for matching, never for generating advice
- Stories are verified and curated by human moderators
- Transparency: Users know they're reading real stories

---

### 2. Privacy-First, Stigma-Free

**Why:** Vulnerable users need safety to explore perspectives without judgment

**How:**
- Anonymous profiles (username, no real names)
- No public comments or replies
- Private diary (only visible to user)
- No user-to-user messaging
- No data sold or shared with third parties

---

### 3. Prevention, Not Intervention

**Why:** Easier to prevent radicalization than reverse it

**How:**
- Target users early in their journey (before beliefs are entrenched)
- Normalize seeking help and exploring perspectives
- Focus on relatable stories, not lectures
- Make it easy to "try on" new perspectives privately

---

### 4. Multi-Perspective by Design

**Why:** Echo chambers are the problem - diversity is the solution

**How:**
- Stories from different genders discussing similar struggles
- Content from various cultural/age backgrounds
- Balance of perspectives on every theme
- Algorithm intentionally suggests diverse viewpoints

---

### 5. Positive-Only Interactions

**Why:** Vulnerable users need support, not debate or criticism

**How:**
- Only wholesome interactions allowed (encouragement, thanks)
- No comments, replies, or arguments
- Inspiration: "Kind Words" game's positivity-only design
- Report harmful content, never engage with it

---

### 6. Scalable Peer Support

**Why:** One mentor's story can help thousands without burning out

**How:**
- Mentors share their story once, it helps many
- No obligation for ongoing 1:1 support
- Asynchronous sharing (no time commitment)
- Recognition for impact ("Your story helped 127 people")

---

### 7. Wholesome, Non-Clinical Aesthetic

**Why:** Mental health stigma keeps people from seeking help

**How:**
- Warm, approachable design (not medical/clinical)
- Positive language ("growth" not "treatment")
- Hand-drawn assets create human, personal feel
- Inspired by "Kind Words" scroll-based UI

---

## User Personas

### Persona 1: Jake (Seeker - Early Stage)

**Age:** 19
**Situation:** College student, struggling with loneliness, starting to adopt "blackpill" ideas

**Characteristics:**
- Feels isolated and misunderstood
- Spending time in incel-adjacent online spaces
- Not fully radicalized but vulnerable
- Wants connection but doesn't know how
- Shame prevents seeking professional help

**Needs:**
- Anonymous way to explore different perspectives
- Stories from people who've been where he is
- Hope that change is possible
- Non-judgmental environment

**Been There Journey:**
- Finds Been There through Google search or Reddit
- Hesitantly describes feelings in chat interface
- Reads story from former incel who overcame similar struggles
- Realizes he's not alone, saves story to diary
- Returns over several weeks, gradually shifts perspective

**Success Metric:** Returns 3+ times, saves stories, writes reflections

---

### Persona 2: Maya (Seeker - Crisis)

**Age:** 22
**Situation:** Recently escaped emotionally abusive relationship, struggling with self-worth

**Characteristics:**
- Self-blame and low self-esteem
- Isolated from support network
- Experiencing anxiety/depression
- Not in immediate danger but vulnerable
- Open to help but overwhelmed

**Needs:**
- Validation that abuse wasn't her fault
- Stories from others who recovered
- Clear path to professional resources
- Safe space to process emotions

**Been There Journey:**
- Input is flagged by moderator as medium-risk
- Shown crisis resources immediately, chooses to browse stories first
- Reads multiple stories about rebuilding after abuse
- Writes in diary, tracks mood over time
- Eventually uses Resources Hub to find therapist

**Success Metric:** Accesses crisis resources, returns over time, shows mood improvement

---

### Persona 3: David (Mentor - Recovered)

**Age:** 28
**Situation:** Former incel who turned life around through therapy and self-work

**Characteristics:**
- Wants to help others avoid his path
- Comfortable sharing story anonymously
- Motivated by seeing impact
- Limited time, can't do 1:1 mentoring

**Needs:**
- Easy way to share story once
- Anonymity (doesn't want past beliefs public)
- Feedback on impact ("Your story helped X people")
- Recognition without ongoing commitment

**Been There Journey:**
- Submits recovery story through mentor form
- Story is reviewed and published
- Receives periodic notifications: "Your story helped 5 more people this week"
- Feels fulfilled by positive impact without time commitment

**Success Metric:** Submits story, feels valued, continues to engage

---

### Persona 4: Alex (Casual Browser)

**Age:** 24
**Situation:** Not in crisis, but curious about others' experiences with loneliness

**Characteristics:**
- Relatively healthy mental state
- Interested in personal growth
- Enjoys reading real stories
- Wants to understand others better

**Needs:**
- Browse stories without pressure
- Learn from others' experiences
- Find inspiration and perspective
- Engage positively

**Been There Journey:**
- Browses Stories feed without describing personal struggle
- Reads stories tagged with themes they're curious about
- Sends anonymous encouragement to mentors
- Returns occasionally for inspiration

**Success Metric:** Engages with content, sends positive messages, low-pressure usage

---

## Content Strategy

### Mentor Post Sources

**Primary Source: r/IncelExit**
- Reformed incel community on Reddit
- High-quality recovery stories
- Active moderation ensures authenticity
- Variety of experiences and backgrounds

**Collection Method:**
1. Scrape public posts (with attribution)
2. Filter for recovery stories (not venting)
3. Remove personally identifying information
4. Verify quality and authenticity
5. Tag with themes and metadata

**Secondary Source: User Submissions**
- Open submission form for mentors
- Human review before publishing
- Maintain anonymity
- Verify authenticity (anti-spam)

---

### Content Themes & Tags

**Primary Themes:**
- Loneliness & Isolation
- Relationship Struggles
- Self-Esteem & Identity
- Anger & Resentment
- Belonging & Community
- Recovery & Growth

**Secondary Tags:**
- First steps
- Therapy helped
- Exercise/physical health
- Social skills
- Breaking toxic patterns
- Finding purpose
- Leaving toxic communities
- Building self-worth

---

### Content Quality Standards

**Include:**
- Authentic personal experiences
- Clear journey from struggle to growth
- Actionable insights (what helped)
- Vulnerability and honesty
- Hope without toxic positivity

**Exclude:**
- Victim blaming or shaming
- Prescriptive advice ("you should...")
- Extreme or graphic content
- Political/ideological rants
- Self-promotion or links
- Identifying personal information

---

### Crisis Resources

**Immediate Crisis:**
- 988 Suicide & Crisis Lifeline (US)
- Crisis Text Line (text HOME to 741741)
- International resources by country

**Mental Health Support:**
- 7 Cups (free peer support)
- BetterHelp (online therapy)
- Psychology Today therapist finder
- Local community mental health services

**Educational Resources:**
- Healthy Relationship Resources
- Emotional Regulation Techniques
- Social Skills Guides
- Self-Esteem Building

**Communities:**
- r/IncelExit (Reddit)
- r/MensLib (Reddit)
- r/DecidingToBeBetter (Reddit)
- Local support groups

---

## Technical Implementation

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Motion (animations)
- shadcn/ui (components)

**Backend:**
- FastAPI (Python)
- Uvicorn (ASGI server)
- Pydantic (validation)

**Database:**
- Supabase (PostgreSQL + Auth + Storage)

**AI/ML:**
- sentence-transformers (semantic matching)
- scikit-learn or keras (content moderation)
- Groq API (optional chat interface)

**Deployment:**
- Vercel (frontend)
- Railway/Render (backend)
- Supabase (hosted database)

---

### Database Schema

**users**
- id (uuid)
- username (string, unique, anonymous)
- created_at (timestamp)
- last_active (timestamp)
- role (enum: seeker, mentor, admin)

**stories**
- id (uuid)
- title (string)
- content (text)
- author_id (uuid, nullable - for anonymous posts)
- source (enum: reddit, user_submission)
- tags (array of strings)
- themes (array of strings)
- is_approved (boolean)
- created_at (timestamp)
- view_count (integer)
- help_count (integer) - "this helped me" count

**diary_entries**
- id (uuid)
- user_id (uuid)
- content (text)
- mood_score (integer 1-5, nullable)
- related_story_id (uuid, nullable)
- created_at (timestamp)
- is_private (boolean, default true)

**interactions**
- id (uuid)
- user_id (uuid)
- story_id (uuid)
- interaction_type (enum: viewed, saved, helped_me, sent_encouragement)
- created_at (timestamp)

**mood_logs**
- id (uuid)
- user_id (uuid)
- mood_score (integer 1-5)
- note (text, optional)
- created_at (timestamp)

---

### API Endpoints

**Matching & Moderation:**
- `POST /api/match` - Match user input to stories
- `POST /api/moderate` - Check content for risk
- `POST /api/chat` - Optional chat assistance (streaming)

**Stories:**
- `GET /api/stories` - List stories (with filters)
- `GET /api/stories/{id}` - Get single story
- `POST /api/stories` - Submit new story (mentors)
- `PATCH /api/stories/{id}` - Update story (admin)
- `DELETE /api/stories/{id}` - Delete story (admin)

**Diary:**
- `GET /api/diary` - Get user's diary entries
- `POST /api/diary` - Create diary entry
- `PATCH /api/diary/{id}` - Update entry
- `DELETE /api/diary/{id}` - Delete entry

**Interactions:**
- `POST /api/interactions` - Log interaction (view, save, help)
- `GET /api/interactions/stats` - Get story stats

**Mood Tracking:**
- `GET /api/mood` - Get user's mood history
- `POST /api/mood` - Log mood entry

**Resources:**
- `GET /api/resources` - Get crisis/support resources
- `GET /api/resources/{category}` - Get by category

---

## Success Metrics

### For Hackathon Demo

**Must Have:**
- User can describe struggle (2 methods: chat or form)
- Matching returns relevant stories (>0.7 similarity)
- Stories display beautifully with tags and themes
- Diary feature works
- Crisis detection flags high-risk input
- UI is polished and wholesome

**Nice to Have:**
- Mood tracking visualization
- Resources hub populated
- Multiple story perspectives
- Mobile responsive design

**Pitch Requirements:**
- Clear problem statement with stats
- Demo of full user journey (7 steps)
- Show AI matching in action
- Explain why "real stories > AI advice"
- Impact potential (scalability)

---

### For Post-Hackathon

**Engagement:**
- Daily Active Users (DAU)
- Stories read per user
- Diary entries created
- Return rate (7-day, 30-day)

**Impact:**
- "This helped me" interactions
- Mood score improvements over time
- Crisis resource clicks
- User testimonials/feedback

**Content:**
- Number of mentor stories
- Theme coverage breadth
- Story quality ratings
- Moderation accuracy

---

## Next Steps

### Phase 1: Hackathon MVP (Complete by Dec 5)
- [x] Landing page design
- [ ] Train content moderator on competition data
- [ ] Generate embeddings for mentor posts
- [ ] Build matching API
- [ ] Create chat interface (or simple form)
- [ ] Build stories feed UI
- [ ] Implement diary feature
- [ ] Crisis detection flow
- [ ] Deploy frontend + backend

### Phase 2: Post-Hackathon Enhancement
- [ ] User authentication (Supabase Auth)
- [ ] Mentor submission workflow
- [ ] Admin moderation dashboard
- [ ] Mood tracking analytics
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n)

### Phase 3: Scale & Impact
- [ ] Partner with mental health organizations
- [ ] Conduct user research studies
- [ ] Measure impact metrics
- [ ] Explore funding/sustainability
- [ ] Expand to other communities

---

## References

- **UI Design:** See [UI_DESIGN.md](./UI_DESIGN.md) for component guidelines
- **AI Implementation:** See [claude_ai_training.md](./claude_ai_training.md) for technical details
- **Development:** See [DEVELOPMENT.md](./DEVELOPMENT.md) for setup instructions
- **API Contract:** See [API_CONTRACT.md](./API_CONTRACT.md) for endpoint specifications
