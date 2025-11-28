# eSafety Hackathon - Needle in the Hashtag

> 16 Days of Activism Against Gender-Based Violence Hackathon
> Nov 29-30, 2025 | Stone & Chalk, Melbourne

## 🎯 Challenges

### Mini-Challenge: Persona Classification
Classify AI personas from millions of messages on a fake social media platform.
Target personas include:
- Body dysmorphia indicators
- Incel language patterns  
- LinkedIn Lunatic posting style
- Other behavioral patterns

### Grand Challenge: eSafety Solution Demo
Design and build a demo addressing online safety issues. Talk to mentors and eSafety researchers to understand the problems deeply.

---

## 🚀 Quick Start

### Windows Setup (Recommended)

```bash
# 1. Create virtual environment in project directory
python -m venv venv

# 2. Activate virtual environment
venv\Scripts\activate

# You should see (venv) at the start of your command prompt

# 3. Upgrade pip (fixes Windows long path issues)
python -m pip install --upgrade pip

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy environment template and add your API keys
copy .env.example .env

# 6. Run the example notebook
jupyter notebook notebooks/01_exploration.ipynb
```

**Note:** You'll need to activate the virtual environment each time you open a new terminal:
```bash
venv\Scripts\activate
```

### macOS/Linux Setup

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment template
cp .env.example .env

# 5. Run the example notebook
jupyter notebook notebooks/01_exploration.ipynb
```

## 📁 Project Structure

```
esafety-hackathon/
├── data/                    # Data files (gitignored)
│   ├── raw/                 # Raw data from hackathon
│   └── processed/           # Processed/cleaned data
├── notebooks/               # Jupyter notebooks for exploration
│   ├── 01_exploration.ipynb
│   └── 02_classification.ipynb
├── src/                     # Source code
│   ├── classifiers/         # Classification approaches
│   ├── features/            # Feature extraction
│   └── utils/               # Utility functions
├── scripts/                 # Standalone scripts
├── requirements.txt
├── .env.example
└── README.md
```

## 🔧 Available Tools & APIs

### Free APIs for Content Moderation

| API | Use Case | Rate Limit |
|-----|----------|------------|
| **Perspective API** | Toxicity, insults, threats | 1 QPS (free tier) |
| **OpenAI** | Flexible classification, embeddings | Pay-per-use |
| **HuggingFace** | Pre-trained models (BERT, etc.) | Unlimited local |

### Suggested Approaches

1. **LLM Classification**: Use GPT-4/Claude to classify text with custom prompts
2. **Perspective API**: Quick toxicity scoring baseline
3. **Embeddings + Clustering**: Group similar messages, identify persona clusters
4. **Fine-tuned BERT**: If you have labeled training data
5. **Keyword/Pattern Matching**: Fast baseline for known vocabulary

## 🧠 Persona Detection Ideas

### Body Dysmorphia Indicators
- Negative body talk, appearance obsession
- Comparison language ("I wish I looked like...")
- Diet/exercise extremism vocabulary

### Incel Language Patterns
- Specific terminology (known vocabulary)
- Victim mentality + entitlement blend
- Gender-related hostility

### LinkedIn Lunatic
- Humble-brag patterns
- "Agree?" ending posts
- Inspirational story arcs with business lessons
- Excessive emoji usage

## 📊 Evaluation Approach

For the mini-challenge, likely metrics:
- Accuracy / F1-score per persona class
- Confusion matrix analysis
- Precision/Recall trade-offs

## 🏆 Pitch Day Tips

1. **Lead with the problem** - What harm are you addressing?
2. **Show, don't tell** - Live demo > slides
3. **Be specific** - "Reduces moderator workload by 40%" beats "helps with moderation"
4. **Acknowledge limitations** - Shows maturity and understanding

## 📚 Resources

- [Perspective API Docs](https://developers.perspectiveapi.com/)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [eSafety Commissioner](https://www.esafety.gov.au/)

## 👥 Team Notes

_Add team member names/roles here during the hackathon_

---

*Built at the eSafety Hackathon - Making online spaces safer together* 🛡️
