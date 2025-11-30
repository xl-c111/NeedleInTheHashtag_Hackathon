# Quick Start Guide - Bash Commands

## Environment Setup (One-Time)

Already done! Your environment is ready to use.

## Daily Workflow

### 1. Activate Virtual Environment

```bash
source venv/Scripts/activate
```

You'll see `(venv)` in your terminal prompt when activated.

### 2. Start Jupyter Notebooks

**Option 1: Using the launcher script**
```bash
./start_jupyter.sh
```

**Option 2: Manual command**
```bash
source venv/Scripts/activate && jupyter notebook
```

Jupyter will open in your browser at `http://localhost:8888`

**Recommended notebook to start:** `notebooks/01_exploration.ipynb`

### 3. Run Python Scripts

```bash
# Test the environment
source venv/Scripts/activate
python test_groq.py

# Or use venv python directly
./venv/Scripts/python.exe test_groq.py
```

### 4. Run the Test Suite

```bash
./venv/Scripts/python.exe test_groq.py
```

This will test:
- Environment variables (API keys)
- Data loading (42,031 examples)
- Groq classifier (if API key is valid)

## Working with the Classifier

### Test Groq Classifier (Interactive)

```bash
source venv/Scripts/activate
python
```

Then in Python:
```python
import sys
sys.path.insert(0, 'src')
from classifiers.api_classifiers import GroqClassifier

# Initialize
classifier = GroqClassifier()

# Test with a message
result = classifier.classify_competition(
    "I'm feeling really lonely and isolated",
    return_reasoning=True
)

print(f"Category: {result['category']}")
print(f"Confidence: {result['confidence']}")
print(f"Reasoning: {result['reasoning']}")
```

### Load and Explore Data

```bash
source venv/Scripts/activate
python
```

Then in Python:
```python
import json
import pandas as pd

# Load competition data
data = []
with open('data/raw/competition_train.jsonl', 'r') as f:
    for line in f:
        data.append(json.loads(line))

df = pd.DataFrame(data)
print(f"Total examples: {len(df):,}")
print(f"\nSample:\n{df.head()}")
print(f"\nCategories:\n{df['category_labels'].explode().value_counts()}")
```

## Common Tasks

### Install New Package

```bash
source venv/Scripts/activate
pip install package-name

# Or directly
./venv/Scripts/pip.exe install package-name
```

### Update Requirements

```bash
source venv/Scripts/activate
pip freeze > requirements.txt
```

### Deactivate Virtual Environment

```bash
deactivate
```

## File Paths Reference

| What | Path |
|------|------|
| Training Data | `data/raw/competition_train.jsonl` |
| Exploration Notebook | `notebooks/01_exploration.ipynb` |
| Classification Notebook | `notebooks/02_classification.ipynb` |
| Groq Classifier | `src/classifiers/api_classifiers.py` |
| Text Utils | `src/utils/text_utils.py` |
| Environment Config | `.env` |
| Test Script | `test_groq.py` |

## Troubleshooting

### "Command not found" Error

Make sure you're in the project directory:
```bash
cd /c/Users/camgt/OneDrive/Documents/Hackathons/NeedleInTheHashtag_Hackathon
```

### Virtual Environment Not Activating

```bash
# Use forward slashes in bash
source venv/Scripts/activate

# Or use the launcher directly
./venv/Scripts/python.exe your_script.py
```

### Groq API Key Invalid

1. Go to https://console.groq.com/
2. Navigate to API Keys
3. Generate a new key
4. Update `.env` file:
   ```bash
   nano .env  # or use any text editor
   # Update: GROQ_API_KEY=gsk_your-new-key-here
   ```

### Jupyter Not Opening

```bash
# Check if jupyter is installed
./venv/Scripts/pip.exe show jupyter

# If not installed
./venv/Scripts/pip.exe install jupyter

# Then start
./start_jupyter.sh
```

## Quick Reference

### Start Working (Every Session)
```bash
# 1. Navigate to project
cd /c/Users/camgt/OneDrive/Documents/Hackathons/NeedleInTheHashtag_Hackathon

# 2. Activate venv
source venv/Scripts/activate

# 3. Start Jupyter
jupyter notebook

# Or launch script
./start_jupyter.sh
```

### Check Environment Status
```bash
./venv/Scripts/python.exe test_groq.py
```

### Run Classifier on Sample Text
```bash
./venv/Scripts/python.exe << 'EOF'
import sys
sys.path.insert(0, 'src')
from classifiers.api_classifiers import GroqClassifier

classifier = GroqClassifier()
result = classifier.classify_competition("Foid trap alert!")
print(f"Category: {result['category']}")
print(f"Confidence: {result['confidence']}")
EOF
```

## Next Steps

1. **Fix Groq API Key** (if needed)
   - Visit https://console.groq.com/
   - Generate new key
   - Update in `.env` file

2. **Explore Data**
   ```bash
   ./start_jupyter.sh
   # Open notebooks/01_exploration.ipynb
   ```

3. **Build Matching Algorithm**
   - See `docs/TECHNICAL_APPROACHES.md` for architecture
   - See `docs/API_CONTRACT.md` for endpoint design

4. **Create Sample Mentor Posts**
   - Curate 10-20 posts from r/IncelExit
   - Store in `data/mentor_posts.json`
   - Pre-compute embeddings for matching

## Documentation

- **Project Overview:** `CLAUDE.md`
- **Solution Concept:** `docs/SOLUTION_CONCEPT.md`
- **Technical Details:** `docs/TECHNICAL_APPROACHES.md`
- **API Contract:** `docs/API_CONTRACT.md`
- **Data Summary:** `docs/DATA_SUMMARY.md`
- **Groq Guide:** `docs/GROQ_QUICKSTART.md`
