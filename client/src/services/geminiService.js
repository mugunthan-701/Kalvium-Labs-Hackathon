import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API Key not found. Make sure you have set REACT_APP_GEMINI_API_KEY in your .env file and restarted the server.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

function cleanJsonResponse(responseText) {
  if (!responseText || typeof responseText !== 'string') return '';

  // Remove common markdown/json fences and leading labels, then trim
  return responseText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^\s*json[:\s]*/i, "")
    .trim();
}

export async function evaluateAnswer(question, options, correctAnswer, selectedAnswer) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const isCorrect = selectedAnswer === correctAnswer;

    const optionsList = options
      .map((opt, idx) => `${String.fromCharCode(97 + idx)}) ${opt}`)
      .join(', ');

    const prompt = `As a React development instructor, analyze this MCQ response:

Question: ${question}
Context: React Development and Web Programming
Options: ${optionsList}
Correct Answer: ${correctAnswer}
Student Selected: ${selectedAnswer}
Is Correct: ${isCorrect}

Provide a JSON response focusing on React concepts:
{
  "verdict": "${isCorrect ? 'correct' : 'incorrect'}",
  "explanation": "Clear explanation of the React concept",
  "additionalFact": "${isCorrect ? 'Additional React development insight' : ''}",
  "mistakeAnalysis": "${!isCorrect ? 'Common React development misconception' : ''}",
  "improvementTips": "${!isCorrect ? 'React-specific improvement tips' : ''}",
  "shortNotes": ["Key React concept 1", "Key React concept 2", "Key React concept 3"],
  "confidence": 0.95
}`;

    const result = await model.generateContent(prompt);
    const responseText = typeof result?.response?.text === 'function'
      ? await result.response.text()
      : String(result?.response ?? '');
    const cleanResponse = cleanJsonResponse(responseText);
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      verdict: selectedAnswer === correctAnswer ? 'correct' : 'incorrect',
      explanation: selectedAnswer === correctAnswer
        ? "Correct! You understand this React concept well."
        : "Incorrect. Review this React concept.",
      additionalFact: selectedAnswer === correctAnswer ? "React uses a virtual DOM for efficient rendering." : "",
      mistakeAnalysis: selectedAnswer !== correctAnswer ? "This is a common misconception in React development." : "",
      improvementTips: selectedAnswer !== correctAnswer ? "Practice building more React components." : "",
      shortNotes: ["Component lifecycle", "State management", "Props vs State"],
      confidence: 0.8
    };
  }
}

export async function generateQuizSummary(results, totalQuestions) {
  try {
    console.log("Generating quiz summary with Gemini AI...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const correctAnswers = results.filter(result => result.isCorrect).length;
    const incorrectAnswers = results.filter(result => !result.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    const incorrectTopics = results
      .filter(result => !result.isCorrect)
      .map(result => result.question)
      .join('; ');

    const prompt = `As an educational assessment AI, provide a comprehensive quiz summary based on the following results:

Quiz Results:
- Total Questions: ${totalQuestions}
- Correct Answers: ${correctAnswers}
- Incorrect Answers: ${incorrectAnswers}
- Score: ${scorePercentage}%

Incorrect Questions: ${incorrectTopics}

Please provide a JSON response with:
{
  "overallFeedback": "Detailed performance feedback based on the score and the incorrect questions",
  "strengths": ["Identify strengths based on the questions answered correctly"],
  "weakAreas": ["Identify weak areas based on the questions answered incorrectly"],
  "studyRecommendations": ["Specific study recommendation 1", "Specific study recommendation 2"],
  "encouragement": "Motivational message for the student"
}

Return only valid JSON without any markdown formatting.`

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanResponse = cleanJsonResponse(responseText);

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Summary generation error:", error);

    const correctAnswers = results.filter(result => result.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      overallFeedback: scorePercentage >= 80
        ? "Excellent performance! You have a strong understanding of the concepts."
        : scorePercentage >= 60
        ? "Good job! You have a solid foundation but there's room for improvement."
        : "Keep practicing! Learning takes time and effort.",
      strengths: ["Problem solving", "Basic concepts"],
      weakAreas: ["Advanced topics", "Complex scenarios"],
      studyRecommendations: ["Review incorrect answers", "Practice more questions"],
      encouragement: "Keep learning and improving!"
    };
  }
}

export async function generateShortNotes(weakTopics) {
  try {
    console.log("Generating short notes with Gemini AI...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const topicsList = weakTopics.join(', ');

    const prompt = `Create concise study notes for these topics: ${topicsList}

Provide a JSON response with short, focused study notes in the following shape:
{
  "notes": {
    "<topic>": ["Key point 1", "Key point 2", "Key point 3"]
    // repeat for each topic
  }
}

Keep each point under 15 words. Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = typeof result?.response?.text === 'function'
      ? await result.response.text()
      : String(result?.response ?? '');

    const cleanResponse = cleanJsonResponse(responseText);

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Notes generation error:", error);
    return {
      notes: {
        "Study Topics": ["Review key concepts", "Practice regularly", "Focus on weak areas"]
      }
    };
  }
}

export async function generateMcq(topic) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `Generate a multiple-choice question about ${topic} for a React developer quiz.

Provide a JSON response with:
{
  "question": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": "The correct option text",
  "explanation": "Detailed explanation of why the correct answer is right",
  "shortNotes": ["Note 1", "Note 2", "Note 3"]
}

Ensure the correct answer is one of the options. Return only valid JSON.`

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanResponse = cleanJsonResponse(responseText);

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("MCQ generation error:", error);
    return {
      question: "What is React?",
      options: ["A library", "A framework", "A language", "A database"],
      correctAnswer: "A library",
      explanation: "React is a JavaScript library for building user interfaces.",
      shortNotes: ["Virtual DOM", "Component-based", "Declarative"]
    };
  }
}


export async function getLegalGuidance(question) {
  try {
    console.log("Initializing request to Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `As a legal guidance assistant for women and children in India, please provide information about: ${question}

    Please format your response with:
    1. Clear headings in *bold*
    2. Bullet points using • for lists
    3. Proper spacing between paragraphs
    4. Important terms in *bold*
    5. Include relevant helpline numbers when applicable
    
    Remember to:
    • Keep the response focused on legal rights and protections
    • Provide general guidance only
    • Recommend professional legal consultation when necessary`;
    
    console.log("Sending prompt to API...");
    const result = await model.generateContent(prompt);
    console.log("Received response from API");
    
    if (!result?.response) {
      throw new Error("No response received from API");
    }   
    
    const responseText = typeof result.response.text === 'function'
      ? await result.response.text()
      : String(result.response);
    console.log("Processed response:", responseText);
    
    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to get response: ${error.message}`);
  }
}