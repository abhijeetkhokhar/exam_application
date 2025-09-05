# Student Exam App (Student Module Only)

Functional student-side exam-taking application.

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose)

## Features

- User registration and login (JWT authentication)
- Start Exam: fetch randomized MCQs from backend
- MCQ UI with next/previous navigation and persistence of selected answers
- 30-minute countdown timer; auto-submits on expiry
- Submit exam: backend evaluates and returns score
- Result page: shows score/total and per-question correctness (no correct answers exposed)

## Project Structure

- `server/` — Express API, MongoDB models, routes, seed script
- `client/` — React app with pages, contexts, and Tailwind CSS

## Setup

### Prerequisites

- Node 18+
- MongoDB running locally (or provide a connection string)

### Backend

1. Create server env (already added by scaffolding):

```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

2. Install dependencies (already installed):

```
cd server
npm i
```

3. Seed sample questions (WARNING: deletes and re-inserts questions):

```
npm run seed
```

4. Run server (dev):

```
npm run dev
```

API base URL: `http://localhost:4000`

### Frontend

1. Configure API URL (optional; defaults to `http://localhost:4000`):

- Create `client/.env.local` with:

```
VITE_API_URL=http://localhost:4000
```

2. Install and run:

```
cd client
npm i
npm run dev
```

Dev server: `http://localhost:5173`

## API Routes

- POST `/api/auth/register`

  - body: `{ email, username, password }`
  - 201: `{ id, email, username }`

- POST `/api/auth/login`

  - body: `{ email, password }`
  - 200: `{ accessToken }`

- GET `/api/exams/start?limit=N` (JWT)

  - returns `{ questions: [{ _id, questionText, options: [{id,text}], marks }] }`
  - No `correctOptionId` in response

- POST `/api/exams/submit` (JWT)
  - body: `{ answers: [{ questionId, optionId }] }`
  - returns `{ score, total, breakdown: [{ questionId, selectedOptionId, correct }] }`

## Frontend Pages

- `/register` — account creation
- `/login` — obtain JWT token
- `/exam/start` — choose limit and start exam
- `/exam/take` — MCQ UI with navigation and timer, auto-submit on 0
- `/exam/result` — result summary

## Security Notes & Assumptions

- JWT stored in memory/sessionStorage via `AuthContext` on the client for simplicity
- Exam routes require `Authorization: Bearer <token>`
- Correct answers never sent to client; only evaluated on server
- Seed script performs destructive re-seeding of the `questions` collection
- CORS restricted to `CLIENT_ORIGIN`

## Demo Flow

1. Start backend: `cd server && npm run dev`
2. Seed questions once: `npm run seed` (in `server/`)
3. Start frontend: `cd client && npm run dev`
4. Visit `http://localhost:5173`, Register, Login, Start Exam, Take Exam, Submit, View Result
# exam_module
