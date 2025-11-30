#!/usr/bin/env python3
"""
Quick test script for Groq API classifier
"""
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path
sys.path.insert(0, 'src')

def test_environment():
    """Check if environment is configured correctly"""
    print("=" * 60)
    print("ENVIRONMENT CHECK")
    print("=" * 60)

    groq_key = os.getenv('GROQ_API_KEY')
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')

    print(f"GROQ_API_KEY: {'Set' if groq_key else 'Missing'}")
    if groq_key:
        # Groq keys can start with gsk_ or ggsk_
        valid_prefix = groq_key.startswith('gsk_') or groq_key.startswith('ggsk_')
        print(f"  Format: {'Valid' if valid_prefix else 'Invalid format'}")

    print(f"SUPABASE_URL: {'Set' if supabase_url else 'Missing'}")
    if supabase_url:
        print(f"  Format: {'Valid (https://)' if supabase_url.startswith('https://') else 'Invalid format'}")

    print(f"SUPABASE_KEY: {'Set' if supabase_key else 'Missing'}")
    print()

    # Return True if Groq key has valid prefix
    return bool(groq_key and (groq_key.startswith('gsk_') or groq_key.startswith('ggsk_')))

def test_groq_classifier():
    """Test the Groq classifier with a sample message"""
    print("=" * 60)
    print("GROQ CLASSIFIER TEST")
    print("=" * 60)

    try:
        from classifiers.api_classifiers import GroqClassifier
        print("GroqClassifier imported successfully")

        # Initialize classifier
        classifier = GroqClassifier()
        print("GroqClassifier initialized")

        # Test message (incel terminology)
        test_text = "Foid trap alert! Don't fall for the lies, guys."
        print(f"\nTest message: '{test_text}'")
        print("\nClassifying...")

        # Classify
        result = classifier.classify_competition(test_text, return_reasoning=True)

        print("\nRESULT:")
        print(f"  Category: {result['category']}")
        print(f"  Confidence: {result['confidence']}")
        print(f"  Indicators: {result['indicators']}")
        print(f"  Reasoning: {result['reasoning']}")

        return True

    except Exception as e:
        print(f"\nERROR: {type(e).__name__}: {e}")
        return False

def test_data_loading():
    """Test loading the competition training data"""
    print("=" * 60)
    print("DATA LOADING TEST")
    print("=" * 60)

    try:
        import json
        from collections import Counter

        data_path = 'data/raw/competition_train.jsonl'

        # Load data
        data = []
        with open(data_path, 'r', encoding='utf-8') as f:
            for line in f:
                data.append(json.loads(line))

        print(f"Loaded {len(data):,} examples")

        # Get category distribution
        cats = Counter()
        for item in data:
            cats.update(item.get('category_labels', []))

        print("\nTop 5 categories:")
        for cat, count in cats.most_common(5):
            print(f"  {cat}: {count:,}")

        # Show sample
        print("\nSample example:")
        sample = data[0]
        print(f"  User: {sample['user_id']}")
        print(f"  Text: {sample['text'][:100]}...")
        print(f"  Categories: {sample['category_labels']}")

        return True

    except Exception as e:
        print(f"\nERROR: {type(e).__name__}: {e}")
        return False

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("HACKATHON ENVIRONMENT TEST")
    print("=" * 60 + "\n")

    # Test 1: Environment
    env_ok = test_environment()

    # Test 2: Data loading
    data_ok = test_data_loading()

    # Test 3: Groq classifier (only if API key is set)
    groq_ok = False
    if env_ok:
        groq_ok = test_groq_classifier()
    else:
        print("\nSkipping Groq test (API key not configured)")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Environment: {'OK' if env_ok else 'NEEDS SETUP'}")
    print(f"Data Loading: {'OK' if data_ok else 'FAILED'}")
    print(f"Groq Classifier: {'OK' if groq_ok else 'SKIPPED/FAILED'}")
    print("\n" + "=" * 60)

    if env_ok and data_ok and groq_ok:
        print("All tests passed! Ready to build the classifier.")
    elif env_ok and data_ok:
        print("Core setup complete. Groq classifier ready to use.")
    else:
        print("Some issues detected. See details above.")
