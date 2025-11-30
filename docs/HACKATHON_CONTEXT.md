# Hackathon Context

## Event Details

**Name:** Needle in the Hashtag - eSafety Hackathon
**Theme:** 16 Days of Activism Against Gender-Based Violence
**Location:** Stone & Chalk, 121 King St Melbourne CBD
**Dates:** Saturday 29 Nov - Sunday 30 Nov, 2025

### Timeline

| Date | Event |
|------|-------|
| Sat 29 Nov | Day 1 - Hacking + Talks |
| Sun 30 Nov | Day 2 - Hacking + Talks |
| Fri 5 Dec 11:59pm | **Submission Deadline** |
| Sun 7 Dec | Finalists Announced |
| Thu 11 Dec 3pm | **Pitch Day** |

## The Challenges

### Mini-Challenge: Persona Classification

The organizers have built a fake social media platform with AI personas posting, commenting, and chatting. The task is to classify who is who from millions of messages.

**Target Personas:**
- Body dysmorphia indicators
- Incel language patterns
- LinkedIn Lunatic posting style
- Other behavioral patterns TBD

**Likely Approach:**
- Text classification using keyword patterns, ML, or LLMs
- User-level aggregation (multiple messages per user)
- Clustering to find natural groupings

### Grand Challenge: eSafety Solution Demo

Design and build a demo addressing online safety issues. This requires:
1. Understanding the problem deeply (mentor interviews, talks)
2. Identifying a specific angle/user need
3. Building a working demo
4. Pitching the solution

**Our Chosen Direction: Peer-Support Platform for De-Radicalization**

We are building a platform that connects people struggling with difficult issues (loneliness, relationships, self-esteem) to real stories from mentors with lived experiences who have overcome similar challenges.

**Key Innovation:** AI-powered matching (not AI-generated content) to connect users with authentic human stories, breaking echo chambers and preventing radicalization.

---

## Our Solution Approach

### Problem We're Solving
**Online radicalization and echo chambers that increase misogyny and correlate with gender-based violence**

- Incel communities and similar spaces started as support groups but became toxic echo chambers
- Young people (especially young men) are vulnerable to misinformation and extreme viewpoints
- Echo chambers reinforce harmful beliefs, increasing risk of self-harm and harming others
- Research links misogynistic views to higher rates of domestic violence and gender-based violence
- Current approaches (deplatforming) don't address root causes and can worsen the problem

### Our Solution
**A peer-support platform that connects people to real human stories, not AI therapy**

**Core Features:**
1. **AI Conversation Matcher** - User describes struggles → AI matches to relevant mentor posts
2. **Mentor Post Feed** - Real stories from reformed community members (e.g., r/IncelExit)
3. **Personal Diary** - Private reflection and journey tracking
4. **Multi-Perspective Content** - Stories from different genders/backgrounds to break echo chambers
5. **Resources Hub** - Professional services, crisis support, educational content
6. **Wholesome Interactions** - Positive engagement inspired by "Kind Words" game
7. **Mood Tracking** - Self-reported emotional state over time

**What Makes It Different:**
- **Real human stories, not AI-generated content** - Authenticity drives connection
- **AI for matching only** - Technology connects users to lived experiences, doesn't replace them
- **Prevention-focused** - Intervene before beliefs become entrenched
- **Privacy-first** - Anonymous profiles, stigma-free environment
- **Scalable** - Volunteer mentors sharing stories help thousands

### Target Users
- Young people exposed to online misinformation and radicalization
- People struggling with loneliness, relationships, self-esteem
- Those at risk of or already in echo chambers of harmful beliefs
- Reformed community members willing to share their recovery journeys (as mentors)

### Technical Approach
- **Frontend:** Loveable-generated skeleton with hand-drawn assets
- **Backend:** FastAPI with existing text processing infrastructure
- **AI/ML:** Sentence-transformers for semantic matching, classification for moderation
- **Data:** Curated mentor posts from r/IncelExit and similar recovery communities
- **Database:** TBD by teammate (stores users, posts, diary, interactions, mood)

### Success Metrics (Demo)
- User completes 7-step journey (describe struggle → matched posts → interaction → diary → resources)
- Matching algorithm returns relevant mentor posts (judged by team)
- UI is intuitive, visually appealing, and wholesome
- Pitch clearly conveys problem → solution → impact

---

## Inspirations

### Products & Platforms
1. **Kind Words (game)** - Wholesome peer-to-peer messaging with scroll-based UI
   - Players send anonymous requests for kind words
   - Others respond with supportive messages
   - No toxicity, just mutual support
   - **Inspiration:** Wholesome interactions, positive-only environment

2. **r/IncelExit** - Reformed incel community helping current members exit the ideology
   - Real people sharing their recovery journeys
   - Constructive advice from those who've been there
   - Moderated to prevent toxicity while staying supportive
   - **Inspiration:** Lived experience sharing, mentor-mentee model

3. **Glassdoor** - Anonymous workplace reviews
   - Anonymous but authentic perspectives
   - Helps people make informed decisions
   - Community-driven content
   - **Inspiration:** Anonymous yet authentic content model

4. **7 Cups** - Peer support and active listening platform
   - Trained volunteers provide emotional support
   - Not therapy, just someone to listen
   - **Inspiration:** Peer support at scale

### Research & Real-World Programs
1. **Deradicalization Programs (Indonesia)**
   - Former extremists mentor current ones
   - Proven effectiveness in reducing radicalization
   - Human connection breaks ideological echo chambers
   - **Inspiration:** Mentor model for deradicalization

2. **Gender-Based Violence Prevention Research**
   - Link between misogynistic beliefs and domestic violence
   - Early intervention reduces long-term risk
   - Changing beliefs through exposure to diverse perspectives
   - **Inspiration:** Evidence-based approach to prevention

3. **Peer Support Effectiveness Studies**
   - Peer support as effective as professional intervention for some issues
   - Lived experience builds trust and relatability
   - Reduces stigma around seeking help
   - **Inspiration:** Validation of peer-to-peer model

---

## Mini-Challenge Status

**Status:** Deprioritized in favor of Grand Challenge

The mini-challenge (persona classification) is still relevant for our solution:
- **Content moderation** - Classify harmful content before showing it to users
- **Theme detection** - Identify topics in user conversations and mentor posts
- **Matching algorithm** - Use classification to improve relevance of matches

We're leveraging existing classification infrastructure (keyword patterns, embeddings, LLM classification) but focusing demo effort on the peer-support platform.

## Day 1 Talks (Saturday)

| Time | Talk | Relevance |
|------|------|-----------|
| 12:00pm | Macken Murphy - The Manosphere & Incel Ideology | Understanding incel language/culture |
| 2:00pm | David Gilmore - Incel Radicalisation (Lived Experience) | Real-world impact, warning signs |
| 4:00pm | Campbell Wilson - Countering Online Child Exploitation | Content moderation approaches |
| 6:00pm | Sarah Davis-Gilmore - Lived Experience, Safety, Connection | User perspective on safety |

## Day 2 Talks (Sunday)

| Time | Talk | Relevance |
|------|------|-----------|
| 12:00pm | Maria & Ellen (eSafety) - All About eSafety | Official commissioner perspective |
| 2:00pm | Alan Agon (PaxMod) - Gaming Lounge Moderation | Gaming-specific moderation |
| 4:00pm | Scotty (The Product Bus) - TBA | Product thinking |

## Submission Requirements

> **Confirm with organizers on Day 1**

Likely requirements:
- Working demo or prototype
- Video pitch (length TBD)
- Project documentation
- Source code

## Judging Criteria

> **Confirm with organizers**

Likely criteria:
- Problem significance / Impact potential
- Solution creativity / Innovation
- Technical execution
- Demo quality
- Pitch clarity
- Feasibility / Scalability

## Resources Provided

> **Update on Day 1**

- Access to fake social media platform data
- Mentors from safety, policy, community, tech, AI backgrounds
- Tool credits TBD
- Starter kits for beginners

## Questions to Clarify on Day 1

- [ ] What format should the pitch video be? (length, format)
- [ ] What data/APIs do we have access to?
- [ ] Are there specific tool credits provided?
- [ ] What does the submission process look like?
- [ ] Can we continue working through the week until Friday deadline?
- [ ] What do judges value most?
