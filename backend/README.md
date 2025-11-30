# Backend API

FastAPI backend for the eSafety Hackathon.

## Quick Start

```bash
# From the backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

## API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/classify` | Classify single text |
| POST | `/api/classify/batch` | Classify multiple texts |
| POST | `/api/analyze/user` | Analyze user persona |
| GET | `/api/stats` | Get statistics |

See `docs/API_CONTRACT.md` for full details.

## Project Structure

```
backend/
├── main.py              # FastAPI app, routes
├── services/
│   └── classifier.py    # Classification logic
├── requirements.txt
└── README.md
```

## Key Files

- **main.py** — API routes and request handling
- **services/classifier.py** — Where classification logic lives

## Modifying Classification

To change how classification works, edit `services/classifier.py`:

1. Add new patterns to detect
2. Adjust scoring weights
3. Add new categories
4. Integrate LLM/API calls

## Environment Variables

Create a `.env` file if using APIs:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

## Testing

Quick test with curl:

```bash
# Health check
curl http://localhost:8000/api/health

# Classify text
curl -X POST http://localhost:8000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "I am HUMBLED to announce my promotion! Agree? 🚀"}'
```

## CORS

Frontend origins allowed by default:
- http://localhost:3000
- http://127.0.0.1:3000

Add more in `main.py` if needed.
