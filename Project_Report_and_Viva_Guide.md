# AI-Based Career Counselling and Aptitude Analysis System
## Complete Project Report & Viva Guide

---

## Project Overview

**Project Title:** AI-Based Career Counselling and Aptitude Analysis System
**Technology Stack:** MongoDB, Express.js, React.js, Node.js (MERN)
**Target Users:** Indian students (Class 10 onwards)
**Purpose:** Help students make informed career decisions based on real aptitude data

---

## System Architecture

Frontend (React+Vite) on port 5173
  -> HTTP via Axios ->
Backend (Express.js) on port 5001
  -> Mongoose ODM ->
MongoDB on port 27017 (Collections: users, questions, careers, results)

---

## Authentication System

Email/Password Flow:
1. Signup - User enters name, email, password
2. Password hashed using bcrypt (10 salt rounds)
3. Login - bcrypt.compare(entered, stored_hash)
4. Server returns JWT Token (30 days) containing {id: user._id}
5. Frontend stores in localStorage under key "profile"
6. Every API call sends Authorization: Bearer <token>
7. authMiddleware.js verifies via jwt.verify()

Google OAuth Flow:
1. useGoogleLogin from @react-oauth/google opens popup
2. On success, frontend gets access_token
3. Calls googleapis.com/oauth2/v3/userinfo
4. Posts {name, email, googleId} to /api/auth/google-access
5. Backend creates/finds user, returns our JWT

Protected Routes (require valid JWT):
- GET /api/tests
- POST /api/tests
- GET /api/tests/history

---

## Aptitude Test & Career Matching Engine

Categories (12 total, 3 per category):
- Logical: sequences, patterns, deduction
- Analytical: numerical reasoning, data problems
- Verbal: grammar, antonyms, comprehension
- Technical: DSA, databases, CS fundamentals

Scoring Formula:
  Normalized Score = (correct / total_in_category) x 100   [0 to 100%]
  Career Match %  = Sum( NormalizedScore[cat] x Career.weights[cat] )

Example - Software Engineer:
  Weights: {Logical:0.30, Analytical:0.10, Verbal:0.05, Technical:0.55}
  User:    Logical=100%, Analytical=67%, Verbal=33%, Technical=100%
  Match  = (100x0.30)+(67x0.10)+(33x0.05)+(100x0.55) = 93%

Top 3 careers by match % are returned as recommendations.

---

## Data Models

User: { name, email, password(bcrypt), googleId, role }
Career: { title, description, salary{fresher,experienced}, futureScope, skills[], tools[], roadmap[{step,description}], weights{Logical,Analytical,Verbal,Technical} }
Question: { questionText, options[], correctAnswer, category, explanation }
Result: { user, scores{L,A,V,T}, matches[{careerId,career,matchPercentage,reasoning}], recommendedCareers[] }

---

## Project File Structure

backend/
  controllers/ authController.js, testController.js, careerController.js
  middleware/  authMiddleware.js, errorMiddleware.js
  models/      User.js, Career.js, Question.js, Result.js
  routes/      authRoutes.js, testRoutes.js, careerRoutes.js
  seed.js, server.js, .env

frontend/src/
  pages/  Login.jsx, Signup.jsx, Test.jsx, Dashboard.jsx, Explore.jsx, CareerDetails.jsx
  components/ AIChatbot.jsx, CommentSection.jsx
  context/ ThemeContext.jsx
  App.jsx, api.js, main.jsx

---

## API Endpoints

POST   /api/auth/register        - Create account
POST   /api/auth/login           - Email/password login
POST   /api/auth/google-access   - Google OAuth login
GET    /api/tests         [JWT]  - Fetch 12 random questions
POST   /api/tests         [JWT]  - Submit answers, get results
GET    /api/tests/history [JWT]  - Fetch past test results
GET    /api/careers               - Get all 22 careers
GET    /api/careers/:id           - Get career by MongoDB ID

---

## How to Run

Requirements: Node.js v18+, MongoDB running, npm

Backend:
  cd career-guidance-system/backend
  npm install
  node seed.js    <- Run once to seed database
  npm start       <- Starts on port 5001

Frontend:
  cd career-guidance-system/frontend
  npm install
  npm run dev     <- Starts on port 5173

Open: http://localhost:5173

---

## Viva Questions & Answers

Q1: What is MERN stack?
A: MongoDB+Express+React+Node.js. Full JavaScript stack. MongoDB stores data as JSON docs. React gives reactive UI. Node.js handles non-blocking server operations.

Q2: How does career matching work?
A: Each career has a weight vector. User raw scores are normalized to 0-100%. Match% = dot product of scores and weights. Top 3 careers by score are recommended.

Q3: How is password stored securely?
A: bcryptjs with 10 salt rounds. Never stored as plaintext. Login uses bcrypt.compare() to check against stored hash.

Q4: What is JWT?
A: JSON Web Token. Server signs {id:userId} with JWT_SECRET. Frontend stores in localStorage. Each request includes Authorization: Bearer <token>. Middleware verifies with jwt.verify().

Q5: How does Google OAuth work?
A: useGoogleLogin gives access_token. Frontend fetches userinfo from Google. Posts name/email/googleId to backend. Backend finds/creates user and returns our JWT.

Q6: Authentication vs Authorization?
A: Authentication = who you are (JWT middleware). Authorization = what you can do (role-based: student vs admin).

Q7: Why bcrypt over MD5?
A: bcrypt is slow by design - brute force is expensive. MD5 is fast and vulnerable. bcrypt adds a random salt preventing rainbow table attacks.

Q8: What is Mongoose?
A: ODM for MongoDB in Node.js. Provides schema validation, type casting, pre-save hooks (used for bcrypt), and clean query API.

Q9: How does the timer work?
A: useEffect decrements timeLeft every second via setTimeout. When it hits 0, handleSubmit() auto-fires. Display: Math.floor(timeLeft/60) minutes and timeLeft%60 seconds.

Q10: What is the seed script for?
A: Populates MongoDB with 20+ questions and 22 careers. Uses collection.drop() first to prevent duplicates on re-run.

Q11: What is CORS?
A: Cross-Origin Resource Sharing. Frontend (5173) and backend (5001) are different origins. Browsers block cross-origin requests. cors npm package allows our frontend to access the backend.

Q12: How does PDF generation work?
A: jsPDF (dynamically imported). generatePDF() draws header, student info, category scores with progress bars, strength/weakness, top 3 career cards. Saves as Name_Career_Report.pdf.

Q13: What is React Suspense?
A: Pages use React.lazy() for code splitting. Suspense shows spinner while chunk loads. Improves initial load performance.

Q14: What chart library and type did you use?
A: Recharts - RadarChart (spider web chart) showing all 4 aptitude dimensions simultaneously.

Q15: How are questions randomized?
A: MongoDB $sample aggregation gets 3 random questions per category. Frontend shuffles combined array (Fisher-Yates) and shuffles answer options too.

Q16: What would you improve with more time?
A: 1) Real AI (Gemini API) for reasoning  2) Admin panel  3) Email OTP  4) Leaderboard  5) React Native mobile app

---

## Key Features

Email/Password Auth    - bcrypt + JWT, full validation
Google OAuth           - Access token flow
Aptitude Test (12 Qs) - 4 categories, timer, randomized
Career Matching        - Weighted dot product formula
22 Career Profiles     - Real India data from MongoDB
PDF Report             - jsPDF with scores and matches
Radar Chart Dashboard  - Recharts, strength/weakness
Career Directory       - Searchable, API-fed
Step-by-Step Roadmap   - From MongoDB per career
AI Career Chatbot      - 22-career knowledge base
Dark/Light Mode        - Persisted in localStorage
Protected Routes       - JWT middleware
Comment Section        - Per career page
Responsive Design      - Mobile + Desktop
