# ⚡ AI Flashcard Generator

A full-stack MERN application that uses OpenAI GPT-3.5 to automatically generate flashcards from study material, featuring an AI Study Agent with function calling, quiz mode, review mode, and progress tracking.

---

## 🚀 Features

- **✨ AI Flashcard Generation** — Paste any text; get instant, focused flashcards
- **🤖 AI Study Agent** — 5-tool agent powered by GPT-3.5 function calling:
  - ⚡ Flashcard Generator
  - 📝 Note Summarizer
  - 🔬 Concept Explainer
  - 🎯 Quiz Question Creator
  - 📅 Study Plan Generator
- **🃏 Review Mode** — Animated flip cards, shuffle, filter by learned status
- **🎯 Quiz Mode** — AI-generated MCQs with score tracking & explanations
- **📊 Dashboard** — Statistics, mastery rate, search, manage all sets
- **🔒 Auth** — JWT authentication, bcrypt password hashing, protected routes
- **🎨 UI** — Glassmorphism dark mode, Framer Motion animations, fully responsive

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenAI GPT-3.5, Function Calling |
| Security | Helmet, CORS, Rate Limiting, express-validator |

---

## 📁 Project Structure

```
AI-Flashcard-Generator/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── agent/             # AgentMessage
│   │   │   ├── flashcards/        # FlipCard, FlashcardSetCard
│   │   │   ├── quiz/              # QuizQuestion, QuizResults
│   │   │   └── ui/                # Navbar, Spinner, Modal, StatCard
│   │   ├── context/               # AuthContext, ThemeContext
│   │   ├── hooks/                 # useFlashcards
│   │   ├── pages/                 # All page components
│   │   ├── services/              # Axios API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                        # Node.js backend
    ├── agents/                    # studyAgent.js (function calling)
    ├── config/                    # db.js
    ├── controllers/               # authController, flashcardController, etc.
    ├── middleware/                 # auth, errorHandler, validate
    ├── models/                    # User, FlashcardSet, QuizResult
    ├── routes/                    # auth, flashcards, quiz, ai
    ├── services/                  # openaiService.js
    ├── tests/                     # api.test.js
    ├── utils/                     # jwt.js
    └── server.js
```

---

## ⚙️ Environment Setup

### Backend — `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_flashcards
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend — `client/.env` (optional)
```env
VITE_API_URL=http://localhost:5000/api
```
> **Note:** Vite is pre-configured to proxy `/api` requests to `localhost:5000` — no `.env` file needed for local dev.

---

## 🔧 Installation & Running

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API Key

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd AI-Flashcard-Generator

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
# In server/
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, OPENAI_API_KEY
```

### 3. Run the backend

```bash
cd server
npm run dev
# Server runs at http://localhost:5000
```

### 4. Run the frontend

```bash
cd client
npm run dev
# App runs at http://localhost:5173
```

---

## 🗄️ Database Schema

### Users
```js
{
  name: String,          // required, 2-50 chars
  email: String,         // required, unique
  password: String,      // hashed with bcrypt (12 rounds)
  createdAt: Date
}
```

### FlashcardSets
```js
{
  userId: ObjectId,      // ref: User
  title: String,         // required, max 100
  description: String,
  cards: [{
    question: String,    // required
    answer: String,      // required
    learned: Boolean     // default: false
  }],
  tags: [String],
  subject: String,
  createdAt: Date,
  updatedAt: Date
}
```

### QuizResults
```js
{
  userId: ObjectId,
  flashcardSetId: ObjectId,
  setTitle: String,
  score: Number,
  totalQuestions: Number,
  percentage: Number,    // auto-calculated
  answers: [{
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  createdAt: Date
}
```

---

## 📡 API Documentation

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | 🔒 |
| PUT | `/api/auth/profile` | Update profile | 🔒 |

### Flashcards
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/flashcards` | Get all sets (search, paginate) | 🔒 |
| POST | `/api/flashcards` | Create set | 🔒 |
| GET | `/api/flashcards/stats` | Get user stats | 🔒 |
| GET | `/api/flashcards/:id` | Get single set | 🔒 |
| PUT | `/api/flashcards/:id` | Update set | 🔒 |
| DELETE | `/api/flashcards/:id` | Delete set | 🔒 |
| PATCH | `/api/flashcards/:id/cards/:cardId` | Update card learned | 🔒 |

### AI
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/ai/generate` | Generate flashcards from text | 🔒 |
| POST | `/api/ai/quiz/:setId` | Generate MCQ quiz | 🔒 |
| POST | `/api/ai/summarize` | Summarize notes | 🔒 |
| POST | `/api/ai/explain` | Explain concept | 🔒 |
| POST | `/api/ai/agent` | AI Study Agent chat | 🔒 |

### Quiz
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/quiz/results` | Save quiz result | 🔒 |
| GET | `/api/quiz/results` | Get user results | 🔒 |
| GET | `/api/quiz/stats` | Get quiz statistics | 🔒 |

---

## 🧪 Testing

```bash
cd server
npm test
```

Tests cover: registration, login, auth protection, flashcard CRUD, stats endpoint, health check.

---


---

## 🤖 AI Agent Architecture

The agent uses OpenAI's function calling to route user requests to the correct tool:

```
User Message
     ↓
GPT-3.5 (tool_choice: auto)
     ↓
Selects tool based on intent
     ↓
Executes tool (generate/summarize/explain/quiz/plan)
     ↓
GPT-3.5 formulates final response with tool result
     ↓
Structured response to client
```

---

## 📄 License

MIT © 2025 AI Flashcard Generator
