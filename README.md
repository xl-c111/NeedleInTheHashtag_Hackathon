# been there

> **Peer support platform connecting people to authentic recovery stories**
>
> Real human experiences, not AI therapy. Because one authentic story from someone who's "been there" is worth more than 100 AI-generated responses.

**Built for the eSafety Hackathon - "Needle in the Hashtag"**
- 🗓️ Hackathon: Nov 29-30, 2025 | Stone & Chalk, Melbourne
- 📅 Submission: Dec 5, 11:59pm
- 🎤 Pitch Day: Dec 11
- 🎯 Theme: 16 Days of Activism Against Gender-Based Violence

---

## 🎯 The Problem

**Online radicalization and echo chambers increase misogyny and correlate with gender-based violence**

Young men struggling with loneliness, relationships, or self-esteem often find online communities that start as support groups but become toxic echo chambers. These spaces reinforce harmful beliefs and research links them to higher rates of domestic violence and gender-based violence.

## 💡 Our Solution

**been there** matches users struggling with difficult issues to authentic mentor posts from people who have overcome similar challenges.

**Key Differentiators:**
- ✅ **Real human stories** from recovered community members
- ✅ **AI-powered matching** (not AI-generated advice)
- ✅ **Diverse perspectives** to break echo chambers
- ✅ **Anonymous & stigma-free** environment
- ✅ **Scalable peer support** (one story helps thousands)

## 📱 60-Second Demo Flow

1. **User types their struggles** (loneliness, relationships, self-esteem)
2. **AI chat helps articulate feelings** (compassionate listening)
3. **Matched with relevant mentor stories** (semantic similarity)
4. **Like/favorite content** they resonate with
5. **Explore diverse perspectives** (different genders/backgrounds)
6. **Write in private diary** to track their journey
7. **Access professional resources** for next steps

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (Python/FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API runs on http://localhost:8000
```

## 📁 Project Structure

```
been-there/
├── frontend/               # Next.js web application
│   ├── app/               # Pages: /, /chat, /stories, /diary, /write, /resources
│   ├── components/        # React components (Auth, Chat, Stories, Header, etc.)
│   └── lib/               # Supabase client, types, utilities
├── backend/               # FastAPI backend
│   ├── services/          # AI services (chat, matcher, moderator)
│   ├── scripts/           # Data fetching and embeddings generation
│   └── schema_*.sql       # Database schemas
├── docs/                  # Documentation
│   ├── HACKATHON_CONTEXT.md
│   ├── PITCH_GUIDE.md
│   ├── DATABASE_SCHEMA.md
│   └── ...
└── data/                  # Training data and seed content
```

## 🛠️ Tech Stack

### Frontend
| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI |
| Animations | Motion 12 |
| Database | Supabase (PostgreSQL + Auth) |
| Theme | next-themes (dark mode) |

### Backend
| Category | Technology |
|----------|------------|
| Framework | FastAPI (Python) |
| AI/ML | sentence-transformers, scikit-learn |
| LLM API | OpenRouter (Gemini 2.0 Flash) |
| Database | Supabase (PostgreSQL) |

## ✨ Features

### Implemented ✅
- **AI Chat Interface** - Compassionate AI helps users articulate feelings (OpenRouter API)
- **Story Browsing** - Curated mentor posts with theme-based filtering
- **Story Detail Pages** - Full stories with related content suggestions
- **Authentication** - Supabase Auth with anonymous sign-in option
- **Dark Mode** - Theme toggle with system preference detection
- **Responsive Design** - Mobile-first, works on all devices
- **Protected Routes** - Middleware-based authentication

### In Progress ⚠️
- **Semantic Matching** - AI-powered story matching (backend ready, needs embeddings)
- **Diary Feature** - Private journaling (UI complete, Supabase integration needed)
- **Like/Favorite** - Save favorite stories (schema designed, not implemented)

### Planned 📋
- **Professional Resources** - Crisis hotlines, therapy services, self-help content
- **Content Moderation** - AI-powered safety classification
- **Mood Tracking** - Visualize emotional progress over time

## 🔧 Environment Setup

Create a `.env.local` file in the `frontend/` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Create a `.env` file in the `backend/` directory:

```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
OPENROUTER_API_KEY=your-openrouter-key
```

## 📚 Documentation

- **[Hackathon Context](docs/HACKATHON_CONTEXT.md)** - Event details, timeline, challenges
- **[Pitch Guide](docs/PITCH_GUIDE.md)** - Presentation script and tips
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Supabase tables and RLS policies
- **[Design System](docs/DESIGN.md)** - Product design and user personas
- **[Development Guide](docs/DEVELOPMENT.md)** - Component patterns and setup
- **[Technical Approaches](docs/TECHNICAL_APPROACHES.md)** - AI/ML strategies

For complete documentation, see the [`docs/`](docs/) directory.

## 📞 Crisis Support

If you or someone you know is in crisis, please reach out:

**Australia:**
- **Lifeline**: 13 11 14 (24/7 crisis support)
- **Beyond Blue**: 1300 22 4636 (mental health support)
- **MensLine Australia**: 1300 78 99 78 (men's support line)
- **Emergency**: 000

**International:**
- See [findahelpline.com](https://findahelpline.com) for resources in your country

---

## 🤝 Contributing

This project was built during the eSafety Hackathon (Nov 29-30, 2025). Post-hackathon contributions welcome!

## 📄 License

Built with care for the eSafety Hackathon - Making online spaces safer together 🛡️

**Theme**: 16 Days of Activism Against Gender-Based Violence
