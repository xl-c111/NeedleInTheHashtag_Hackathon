# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base

# System setup
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install Python dependencies first (better layer caching)
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application code
COPY backend /app

# Expose FastAPI port
EXPOSE 8000

# Optional: set model paths via env at runtime if needed
# ENV EMBEDDINGS_PATH=/app/data/processed/mentor_embeddings.pkl
# ENV MODERATOR_PATH=/app/models/moderator.pkl

# Start the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
