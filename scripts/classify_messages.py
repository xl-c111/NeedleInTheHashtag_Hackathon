#!/usr/bin/env python3
"""
Quick script to classify a CSV of messages.

Usage:
    python classify_messages.py input.csv output.csv --text-column text
"""

import argparse
import pandas as pd
from tqdm import tqdm
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.utils.text_utils import clean_text, count_features, detect_patterns
import re


def classify_by_keywords(text: str) -> dict:
    """Simple keyword-based classification."""
    text_lower = text.lower() if isinstance(text, str) else ""
    
    scores = {
        'linkedin_lunatic': 0,
        'body_dysmorphia': 0,
        'incel': 0,
        'toxic': 0,
        'normal': 0
    }
    
    # LinkedIn Lunatic
    if re.search(r'agree\s*\?|thoughts\s*\?', text_lower):
        scores['linkedin_lunatic'] += 2
    if re.search(r"i('m| am) (humbled|honored|blessed|grateful)", text_lower):
        scores['linkedin_lunatic'] += 2
    if re.search(r'thought leader|game.?changer|disruption', text_lower):
        scores['linkedin_lunatic'] += 1
    if re.search(r'🚀|💪|🙏|✨', text):
        scores['linkedin_lunatic'] += 1
    
    # Body dysmorphia
    if re.search(r'hate my body|too (fat|skinny|ugly)', text_lower):
        scores['body_dysmorphia'] += 2
    if re.search(r'(skipped?|skip) (lunch|dinner|breakfast|meal)', text_lower):
        scores['body_dysmorphia'] += 2
    if re.search(r'need to lose|calories|fasting', text_lower):
        scores['body_dysmorphia'] += 1
    
    # Incel
    if re.search(r'(women|females?) only want', text_lower):
        scores['incel'] += 2
    if re.search(r'(society|game|system) is rigged', text_lower):
        scores['incel'] += 2
    if re.search(r'blackpill|chad|normie', text_lower):
        scores['incel'] += 2
    
    # General toxic
    if re.search(r'(hate|stupid|idiot|loser)', text_lower):
        scores['toxic'] += 1
    
    # Get primary category
    max_score = max(scores.values())
    if max_score == 0:
        return {'category': 'normal', 'confidence': 1.0, 'scores': scores}
    
    primary = max(scores, key=scores.get)
    confidence = min(max_score / 5.0, 1.0)
    
    return {'category': primary, 'confidence': confidence, 'scores': scores}


def main():
    parser = argparse.ArgumentParser(description='Classify messages from CSV')
    parser.add_argument('input', help='Input CSV file')
    parser.add_argument('output', help='Output CSV file')
    parser.add_argument('--text-column', default='text', help='Name of text column')
    parser.add_argument('--user-column', default='user', help='Name of user column (optional)')
    args = parser.parse_args()
    
    print(f"Loading {args.input}...")
    df = pd.read_csv(args.input)
    print(f"Loaded {len(df)} messages")
    
    if args.text_column not in df.columns:
        print(f"Error: Column '{args.text_column}' not found")
        print(f"Available columns: {list(df.columns)}")
        return 1
    
    print("Classifying messages...")
    tqdm.pandas()
    
    # Classify
    results = df[args.text_column].progress_apply(classify_by_keywords)
    df['category'] = results.apply(lambda x: x['category'])
    df['confidence'] = results.apply(lambda x: x['confidence'])
    
    # Extract features
    print("Extracting features...")
    features = df[args.text_column].progress_apply(count_features)
    for col in ['word_count', 'emoji_count', 'caps_ratio']:
        df[col] = features.apply(lambda x: x.get(col, 0))
    
    # Summary
    print("\nCategory Distribution:")
    print(df['category'].value_counts())
    
    # Save
    df.to_csv(args.output, index=False)
    print(f"\nSaved to {args.output}")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
