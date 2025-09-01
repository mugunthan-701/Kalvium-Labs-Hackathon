# Combined Low-Level Design (LLD) for AI-Powered MCQ Assessment System
## 1. Overview
An MCQ-based assessment platform enhanced with GeminiAI for intelligent answer evaluation, detailed feedback with additional facts for correct answers, analysis of wrong answers, overall summary, and short study notes on weak topics. Backend supports fast deterministic scoring, explainability, and human-in-the-loop review for low-confidence results.
## 2. Functional Modules
### .1 User Module
Manages authentication and tracks progress.
### 2.2 Assessment Module
Manages quiz sessions, question retrieval, and answer submission.
### 2.3 Evaluation Module
Deterministic scoring.
GeminiAI integration for explanations, additional fact on correct answers, mistake analysis, improvement tips.
Outputs structured feedback with confidence scores.
### 2.4 Feedback & Explanations Module
Stores and delivers AI-generated explanation + additional fact (correct answers) or mistake analysis + improvement tips (incorrect).
### 2.5 Summary & Analytics Module
Compiles performance summaries, strengths/weaknesses, and improvement suggestions.
### 2.6 Notes Generation Module
Generates concise short notes for weak modules.

## 3. Class Design
User: id, name, email, progress, getWeakAreas()
Question: id, stem, options, correctOption, module, rubric, checkAnswer()
AssessmentSession: id, userId, questionIds, startTime, endTime, start(), submitAnswer(), getSummary()
Response: id, questionId, selectedOption, isCorrect, explanation, additionalFact, mistakeAnalysis, improvementTips, llmConfidence, timestamp
GeminiAIService: evaluate(answer, question, rubric) → full feedback JSON; summarize(responses), generateShortNotes(modules)
HITLService: flagLowConfidence(), adminOverride()
## . Data Flow
Answer submitted.
System scores deterministically.
If explanation needed, GeminiAI called with question, answer, rubric.
GeminiAI returns correctness, explanation, additional fact (if correct), mistake analysis and improvement (if incorrect), confidence.
Low-confidence flagged for HITL.
Feedback saved and returned.
Summaries and notes generated post-quiz.
## 5. AI Feedback Examples
Correct answer with fact (e.g., Paris declared capital in 987 AD).
Incorrect answer with analysis and improvement tips.
Full quiz summary with strengths/weaknesses.
Short topic-specific notes for revision.
## 6. Database Schema (simplified)
users(id, name, email, password_hash, progress)
questions(id, stem, options, correct_option, rubric, module)
assessment_sessions(id, user_id, start_time, end_time)
responses(id, assessment_id, question_id, selected_option, is_correct, explanation, additional_fact, mistake_analysis, improvement_tips, llm_confidence, timestamp)
notes(id, user_id, module, text, generated_at)
## 7. API Endpoints
POST /api/v1/assessments/start
POST /api/v1/assessments/{sessionId}/submit with user answer
GET /api/v1/assessments/{sessionId}/summary
GET /api/v1/notes/{userId}/{module}
POST /api/v1/hitl/override for admin overrides
## 8. LLM Integration
Use a structured prompt submitting question, options, rubric, and user answer, expecting a JSON output with verdict, explanation, additional facts, mistake analysis, improvement tips, confidence.
## 9. Design Principles
SOLID and modular design, good separation of concerns, maintainable code, thorough feedback persistence, and safety via HITL for low-confidence AI feedback.
## 10. MVP Roadmap
Setup backend, deterministic scoring, question bank, basic AI integration, human-in-the-loop review interface, and demo-ready flow for hackathon submission.
		

        https://docs.google.com/document/d/18PDROUtd9Y4wwLQ4Y4XSDRpnRUCVS-CJvKTbYPYU22I/edit?usp=sharing