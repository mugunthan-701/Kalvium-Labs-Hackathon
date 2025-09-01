import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AnswerOption from '../components/AnswerOption';
import Navigation from '../components/Navigation';
import { evaluateAnswer } from '../services/geminiService';

const CorrectAnswerPage = ({ 
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
      // Prevent multiple API calls for the same question
      if (hasCalledAPI.current) return;
      
      try {
        setLoading(true);
        hasCalledAPI.current = true; // Mark as called
        
        console.log("Calling AI for correct answer feedback...");
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
          explanation: "Correct! Well done.",
          additionalFact: "Keep up the good work!",
          shortNotes: ["Review the concept", "Continue practicing"]
        });
      } finally {
        setLoading(false);
      }
    };

    // Only call if we have the required data and haven't called before
    if (question && selectedAnswer && !hasCalledAPI.current) {
      getFeedback();
    }
  }, []); // Empty dependency array to prevent re-calls

  // Reset the ref when question changes
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
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-green-800">Correct!</h3>
            </div>
            
            <p className="text-green-700 mb-4">{feedback?.explanation || "Great job!"}</p>
            
            {feedback?.additionalFact && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Did You Know?</h4>
                <p className="text-blue-700">{feedback.additionalFact}</p>
              </div>
            )}
          </div>

          {/* Short Notes */}
          {feedback?.shortNotes && feedback.shortNotes.length > 0 && (
            <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">📝 Key Points:</h4>
              <ul className="list-disc list-inside space-y-1">
                {feedback.shortNotes.map((note, index) => (
                  <li key={index} className="text-yellow-700">{note}</li>
                ))}
              </ul>
            </div>
          )}

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

export default CorrectAnswerPage;
