# Technical Approaches

## Classification Strategy Overview

For the mini-challenge (persona classification), we recommend a **tiered approach** that balances speed with accuracy:

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
- **sentence-transformers** for embeddings
- **scikit-learn** for clustering/ML
- **openai** or **anthropic** SDK for LLM calls

### For Demo Frontend:
- **Streamlit** — Fastest for data apps
- **Gradio** — Good for ML demos
- **Next.js/React** — If you need more control

### For API (if needed):
- **FastAPI** — Modern, fast, good docs
- **Flask** — Simple, quick to set up

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
