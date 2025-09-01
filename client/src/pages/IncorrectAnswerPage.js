import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AnswerOption from '../components/AnswerOption';
import Navigation from '../components/Navigation';
import { evaluateAnswer } from '../services/geminiService';

const IncorrectAnswerPage = ({ 
  question, 
  selectedAnswer, 
  onNextQuestion, 
  isLastQuestion, 
  currentQuestionIndex, 
  totalQuestions,
  onUpdateFeedback 
}) => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCalledAPI = useRef(false); // Prevent multiple API calls

  useEffect(() => {
    const getFeedback = async () => {
      if (hasCalledAPI.current) return; // Prevent duplicate calls
      
      try {
        setLoading(true);
        hasCalledAPI.current = true;
        
        console.log("Calling AI for incorrect answer feedback...");
        const aiFeedback = await evaluateAnswer(
          question.question,
          question.options,
          question.correctAnswer,
          selectedAnswer
        );
        
        setFeedback(aiFeedback);
        
        if (onUpdateFeedback) {
          onUpdateFeedback(aiFeedback);
        }
      } catch (error) {
        console.error('Error getting AI feedback:', error);
        setFeedback({
          explanation: "Incorrect. Please review this concept.",
          mistakeAnalysis: "This is a common misconception.",
          improvementTips: "Study the fundamentals and practice more."
        });
      } finally {
        setLoading(false);
      }
    };

    if (question && selectedAnswer && !hasCalledAPI.current) {
      getFeedback();
    }
  }, []); // Empty dependency array

  // Reset ref when question changes
  useEffect(() => {
    hasCalledAPI.current = false;
  }, [currentQuestionIndex]);

  const handleNext = () => {
    if (isLastQuestion) {
      navigate('/summary');
    } else {
      onNextQuestion();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Generating AI feedback...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Question Display */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {question.question}
            </h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  isSelected={selectedAnswer === option}
                  isCorrect={option === question.correctAnswer}
                  showFeedback={true}
                  onClick={() => {}}
                  disabled={true}
                />
              ))}
            </div>
          </div>

          {/* AI Feedback */}
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✗</span>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-red-800">Incorrect!</h3>
            </div>
            
            <p className="text-red-700 mb-4">{feedback?.explanation || "Please review this concept."}</p>
            
            {feedback?.mistakeAnalysis && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-orange-800 mb-2">🔍 Why This Might Have Been Chosen:</h4>
                <p className="text-orange-700">{feedback.mistakeAnalysis}</p>
              </div>
            )}
            
            {feedback?.improvementTips && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">💡 How to Improve:</h4>
                <p className="text-purple-700">{feedback.improvementTips}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <Navigation
            onNext={handleNext}
            onPrevious={() => {}}
            currentQuestion={currentQuestionIndex}
            totalQuestions={totalQuestions}
            showPrevious={false}
            nextText={isLastQuestion ? "View Summary" : "Next Question"}
          />
        </div>
      </div>
    </div>
  );
};

export default IncorrectAnswerPage;
