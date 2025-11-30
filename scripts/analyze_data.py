"""Quick script to analyze the competition training data."""
import json
from collections import Counter
from pathlib import Path

# Load data
data_path = Path(__file__).parent.parent / "data" / "raw" / "competition_train.jsonl"
print(f"Loading data from: {data_path}")

data = []
with open(data_path, 'r', encoding='utf-8') as f:
    for line in f:
        data.append(json.loads(line))

print(f"\n{'='*60}")
print(f"TOTAL EXAMPLES: {len(data):,}")
print(f"{'='*60}")

# Category distribution
cats = Counter()
for item in data:
    cats.update(item.get('category_labels', []))

print(f"\nCATEGORY DISTRIBUTION:")
print(f"{'-'*60}")
for cat, count in cats.most_common():
    pct = (count / len(data)) * 100
    print(f"  {cat:25s}: {count:6,} ({pct:5.2f}%)")

# Check for multi-label examples
multi_label_count = sum(1 for item in data if len(item.get('category_labels', [])) > 1)
print(f"\nMULTI-LABEL EXAMPLES: {multi_label_count:,} ({(multi_label_count/len(data))*100:.2f}%)")

# User distribution
user_ids = [item.get('user_id') for item in data]
unique_users = len(set(user_ids))
print(f"\nUNIQUE USERS: {unique_users:,}")
print(f"MESSAGES PER USER (avg): {len(data)/unique_users:.2f}")

# Post type distribution
post_types = Counter(item.get('type', 'unknown') for item in data)
print(f"\nPOST TYPE DISTRIBUTION:")
print(f"{'-'*60}")
for ptype, count in post_types.most_common():
    pct = (count / len(data)) * 100
    print(f"  {ptype:15s}: {count:6,} ({pct:5.2f}%)")

# Sample examples per category
print(f"\n{'='*60}")
print("SAMPLE EXAMPLES (first 2 per category):")
print(f"{'='*60}")

shown_per_cat = {}
for item in data:
    for cat in item.get('category_labels', []):
        if shown_per_cat.get(cat, 0) < 2:
            shown_per_cat[cat] = shown_per_cat.get(cat, 0) + 1
            text = item['text'][:100] + ('...' if len(item['text']) > 100 else '')
            print(f"\n[{cat}]")
            print(f"  User: {item.get('user_id')}, Type: {item.get('type')}")
            print(f"  Text: {text}")

print(f"\n{'='*60}")
print("Analysis complete!")
