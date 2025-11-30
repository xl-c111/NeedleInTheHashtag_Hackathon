"""
Text preprocessing utilities for the eSafety Hackathon.
"""

import re
import string
from typing import List, Optional
import emoji


def clean_text(text: str, 
               lowercase: bool = True,
               remove_urls: bool = True,
               remove_mentions: bool = True,
               remove_hashtags: bool = False,  # Keep hashtags - might be useful signals
               remove_emojis: bool = False,    # Keep emojis - might be useful signals
               remove_punctuation: bool = False,
               remove_extra_whitespace: bool = True) -> str:
    """
    Clean and normalize text for analysis.
    
    Args:
        text: Input text string
        lowercase: Convert to lowercase
        remove_urls: Remove URLs
        remove_mentions: Remove @mentions
        remove_hashtags: Remove #hashtags
        remove_emojis: Remove emoji characters
        remove_punctuation: Remove punctuation
        remove_extra_whitespace: Normalize whitespace
    
    Returns:
        Cleaned text string
    """
    if not isinstance(text, str):
        return ""
    
    # Remove URLs
    if remove_urls:
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Remove mentions
    if remove_mentions:
        text = re.sub(r'@\w+', '', text)
    
    # Remove hashtags (keep the word, just remove #)
    if remove_hashtags:
        text = re.sub(r'#\w+', '', text)
    else:
        text = re.sub(r'#(\w+)', r'\1', text)  # Keep word, remove #
    
    # Remove emojis
    if remove_emojis:
        text = emoji.replace_emoji(text, '')
    
    # Lowercase
    if lowercase:
        text = text.lower()
    
    # Remove punctuation
    if remove_punctuation:
        text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove extra whitespace
    if remove_extra_whitespace:
        text = ' '.join(text.split())
    
    return text.strip()


def extract_emojis(text: str) -> List[str]:
    """Extract all emojis from text."""
    return [c for c in text if c in emoji.EMOJI_DATA]


def count_features(text: str) -> dict:
    """
    Extract basic text features that might be useful for classification.
    
    Returns dict with:
        - char_count: Number of characters
        - word_count: Number of words
        - sentence_count: Approximate sentence count
        - emoji_count: Number of emojis
        - url_count: Number of URLs
        - mention_count: Number of @mentions
        - hashtag_count: Number of #hashtags
        - caps_ratio: Ratio of uppercase characters
        - exclamation_count: Number of !
        - question_count: Number of ?
    """
    if not isinstance(text, str):
        return {}
    
    features = {
        'char_count': len(text),
        'word_count': len(text.split()),
        'sentence_count': len(re.findall(r'[.!?]+', text)),
        'emoji_count': len(extract_emojis(text)),
        'url_count': len(re.findall(r'https?://\S+', text)),
        'mention_count': len(re.findall(r'@\w+', text)),
        'hashtag_count': len(re.findall(r'#\w+', text)),
        'exclamation_count': text.count('!'),
        'question_count': text.count('?'),
    }
    
    # Calculate caps ratio (ignoring non-alphabetic)
    alpha_chars = [c for c in text if c.isalpha()]
    if alpha_chars:
        features['caps_ratio'] = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
    else:
        features['caps_ratio'] = 0.0
    
    return features


def detect_patterns(text: str) -> dict:
    """
    Detect specific patterns that might indicate certain personas.
    
    Returns dict of boolean flags for detected patterns.
    """
    text_lower = text.lower() if isinstance(text, str) else ""
    
    patterns = {
        # LinkedIn Lunatic patterns
        'ends_with_agree': bool(re.search(r'agree\s*\??\s*$', text_lower)),
        'humble_brag': bool(re.search(r"i('m| am) (humbled|honored|blessed|grateful)", text_lower)),
        'thought_leadership': bool(re.search(r'(thought leader|game.?changer|disrupt)', text_lower)),
        
        # Potential negative body image
        'body_comparison': bool(re.search(r'(wish i (looked|was)|should be (thinner|skinnier|prettier))', text_lower)),
        'diet_extreme': bool(re.search(r'(only ate|didn\'t eat|skipped (meal|eating)|fasting for)', text_lower)),
        
        # High emoji usage
        'emoji_heavy': len(extract_emojis(text)) > 5,
        
        # Caps lock shouting
        'shouting': bool(re.search(r'[A-Z]{5,}', text)),
        
        # Question seeking engagement
        'engagement_bait': bool(re.search(r'(thoughts\?|what do you think\?|am i (right|wrong))', text_lower)),
    }
    
    return patterns


def batch_clean(texts: List[str], **kwargs) -> List[str]:
    """Clean a batch of texts with the same parameters."""
    return [clean_text(t, **kwargs) for t in texts]
