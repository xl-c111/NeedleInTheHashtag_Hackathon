"""
Classifier Service

Handles all classification logic. This is where the core ML/AI logic lives.
Modify this file to change how classification works.
"""

import re
from typing import Optional
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


class ClassifierService:
    """
    Service for classifying text and analyzing user personas.
    
    Currently uses keyword-based classification.
    Can be extended to use:
    - Perspective API
    - LLM classification (Claude, GPT)
    - Embeddings + similarity
    - Fine-tuned models
    """
    
    def __init__(self):
        """Initialize the classifier."""
        # TODO: Initialize any models, API clients here
        self.categories = [
            "linkedin_lunatic",
            "body_dysmorphia", 
            "incel",
            "toxic",
            "normal"
        ]
    
    def classify(self, text: str) -> dict:
        """
        Classify a single piece of text.
        
        Args:
            text: The text to classify
            
        Returns:
            dict with category, confidence, indicators, scores
        """
        text_lower = text.lower()
        scores = {cat: 0.0 for cat in self.categories}
        indicators = []
        
        # LinkedIn Lunatic patterns
        linkedin_patterns = [
            (r'agree\s*\??', 'agree?'),
            (r'thoughts\s*\??', 'thoughts?'),
            (r"i('m| am) (humbled|honored|blessed|grateful)", 'humbled/grateful'),
            (r'thought leader', 'thought leader'),
            (r'game.?changer', 'game-changer'),
            (r'excited to (announce|share)', 'excited to announce'),
            (r'dream job', 'dream job'),
        ]
        for pattern, indicator in linkedin_patterns:
            if re.search(pattern, text_lower):
                scores["linkedin_lunatic"] += 0.2
                indicators.append(indicator)
        
        # Check for emojis common in LinkedIn posts
        if re.search(r'🚀|💪|🙏|✨|🔥|💡|🎯', text):
            scores["linkedin_lunatic"] += 0.15
            indicators.append("professional emojis")
        
        # Body dysmorphia patterns
        body_patterns = [
            (r'hate my (body|face|looks)', 'negative body talk'),
            (r'(too|so) (fat|skinny|ugly)', 'negative self-description'),
            (r'(skipped?|skip(ping)?) (lunch|dinner|breakfast|meals?)', 'meal skipping'),
            (r'need to lose', 'weight loss focus'),
            (r'wish i (looked|was|could be)', 'appearance comparison'),
            (r'(counting|count) calories', 'calorie counting'),
            (r'(fasting|starving)', 'fasting mention'),
        ]
        for pattern, indicator in body_patterns:
            if re.search(pattern, text_lower):
                scores["body_dysmorphia"] += 0.25
                indicators.append(indicator)
        
        # Incel patterns
        incel_patterns = [
            (r'(women|females?|girls?) only want', 'gender generalization'),
            (r'(society|system|game) is rigged', 'system rigged'),
            (r'blackpill', 'blackpill'),
            (r'\bchad\b', 'chad reference'),
            (r'normie', 'normie'),
            (r'(everyone|they) reject', 'rejection focus'),
            (r"it'?s over\b", "it's over"),
        ]
        for pattern, indicator in incel_patterns:
            if re.search(pattern, text_lower):
                scores["incel"] += 0.25
                indicators.append(indicator)
        
        # General toxic patterns
        toxic_patterns = [
            (r'\b(hate|stupid|idiot|loser|pathetic)\b', 'toxic language'),
            (r'\b(kill|die|death)\b', 'violent language'),
        ]
        for pattern, indicator in toxic_patterns:
            if re.search(pattern, text_lower):
                scores["toxic"] += 0.15
                indicators.append(indicator)
        
        # Normalize scores
        total = sum(scores.values())
        if total > 0:
            scores = {k: min(v / max(total, 1), 1.0) for k, v in scores.items()}
        else:
            scores["normal"] = 1.0
        
        # Determine primary category
        primary_category = max(scores, key=scores.get)
        confidence = scores[primary_category]
        
        # If nothing detected strongly, it's probably normal
        if confidence < 0.3:
            primary_category = "normal"
            confidence = 1.0 - sum(v for k, v in scores.items() if k != "normal")
            scores["normal"] = confidence
        
        return {
            "text": text,
            "category": primary_category,
            "confidence": round(confidence, 3),
            "indicators": indicators,
            "scores": {k: round(v, 3) for k, v in scores.items()}
        }
    
    def classify_batch(self, texts: list[str]) -> list[dict]:
        """Classify multiple texts."""
        return [
            {
                "text": t,
                "category": r["category"],
                "confidence": r["confidence"]
            }
            for t, r in [(text, self.classify(text)) for text in texts]
        ]
    
    def analyze_user(self, user_id: str, messages: list[str]) -> dict:
        """
        Analyze all messages from a user to determine their persona.
        
        Aggregates individual message classifications to determine
        the user's primary persona and risk level.
        """
        if not messages:
            return {
                "user_id": user_id,
                "primary_persona": "unknown",
                "confidence": 0.0,
                "message_count": 0,
                "persona_breakdown": {},
                "risk_level": "low",
                "indicators": []
            }
        
        # Classify all messages
        classifications = [self.classify(msg) for msg in messages]
        
        # Aggregate scores
        aggregated_scores = {cat: 0.0 for cat in self.categories}
        all_indicators = []
        
        for c in classifications:
            for cat, score in c["scores"].items():
                aggregated_scores[cat] += score
            all_indicators.extend(c["indicators"])
        
        # Normalize
        total = sum(aggregated_scores.values())
        if total > 0:
            aggregated_scores = {k: v / total for k, v in aggregated_scores.items()}
        
        # Get primary persona
        primary_persona = max(aggregated_scores, key=aggregated_scores.get)
        confidence = aggregated_scores[primary_persona]
        
        # Determine risk level
        concerning_score = (
            aggregated_scores.get("body_dysmorphia", 0) +
            aggregated_scores.get("incel", 0) +
            aggregated_scores.get("toxic", 0)
        )
        
        if concerning_score > 0.6:
            risk_level = "critical"
        elif concerning_score > 0.4:
            risk_level = "high"
        elif concerning_score > 0.2:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        # Get unique indicators
        unique_indicators = list(set(all_indicators))[:10]  # Top 10
        
        return {
            "user_id": user_id,
            "primary_persona": primary_persona,
            "confidence": round(confidence, 3),
            "message_count": len(messages),
            "persona_breakdown": {k: round(v, 3) for k, v in aggregated_scores.items()},
            "risk_level": risk_level,
            "indicators": unique_indicators
        }


# ============== Optional: LLM-based classification ==============

class LLMClassifierService(ClassifierService):
    """
    Extended classifier that uses LLMs for uncertain cases.
    
    Uncomment and configure to use Claude or GPT for better accuracy.
    """
    
    def __init__(self, provider: str = "anthropic"):
        super().__init__()
        self.provider = provider
        # TODO: Initialize API client
        # from anthropic import Anthropic
        # self.client = Anthropic()
    
    def classify_with_llm(self, text: str) -> dict:
        """
        Use LLM for classification. More accurate but slower/costs money.
        
        TODO: Implement when API keys are available.
        """
        # Placeholder - implement based on your API access
        raise NotImplementedError("LLM classification not yet configured")
