# Technical Approaches - Classification & Matching

## Overview

This document covers two main technical challenges:
1. **Classification** - For content moderation and theme detection (originally mini-challenge)
2. **Story-to-User Matching** - For our peer-support platform (grand challenge)

Both leverage similar ML/NLP infrastructure but serve different purposes.

---

## Classification Strategy Overview

For content moderation and theme detection, we use a **tiered approach** that balances speed with accuracy:

| Tier | Method | Speed | Cost | When to Use |
|------|--------|-------|------|-------------|
| 1 | Keyword/Pattern Matching | Very Fast | Free | First pass on all data |
| 2 | Embeddings + Clustering | Fast | Free (local) | Group similar messages |
| 3 | Perspective API | 1 QPS | Free | Toxicity baseline |
| 4 | LLM Classification | Moderate | $$ | Uncertain cases only |

---

## Tier 1: Keyword/Pattern Matching

Fast, explainable baseline. Already implemented in `src/utils/text_utils.py` and `scripts/classify_messages.py`.

### LinkedIn Lunatic Patterns
```python
patterns = [
    r'agree\s*\?',
    r'thoughts\s*\?',
    r"i('m| am) (humbled|honored|blessed|grateful)",
    r'thought leader',
    r'game.?changer',
    r'🚀|💪|🙏|✨',
]
```

### Body Dysmorphia Patterns
```python
patterns = [
    r'hate my body',
    r'(skipped?|skip) (lunch|dinner|breakfast|meal)',
    r'need to lose',
    r'too (fat|skinny|ugly)',
    r'calories|fasting',
]
```

### Incel Patterns
```python
patterns = [
    r'(women|females?) only want',
    r'(society|game|system) is rigged',
    r'blackpill|chad|normie',
]
```

**Pros:** Fast, explainable, no API costs
**Cons:** Misses nuance, requires manual pattern curation

---

## Tier 2: Embeddings + Clustering

Use sentence-transformers to embed text, then cluster to find natural groupings.

```python
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(messages)
labels = KMeans(n_clusters=5).fit_predict(embeddings)
```

**Pros:** Finds patterns you didn't anticipate, runs locally
**Cons:** Clusters need manual interpretation

### Good For:
- Finding natural groupings in the data
- Identifying outliers
- Similarity search ("find messages like this one")

---

## Tier 3: Perspective API

Free API from Google/Jigsaw for toxicity detection.

```python
from src.classifiers.api_classifiers import PerspectiveAPI

perspective = PerspectiveAPI()
scores = perspective.analyze(text, attributes=['TOXICITY', 'INSULT', 'IDENTITY_ATTACK'])
```

**Available Attributes:**
- TOXICITY
- SEVERE_TOXICITY
- IDENTITY_ATTACK
- INSULT
- PROFANITY
- THREAT
- SEXUALLY_EXPLICIT (experimental)
- FLIRTATION (experimental)

**Rate Limit:** 1 query per second on free tier

**Pros:** Good toxicity baseline, free, battle-tested
**Cons:** Slow (1 QPS), doesn't classify personas directly

---

## Tier 4: LLM Classification

Use GPT-4 or Claude for nuanced classification with custom prompts.

```python
from src.classifiers.api_classifiers import LLMClassifier

classifier = LLMClassifier(provider='openai', model='gpt-4o-mini')
result = classifier.classify_persona(text)
# Returns: {category, confidence, indicators, reasoning}
```

**Pros:** Most flexible, handles nuance, can explain reasoning
**Cons:** Costs money, slower, rate limits

### Cost-Effective Strategy:
1. Run Tier 1 (keywords) on all messages
2. Only send uncertain cases (low confidence) to LLM
3. Use results to improve Tier 1 patterns

---

## User-Level Aggregation

For persona classification, aggregate at the user level rather than message level:

```python
user_features = df.groupby('user').agg({
    'text': 'count',                    # Message count
    'word_count': 'mean',               # Avg message length
    'emoji_count': 'sum',               # Total emojis
    'toxicity_score': 'mean',           # Avg toxicity
    'linkedin_pattern_count': 'sum',    # Pattern hits
    'body_dysmorphia_pattern_count': 'sum',
})
```

This gives more signal than individual messages.

---

## Feature Engineering Ideas

### Text-Based Features
- Word count, character count
- Emoji count and types
- Caps ratio (shouting indicator)
- Question marks (engagement bait)
- URL count, mention count, hashtag count

### Behavioral Features
- Posting frequency
- Time-of-day patterns
- Reply vs. original post ratio
- Conversation participation patterns

### Semantic Features
- Sentiment score
- Topic modeling (LDA)
- Named entity extraction
- Embedding similarity to known examples

---

## Recommended Stack

### For Classification Pipeline:
- **Python 3.10+**
- **pandas** for data manipulation
- **sentence-transformers** for embeddings (model: `all-MiniLM-L6-v2` for speed)
- **scikit-learn** for clustering/ML
- **openai** or **anthropic** SDK for LLM calls

### For Peer-Support Platform:
- **Frontend:** Loveable (skeleton generation) → hand-drawn assets
- **Backend:** FastAPI (existing infrastructure)
- **Database:** TBD by teammate (user profiles, mentor posts, diary entries, interactions, mood data)
- **AI/ML:** sentence-transformers for matching, existing classification for moderation

### For Demo Frontend (Original):
- **Streamlit** — Fastest for data apps
- **Gradio** — Good for ML demos
- **Next.js/React** — If you need more control
- **Note:** Being replaced by Loveable for our grand challenge solution

### For API:
- **FastAPI** — Modern, fast, good docs (what we're using)
- **Flask** — Simple, quick to set up (alternative)

---

## Story-to-User Matching Pipeline

**Purpose:** Match user conversations to relevant mentor posts based on semantic similarity

This is the core of our peer-support platform, enabling users to find stories from people who've overcome similar struggles.

### High-Level Flow

```
User describes struggle
  ↓
Clean & preprocess text
  ↓
Generate embedding (sentence-transformers)
  ↓
Search mentor post database (cosine similarity)
  ↓
Re-rank results (recency, engagement, diversity)
  ↓
Return top N matched posts + themes + resources
```

### Step-by-Step Implementation

#### Step 1: User Conversation → Embedding
```python
from sentence_transformers import SentenceTransformer
from src.utils.text_utils import clean_text

# Load model (do this once, cache it)
model = SentenceTransformer('all-MiniLM-L6-v2')

# User input
user_message = "I've been feeling really lonely lately and I don't know how to connect with people"

# Clean and embed
cleaned = clean_text(user_message, lowercase=True, remove_urls=True)
user_embedding = model.encode(cleaned)
# Shape: (384,) for all-MiniLM-L6-v2
```

#### Step 2: Mentor Post Database → Pre-computed Embeddings
```python
# Pre-compute embeddings for all mentor posts (do this offline)
mentor_posts = [
    {"id": 1, "content": "I used to feel so isolated...", "author": "anon123"},
    {"id": 2, "content": "Joining a local club changed my life...", "author": "anon456"},
    # ... more posts
]

# Compute embeddings for all posts
mentor_embeddings = model.encode([clean_text(p['content']) for p in mentor_posts])
# Shape: (num_posts, 384)

# Store in database or cache (np.save, pickle, or DB BLOB column)
```

#### Step 3: Cosine Similarity Search
```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Compute similarity between user and all mentor posts
similarities = cosine_similarity([user_embedding], mentor_embeddings)[0]
# Shape: (num_posts,)

# Get top N matches
top_n = 5
top_indices = np.argsort(similarities)[-top_n:][::-1]
top_scores = similarities[top_indices]

# Retrieve matched posts
matched_posts = [
    {
        **mentor_posts[idx],
        "relevance_score": float(top_scores[i])
    }
    for i, idx in enumerate(top_indices)
]
```

#### Step 4: Re-Ranking (Optional but Recommended)
```python
def rerank_posts(matched_posts, diversity_weight=0.2, recency_weight=0.1):
    """
    Re-rank to promote diversity and recency while maintaining relevance
    """
    for post in matched_posts:
        # Base score is semantic similarity
        score = post['relevance_score']

        # Diversity bonus: prefer posts from different authors/themes
        # (Implementation depends on data structure)

        # Recency bonus: slightly favor newer posts
        # if 'created_at' in post:
        #     days_old = (datetime.now() - post['created_at']).days
        #     recency_bonus = max(0, 1 - days_old / 365) * recency_weight
        #     score += recency_bonus

        post['final_score'] = score

    # Sort by final score
    return sorted(matched_posts, key=lambda x: x['final_score'], reverse=True)
```

#### Step 5: Return with Themes & Resources
```python
def get_themes_from_posts(posts, classifier):
    """Extract common themes from matched posts"""
    themes = set()
    for post in posts:
        # Use classification to detect themes
        result = classifier.classify(post['content'])
        themes.update(result.get('themes', []))
    return list(themes)

def recommend_resources(themes):
    """Map themes to curated resources"""
    resource_map = {
        'loneliness': [
            {"type": "article", "title": "Building Social Connections", "url": "..."},
            {"type": "service", "title": "Local Meetup Groups", "url": "..."},
        ],
        'self_esteem': [
            {"type": "article", "title": "Self-Compassion Guide", "url": "..."},
            {"type": "service", "title": "Affordable Therapy Options", "url": "..."},
        ],
        # ... more mappings
    }

    resources = []
    for theme in themes:
        resources.extend(resource_map.get(theme, []))
    return resources[:5]  # Top 5

# Full response
response = {
    "matched_posts": matched_posts,
    "themes": get_themes_from_posts(matched_posts, classifier),
    "suggested_resources": recommend_resources(themes)
}
```

### Performance Optimization

**For MVP (Hackathon Demo):**
- Store 10-20 curated mentor posts
- Pre-compute embeddings, save to JSON/pickle
- Load on server startup, keep in memory
- Simple linear search is fine for small dataset

**For Production:**
- Use vector database (Pinecone, Weaviate, Milvus, FAISS)
- Approximate nearest neighbors (ANN) for sub-millisecond search
- Batch embedding generation
- Cache user embeddings for follow-up queries

---

## Training Data Sources

### For Classification (Content Moderation)
1. **Hackathon-provided data** - Millions of messages from fake social media platform
2. **Labeled examples** - Manual labeling of sample messages
3. **Public datasets** - Toxic comment datasets (Wikipedia, Twitter)

### For Mentor Posts (Story Matching)
1. **Reddit r/IncelExit** - Reformed community members sharing recovery journeys
   - Use public posts only
   - Anonymize all identifying information
   - Respect community norms (credit source)

2. **Similar recovery communities**
   - r/ExRedPill
   - r/MensLib (positive masculinity)
   - Mental health support subreddits

3. **Expert contributions** - Mental health professionals writing advice
4. **User submissions** - Platform users who've improved (opt-in, curated)

### Ethical Considerations
- **Consent:** Use only public posts, offer opt-out mechanism
- **Anonymization:** Remove usernames, identifying details
- **Attribution:** Credit source communities, respect licenses
- **Representation:** Ensure diverse voices (gender, background, issue types)
- **Quality:** Manual curation to ensure posts are constructive and hopeful
- **Safety:** Screen for harmful advice, self-harm content

### Data Curation Process
1. **Collection** - Scrape public subreddits (Reddit API or PRAW)
2. **Filtering** - Remove low-quality, harmful, or off-topic posts
3. **Anonymization** - Replace usernames with pseudonyms, remove location data
4. **Classification** - Tag by themes (loneliness, relationships, self-esteem, etc.)
5. **Embedding** - Pre-compute embeddings for matching
6. **Review** - Manual review by team to ensure appropriateness
7. **Storage** - Save to database with metadata (theme, date, engagement, etc.)

---

## Content Moderation Strategy

**Purpose:** Keep the platform safe without over-filtering supportive content

### Multi-Tier Moderation

**Tier 1: Keyword Filtering (Existing)**
- Flag obviously harmful content (slurs, threats, self-harm language)
- Use existing pattern detection from `src/utils/text_utils.py`
- Very fast, runs on all content before display

**Tier 2: Toxicity Scoring (Existing - Perspective API)**
- Score user messages and mentor posts for toxicity
- Threshold: Flag if >0.7 toxicity score
- Provides nuance beyond keywords

**Tier 3: LLM Classification (Existing)**
- For edge cases and subtle harmful content
- Classify intent, tone, and potential harm
- Used selectively due to cost

**Tier 4: Human Review**
- All flagged content reviewed by moderator
- User reports escalated to human review
- Final decision on removals/warnings

### Safety Features
1. **Crisis Detection**
   - Flag suicidal ideation keywords
   - Immediate display of crisis resources (hotlines, services)
   - Optional escalation to human moderator

2. **Progressive Enforcement**
   - First offense: Warning message
   - Second: Temporary suspension (24 hours)
   - Third: Permanent ban

3. **False Positive Handling**
   - Users can appeal moderation decisions
   - Context-aware (e.g., quoting harmful content to refute it is OK)

4. **Mentor Post Screening**
   - All mentor posts manually reviewed before publication
   - Ensure they're constructive, hopeful, and safe
   - No posts that blame victims or promote harmful behavior

---

## Performance Tips

1. **Batch operations** — Don't classify one message at a time
2. **Cache embeddings** — Compute once, reuse for clustering/similarity
3. **Sample first** — Test on 1000 messages before running on millions
4. **Parallelize** — Use multiprocessing for CPU-bound tasks
5. **Async for APIs** — Use aiohttp for concurrent API calls

---

## Quick Start Commands

```bash
# Classify a CSV using keyword approach
python scripts/classify_messages.py data/raw/messages.csv data/processed/classified.csv

# Run Jupyter for exploration
jupyter notebook notebooks/02_classification.ipynb
```
