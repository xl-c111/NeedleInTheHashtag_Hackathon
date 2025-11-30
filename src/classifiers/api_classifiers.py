"""
API wrappers for content classification services.
Supports: OpenAI, Anthropic, Perspective API
"""

import os
import json
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv

load_dotenv()


class PerspectiveAPI:
    """
    Wrapper for Google's Perspective API.
    Free tier: 1 query per second.
    
    Setup:
    1. Go to https://developers.perspectiveapi.com/
    2. Request API access
    3. Create a Google Cloud project and enable the API
    4. Create an API key
    """
    
    ATTRIBUTES = [
        'TOXICITY',
        'SEVERE_TOXICITY', 
        'IDENTITY_ATTACK',
        'INSULT',
        'PROFANITY',
        'THREAT',
        # Experimental attributes
        'SEXUALLY_EXPLICIT',
        'FLIRTATION',
    ]
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found. Set it in .env or pass directly.")
        
        self.endpoint = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'
    
    def analyze(self, text: str, 
                attributes: Optional[List[str]] = None,
                languages: List[str] = ['en']) -> Dict[str, float]:
        """
        Analyze text for toxicity and other attributes.
        
        Args:
            text: Text to analyze
            attributes: List of attributes to check (default: TOXICITY only)
            languages: Language codes
        
        Returns:
            Dict mapping attribute names to scores (0-1)
        """
        import requests
        
        if attributes is None:
            attributes = ['TOXICITY']
        
        # Build request
        requested_attributes = {attr: {} for attr in attributes}
        
        payload = {
            'comment': {'text': text},
            'languages': languages,
            'requestedAttributes': requested_attributes
        }
        
        response = requests.post(
            f"{self.endpoint}?key={self.api_key}",
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"Perspective API error: {response.text}")
        
        result = response.json()
        
        # Extract scores
        scores = {}
        for attr in attributes:
            if attr in result.get('attributeScores', {}):
                scores[attr] = result['attributeScores'][attr]['summaryScore']['value']
        
        return scores
    
    def batch_analyze(self, texts: List[str], 
                      attributes: Optional[List[str]] = None,
                      delay: float = 1.0) -> List[Dict[str, float]]:
        """
        Analyze multiple texts (with rate limiting).
        
        Args:
            texts: List of texts to analyze
            attributes: Attributes to check
            delay: Seconds between requests (default 1.0 for free tier)
        
        Returns:
            List of score dicts
        """
        import time
        from tqdm import tqdm
        
        results = []
        for text in tqdm(texts, desc="Analyzing with Perspective API"):
            try:
                scores = self.analyze(text, attributes)
                results.append(scores)
            except Exception as e:
                print(f"Error: {e}")
                results.append({})
            time.sleep(delay)
        
        return results


class LLMClassifier:
    """
    Use LLMs (OpenAI/Anthropic) for flexible text classification.
    """
    
    def __init__(self, provider: str = 'openai', model: Optional[str] = None):
        """
        Args:
            provider: 'openai' or 'anthropic'
            model: Model name (defaults to gpt-4o-mini or claude-3-haiku)
        """
        self.provider = provider
        
        if provider == 'openai':
            from openai import OpenAI
            self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            self.model = model or 'gpt-4o-mini'
        elif provider == 'anthropic':
            from anthropic import Anthropic
            self.client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
            self.model = model or 'claude-3-haiku-20240307'
        else:
            raise ValueError(f"Unknown provider: {provider}")
    
    def classify(self, text: str, 
                 categories: List[str],
                 system_prompt: Optional[str] = None,
                 return_reasoning: bool = False) -> Dict[str, Any]:
        """
        Classify text into one or more categories.
        
        Args:
            text: Text to classify
            categories: List of possible categories
            system_prompt: Custom system prompt (optional)
            return_reasoning: Include LLM's reasoning in response
        
        Returns:
            Dict with 'category' (or 'categories'), 'confidence', and optionally 'reasoning'
        """
        
        default_prompt = f"""You are a content classifier. Analyze the given text and classify it into one of these categories:
{', '.join(categories)}

Respond in JSON format:
{{
    "category": "chosen_category",
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation"
}}

Only respond with valid JSON."""

        prompt = system_prompt or default_prompt
        
        if self.provider == 'openai':
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": f"Classify this text:\n\n{text}"}
                ],
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            
        elif self.provider == 'anthropic':
            response = self.client.messages.create(
                model=self.model,
                max_tokens=500,
                system=prompt,
                messages=[
                    {"role": "user", "content": f"Classify this text:\n\n{text}"}
                ]
            )
            # Parse JSON from response
            content = response.content[0].text
            # Try to extract JSON
            try:
                result = json.loads(content)
            except:
                # Try to find JSON in response
                import re
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    result = json.loads(json_match.group())
                else:
                    result = {"category": "unknown", "confidence": 0, "error": "Could not parse response"}
        
        if not return_reasoning and 'reasoning' in result:
            del result['reasoning']
        
        return result
    
    def classify_persona(self, text: str) -> Dict[str, Any]:
        """
        Classify text into hackathon-specific personas.
        """
        personas = [
            "body_dysmorphia",      # Negative body image, eating disorder indicators
            "incel",                 # Incel/manosphere language
            "linkedin_lunatic",      # Over-the-top professional posting
            "normal",                # Regular social media user
            "toxic_general",         # Generally toxic but no specific persona
            "other"                  # Doesn't fit other categories
        ]
        
        system_prompt = """You are an expert at identifying online personas and concerning content patterns.

Analyze the given social media post and classify it into ONE of these categories:

1. body_dysmorphia - Posts showing signs of body image issues, eating disorder language, extreme diet/exercise obsession, negative self-body talk
2. incel - Posts using incel/manosphere terminology, expressing entitlement regarding relationships, hostility toward women, "blackpill" ideology
3. linkedin_lunatic - Over-the-top professional humble-brags, "agree?" endings, inspirational stories with forced business lessons, excessive positivity
4. normal - Regular social media content without concerning patterns
5. toxic_general - Clearly harmful content but doesn't fit specific personas above
6. other - Unclear or doesn't fit categories

Respond in JSON:
{
    "category": "category_name",
    "confidence": 0.0-1.0,
    "indicators": ["list", "of", "specific", "indicators", "found"],
    "reasoning": "brief explanation"
}"""

        return self.classify(text, personas, system_prompt=system_prompt, return_reasoning=True)


class EmbeddingClassifier:
    """
    Use embeddings for similarity-based classification.
    Good for clustering similar messages together.
    """
    
    def __init__(self, model: str = 'all-MiniLM-L6-v2'):
        """
        Args:
            model: Sentence-transformers model name
        """
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model)
    
    def embed(self, texts: List[str]) -> Any:
        """Get embeddings for texts."""
        return self.model.encode(texts, show_progress_bar=True)
    
    def find_similar(self, query: str, corpus: List[str], top_k: int = 5) -> List[tuple]:
        """
        Find most similar texts in corpus.
        
        Returns:
            List of (text, similarity_score) tuples
        """
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
        
        query_embedding = self.model.encode([query])
        corpus_embeddings = self.model.encode(corpus)
        
        similarities = cosine_similarity(query_embedding, corpus_embeddings)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        return [(corpus[i], similarities[i]) for i in top_indices]
    
    def cluster(self, texts: List[str], n_clusters: int = 5) -> List[int]:
        """
        Cluster texts into groups.
        
        Returns:
            List of cluster labels
        """
        from sklearn.cluster import KMeans
        
        embeddings = self.embed(texts)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        labels = kmeans.fit_predict(embeddings)
        
        return labels.tolist()
