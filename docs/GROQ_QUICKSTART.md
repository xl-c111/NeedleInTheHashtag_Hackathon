# Groq Classifier Quick Start Guide

This guide shows you how to use the Groq classifier for fast, free LLM-based classification.

## Why Groq?

- **Very fast** - Orders of magnitude faster than OpenAI/Anthropic
- **Free tier** - Good limits for hackathon use
- **Easy API** - OpenAI-compatible interface
- **Open models** - Llama 3.1, Mixtral, Gemma

## Setup

### 1. Get API Key

1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up (free)
3. Go to API Keys section
4. Create new API key (starts with `gsk_...`)

### 2. Add to .env

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your key:
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Install Groq Library

```bash
# Activate venv first
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Install groq (or reinstall all requirements)
pip install groq
# or
pip install -r requirements.txt
```

## Usage Examples

### Example 1: Classify Single Message

```python
from src.classifiers.api_classifiers import GroqClassifier

# Initialize classifier
classifier = GroqClassifier()

# Classify a message using competition categories
text = "Foid trap alert! Don't fall for the lies, guys."
result = classifier.classify_competition(text, return_reasoning=True)

print(f"Category: {result['category']}")
print(f"Confidence: {result['confidence']}")
print(f"Indicators: {result['indicators']}")
print(f"Reasoning: {result['reasoning']}")

# Output:
# Category: incel_misogyny
# Confidence: 0.95
# Indicators: ['Foid', 'trap alert', 'lies']
# Reasoning: Uses incel terminology ("foid") and conspiracy language
```

### Example 2: Batch Classify from JSONL

```python
import json
from src.classifiers.api_classifiers import GroqClassifier

# Load data
data = []
with open('data/raw/competition_train.jsonl', 'r') as f:
    for line in f:
        data.append(json.loads(line))

# Take first 10 for testing
texts = [item['text'] for item in data[:10]]

# Classify in batch
classifier = GroqClassifier()
results = classifier.batch_classify(texts, classification_fn='competition')

# Show results
for text, result in zip(texts, results):
    print(f"\nText: {text[:50]}...")
    print(f"  Category: {result['category']}")
    print(f"  Confidence: {result['confidence']}")
```

### Example 3: Custom Categories

```python
from src.classifiers.api_classifiers import GroqClassifier

classifier = GroqClassifier()

# Define custom categories
custom_categories = ['support_seeking', 'advice_giving', 'venting', 'celebration']

custom_prompt = """Classify this post into one of these categories:
- support_seeking: User asking for help or support
- advice_giving: User offering advice to others
- venting: User expressing frustration
- celebration: User sharing good news

Respond in JSON: {"category": "...", "confidence": 0.0-1.0, "reasoning": "..."}"""

text = "I don't know what to do anymore. Has anyone been through something like this?"

result = classifier.classify(
    text,
    categories=custom_categories,
    system_prompt=custom_prompt,
    return_reasoning=True
)

print(result)
# Output: {'category': 'support_seeking', 'confidence': 0.9, 'reasoning': '...'}
```

### Example 4: Use with Pandas DataFrame

```python
import pandas as pd
from src.classifiers.api_classifiers import GroqClassifier

# Load your data
df = pd.read_json('data/raw/competition_train.jsonl', lines=True)

# Classify first 100 messages
classifier = GroqClassifier()
sample_texts = df['text'].head(100).tolist()
results = classifier.batch_classify(sample_texts)

# Add results to dataframe
df_sample = df.head(100).copy()
df_sample['predicted_category'] = [r['category'] for r in results]
df_sample['predicted_confidence'] = [r['confidence'] for r in results]

# Compare with ground truth
df_sample['correct'] = df_sample.apply(
    lambda row: row['predicted_category'] in row['category_labels'],
    axis=1
)

accuracy = df_sample['correct'].mean()
print(f"Accuracy on 100 samples: {accuracy:.2%}")
```

## Model Options

Groq supports several models. Choose based on your needs:

```python
# Fast and good (default)
classifier = GroqClassifier(model='llama-3.1-70b-versatile')

# Even faster, slightly less accurate
classifier = GroqClassifier(model='llama-3.1-8b-instant')

# Good for complex/nuanced classification
classifier = GroqClassifier(model='mixtral-8x7b-32768')
```

## Competition Categories

The `classify_competition()` method uses these categories from the training data:

| Category | Description | Example |
|----------|-------------|---------|
| **bullying** | Harassment, intimidation | "You're pathetic, @username" |
| **incel_misogyny** | Incel terminology, anti-women | "Foids only want Chads" |
| **gamergate** | Gaming harassment, anti-SJW | "Woke mob ruining games" |
| **alpha** | Toxic masculinity, "high-value male" | "Dominate the dating market" |
| **trad** | Reactionary gender views | "Women belong in the home" |
| **extremist** | Revolutionary language, calls to violence | "BURN IT ALL DOWN" |
| **hate_speech** | Slurs, racial/religious hatred | Dehumanizing language |
| **pro_ana** | Pro-eating disorder | "Thinspiration" content |
| **ed_risk** | ED warning signs | Extreme calorie restriction |
| **conspiracy** | Deep state, QAnon | "Leaked info from gov" |
| **misinfo** | False claims, anti-science | Debunked narratives |
| **recovery_ed** | ED recovery (POSITIVE) | "Healthy boundaries" |
| **benign** | Normal, healthy content | Regular social media |

## Performance Tips

1. **Batch when possible** - Faster than one-at-a-time
2. **Start small** - Test on 10-100 examples first
3. **Monitor costs** - Check Groq dashboard for usage
4. **Handle errors** - Network issues can happen

## Troubleshooting

### "GROQ_API_KEY not found"
- Make sure you copied `.env.example` to `.env`
- Make sure you added your actual API key (starts with `gsk_`)
- Make sure you're running from project root (where .env file is)

### "ImportError: groq library not installed"
```bash
pip install groq
```

### Rate limits
Groq has generous rate limits, but if you hit them:
- Add delays between requests
- Use batch processing with smaller batches
- Upgrade to paid tier if needed

## Next Steps

1. **Test the classifier** - Run examples above
2. **Explore in Jupyter** - Open `notebooks/02_classification.ipynb`
3. **Build your pipeline** - Combine with keyword patterns, embeddings
4. **Evaluate accuracy** - Compare predictions with ground truth labels

## Integration with Our Solution

For the peer-support platform, use Groq for:

1. **Content moderation** - Filter harmful content before showing to users
   ```python
   result = classifier.classify_competition(user_post)
   if result['category'] in ['hate_speech', 'bullying', 'extremist']:
       flag_for_review(user_post)
   ```

2. **Theme detection** - Identify what users are struggling with
   ```python
   # Detect if user needs support
   if result['category'] in ['incel_misogyny', 'ed_risk', 'pro_ana']:
       show_recovery_resources(user)
   ```

3. **Mentor post screening** - Ensure mentor posts are constructive
   ```python
   if result['category'] in ['recovery_ed', 'benign']:
       approve_mentor_post(post)
   ```

## Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Models](https://console.groq.com/docs/models)
- [Rate Limits](https://console.groq.com/docs/rate-limits)
