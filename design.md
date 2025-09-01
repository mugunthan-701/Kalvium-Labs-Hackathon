Low-Level Design (LLD) for AI-Powered MCQ Assessment System
1. Overview
This system is a quiz-based MCQ assessment platform enhanced with Google Gemini AI (via @google/generative-ai SDK). It provides real-time evaluation, feedback, explanations, performance summaries, and personalized notes. The system integrates a React frontend, a Node.js/Express backend, and a PostgreSQL database for persistence.

2. Tech Stack
Frontend:


React 18


Tailwind CSS (UI)


React Router DOM (navigation)


Axios (API communication)


Backend:


Node.js + Express


@google/generative-ai SDK for Gemini API calls


REST APIs for quiz sessions, responses, and summaries


Database:


PostgreSQL (user progress, responses, notes, summaries)


Deployment:


Frontend: Vercel / Netlify


Backend: Render / Railway / AWS Lambda


DB: Supabase / AWS RDS



3. Functional Modules
(Same as your draft but with AI and API detail)
3.1 User Module
Handles registration, login (JWT-based auth).


Tracks quiz history and weak areas.


3.2 Assessment Module
Retrieves questions from DB.


Manages session state (currentQuestionIndex, responses[]).


3.3 AI Evaluation Module (Gemini Integration)
Uses @google/generative-ai to evaluate answers.


Prompting strategy:

 You are an expert tutor. Evaluate the user’s answer to the following MCQ. 
Provide: 
1. isCorrect (true/false) 
2. Explanation (why correct/incorrect) 
3. If correct → provide an interesting additional fact. 
4. If incorrect → provide mistake analysis and improvement tips.  


Returns structured JSON for frontend rendering.


3.4 Feedback & Explanations Module
Displays Gemini’s explanation, facts, tips.


Stores responses in DB with AI feedback.


3.5 Summary & Analytics Module
Aggregates responses → correct/incorrect counts.


Calls Gemini again for summary + recommendations.


3.6 Notes Generation Module
Calls Gemini with weak topics → generates short revision notes.



4. API Design
REST Endpoints
POST /api/auth/login → JWT token


POST /api/assessment/start → Start new quiz session


POST /api/assessment/:id/submit → Submit answer → Calls Gemini AI


GET /api/assessment/:id/summary → Get quiz summary


GET /api/notes/:userId/:topic → AI-generated notes



5. Data Flow (with AI Integration)
User selects an option in React frontend (AnswerOption).


onSelect() → sends POST request to backend (/assessment/:id/submit).


Backend calls GeminiAIService.evaluate(answer, question) using SDK.


Gemini returns structured JSON (isCorrect, explanation, facts/tips).


Response saved in DB and sent back to frontend.


Frontend shows ✓ or ✗ with AI feedback.


On completion, backend calls GeminiAIService.summarize() to generate summary + notes.



6. Class Design (Backend)
class User {
  id; name; email; progress;
  getWeakAreas();
}

class Question {
  id; stem; options[]; correctOption; module;
}

class AssessmentSession {
  id; userId; questionIds[]; responses[]; startTime; endTime;
  start(); submitAnswer(); getSummary();
}

class Response {
  id; questionId; selectedOption; isCorrect;
  explanation; additionalFact; mistakeAnalysis; improvementTips;
  timestamp;
}

class GeminiAIService {
  async evaluate(question, userAnswer);
  async summarize(responses);
  async generateShortNotes(topics);
}


7. Frontend Integration
State Management (React Hooks):


currentQuestionIndex


selectedAnswer


quizResults[] (responses with AI feedback)


UI Components:


Header.js → Progress bar + question number


AnswerOption.js → Option button + AI feedback UI


QuestionsPage.js → Fetches from API and renders question


SummaryPage.js → Displays AI summary + notes


API Calls (Axios):

 const submitAnswer = async (sessionId, questionId, answer) => {
  const res = await axios.post(`/api/assessment/${sessionId}/submit`, { questionId, answer });
  return res.data; // includes AI explanation
};



8. Database Schema
users(id, name, email, password_hash, progress)
questions(id, stem, options jsonb, correct_option, module)
assessment_sessions(id, user_id, start_time, end_time)
responses(id, session_id, question_id, selected_option, is_correct, 
          explanation, additional_fact, mistake_analysis, improvement_tips, timestamp)
notes(id, user_id, module, text, generated_at)


9. Example AI Feedback
(Same as your draft but structured JSON)
{
  "isCorrect": false,
  "explanation": "Berlin is the capital of Germany. Paris is the capital of France.",
  "mistakeAnalysis": "Confused European capitals.",
  "improvementTips": "Review European geography maps."
}


10. Design Principles
SOLID & modular AI service integration.


Frontend-backend separation with REST APIs.


AI calls abstracted in GeminiAIService.


Persistent storage for audit and personalized analytics.

