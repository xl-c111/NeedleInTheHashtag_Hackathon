"""
Content Moderator Service

Classifies content as safe/risky using feature-based classification.
Based on hackathon Module 5 approach (Logistic Regression).

Used for:
1. Filtering mentor posts before display
2. Detecting concerning patterns in user input
3. Routing crisis situations to appropriate resources
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import pickle
from pathlib import Path
from typing import Optional


class ContentModerator:
    """
    Classifies content as safe/risky using hackathon training data.

    Usage:
        moderator = ContentModerator()
        moderator.train('data/competition_train.jsonl')
        moderator.save('models/moderator.pkl')

        # Later:
        moderator.load('models/moderator.pkl')
        result = moderator.predict("some text to check")
        # result = {'is_risky': True, 'risk_score': 0.73, 'confidence': 0.73}
    """

    # Labels considered "safe" (everything else is "risky")
    SAFE_LABELS = ['benign', 'recovery_support', 'normal']

    # Features to extract from text
    FEATURE_NAMES = [
        'word_count',
        'char_count',
        'avg_word_length',
        'exclamation_count',
        'question_count',
        'caps_ratio',
        'sentence_count',
        'avg_sentence_length',
    ]

    def __init__(self):
        self.model: Optional[Pipeline] = None
        self.is_trained = False

    def extract_features(self, text: str) -> dict:
        """
        Extract numeric features from a single text.

        These are the features the classifier uses to make predictions.
        """
        if not isinstance(text, str):
            text = str(text) if text else ""

        # Basic counts
        words = text.split()
        word_count = len(words)
        char_count = len(text)

        # Word statistics
        avg_word_length = char_count / max(word_count, 1)

        # Punctuation
        exclamation_count = text.count('!')
        question_count = text.count('?')

        # Capitalization
        alpha_chars = [c for c in text if c.isalpha()]
        caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / max(len(alpha_chars), 1)

        # Sentence statistics
        sentences = [s.strip() for s in text.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        sentence_count = len(sentences)
        avg_sentence_length = word_count / max(sentence_count, 1)

        return {
            'word_count': word_count,
            'char_count': char_count,
            'avg_word_length': avg_word_length,
            'exclamation_count': exclamation_count,
            'question_count': question_count,
            'caps_ratio': caps_ratio,
            'sentence_count': sentence_count,
            'avg_sentence_length': avg_sentence_length,
        }

    def _extract_features_batch(self, texts: list) -> np.ndarray:
        """Extract features from multiple texts."""
        features_list = [self.extract_features(t) for t in texts]
        features_df = pd.DataFrame(features_list)
        return features_df[self.FEATURE_NAMES].values

    def train(self, train_data_path: str) -> dict:
        """
        Train the moderator on hackathon data.

        Args:
            train_data_path: Path to competition_train.jsonl

        Returns:
            dict with training metrics
        """
        print(f"Loading training data from {train_data_path}")

        # Load training data
        if train_data_path.endswith('.jsonl'):
            df = pd.read_json(train_data_path, lines=True)
        elif train_data_path.endswith('.csv'):
            df = pd.read_csv(train_data_path)
        else:
            raise ValueError(f"Unsupported file format: {train_data_path}")

        df['content'] = df['content'].fillna("").astype(str)

        print(f"Loaded {len(df)} examples")
        if 'label' in df.columns:
            print(f"Label distribution:\n{df['label'].value_counts()}")

        # Extract features
        print("\nExtracting features...")
        X = self._extract_features_batch(df['content'].tolist())

        # Create binary label (safe vs risky)
        if 'label' in df.columns:
            df['is_risky'] = (~df['label'].isin(self.SAFE_LABELS)).astype(int)
        else:
            # If no labels, use simple heuristics for demo
            print("⚠ No labels found, using demo mode with heuristics")
            df['is_risky'] = 0  # Default to safe

        y = df['is_risky'].values

        print(f"Class balance: {(y == 0).sum()} safe, {(y == 1).sum()} risky")

        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None
        )

        print(f"Training set: {len(X_train)}, Validation set: {len(X_val)}")

        # Train logistic regression model
        print("\nTraining Logistic Regression model...")

        self.model = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', LogisticRegression(
                class_weight='balanced',
                max_iter=1000,
                random_state=42
            ))
        ])

        self.model.fit(X_train, y_train)
        self.is_trained = True

        # Evaluate
        y_pred = self.model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)

        print(f"\nTraining complete!")
        print(f"Validation accuracy: {accuracy:.3f}")
        if len(np.unique(y)) > 1:
            print("\nClassification Report:")
            print(classification_report(y_val, y_pred, target_names=['safe', 'risky']))

        return {
            'accuracy': accuracy,
            'model_type': 'logistic_regression'
        }

    def predict(self, text: str) -> dict:
        """
        Predict if text is risky.

        Args:
            text: Text to classify

        Returns:
            dict with:
            - is_risky: bool
            - risk_score: float (0-1, probability of being risky)
            - confidence: float (0-1, how confident the model is)
        """
        if self.model is None:
            # Return safe default if not trained
            return {
                'is_risky': False,
                'risk_score': 0.0,
                'confidence': 0.5
            }

        features = self.extract_features(text)
        X = np.array([[features[col] for col in self.FEATURE_NAMES]])

        probabilities = self.model.predict_proba(X)[0]
        risk_score = float(probabilities[1])  # Probability of risky class

        return {
            'is_risky': risk_score > 0.5,
            'risk_score': risk_score,
            'confidence': max(risk_score, 1 - risk_score)
        }

    def predict_batch(self, texts: list[str]) -> list[dict]:
        """Predict for multiple texts."""
        return [self.predict(text) for text in texts]

    def save(self, filepath: str):
        """Save trained model to disk."""
        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)

        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'feature_names': self.FEATURE_NAMES,
                'safe_labels': self.SAFE_LABELS
            }, f)

        print(f"Saved model to {filepath}")

    def load(self, filepath: str):
        """Load trained model from disk."""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)

        self.model = data['model']
        self.is_trained = True

        print(f"Loaded logistic regression model from {filepath}")
