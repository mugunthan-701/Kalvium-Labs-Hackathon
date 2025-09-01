import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import QuestionsPage from './pages/QuestionsPage';
import CorrectAnswerPage from './pages/CorrectAnswerPage';
import IncorrectAnswerPage from './pages/IncorrectAnswerPage';
import SummaryPage from './pages/SummaryPage';
import { generateMcq } from './services/geminiService';

const TOTAL_QUESTIONS = 5;

function App() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      const question = await generateMcq('React');
      setQuizData([question]);
      setLoading(false);
    };
    fetchQuestion();
  }, []);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    const answerIndex = currentQuestion.options.indexOf(answer);
    setSelectedAnswer(answerIndex);
    const correct = answer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    setQuizResults(prev => [...prev, {
      questionId: currentQuestionIndex,
      question: currentQuestion.question,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: correct,
      explanation: currentQuestion.explanation,
      shortNotes: currentQuestion.shortNotes
    }]);

    setTimeout(() => {
      if (correct) {
        navigate('/correct');
      } else {
        navigate('/incorrect');
      }
    }, 1500);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setLoading(true);
      const question = await generateMcq('React');
      setQuizData(prev => [...prev, question]);
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setShowFeedback(false);
      setLoading(false);
      navigate('/');
    } else {
      navigate('/summary');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setShowFeedback(false);
    }
  };

  const resetQuiz = () => {
    setQuizData([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setQuizResults([]);
    setShowFeedback(false);
    const fetchQuestion = async () => {
      setLoading(true);
      const question = await generateMcq('React');
      setQuizData([question]);
      setLoading(false);
    };
    fetchQuestion();
  };

  const handleUpdateFeedback = (feedback) => {
    setQuizResults(prev => {
      if (prev.length === 0) return prev;
      const latestResult = prev[prev.length - 1];
      latestResult.explanation = feedback.explanation;
      latestResult.shortNotes = feedback.shortNotes;
      return [...prev.slice(0, prev.length - 1), latestResult];
    });
  };

  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (loading && !currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/"
            element={
              currentQuestion ? (
                <QuestionsPage
                  question={currentQuestion}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={handleAnswerSelect}
                  showFeedback={showFeedback}
                  isAnswerCorrect={isAnswerCorrect}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={TOTAL_QUESTIONS}
                  onNextQuestion={handleNextQuestion}
                  onPreviousQuestion={handlePreviousQuestion}
                  isFirstQuestion={isFirstQuestion}
                  isLastQuestion={isLastQuestion}
                />
              ) : (
                <div>Loading...</div>
              )
            } 
          />
          <Route 
            path="/correct" 
            element={
              <CorrectAnswerPage
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={isLastQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={TOTAL_QUESTIONS}
                onUpdateFeedback={handleUpdateFeedback}
              />
            } 
          />
          <Route 
            path="/incorrect" 
            element={
              <IncorrectAnswerPage
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={isLastQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={TOTAL_QUESTIONS}
                onUpdateFeedback={handleUpdateFeedback}
              />
            } 
          />
          <Route 
            path="/summary" 
            element={
              <SummaryPage
                results={quizResults}
                totalQuestions={TOTAL_QUESTIONS}
                onRetakeQuiz={resetQuiz}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  );
}

export default App;