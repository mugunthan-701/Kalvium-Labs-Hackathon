import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AnswerOption from '../components/AnswerOption';
import Navigation from '../components/Navigation';

const QuestionsPage = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
  isAnswerCorrect,
  currentQuestionIndex,
  totalQuestions,
  onNextQuestion,
  onPreviousQuestion,
  isFirstQuestion,
  isLastQuestion
}) => {
  const navigate = useNavigate();

  const handleNext = () => {
    if (isLastQuestion) {
      navigate('/summary');
    } else {
      onNextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <Header 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={totalQuestions} 
          />
          
          <div className="p-6">
            {/* Question */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {`Question ${currentQuestionIndex + 1}: ${question.question}`}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedAnswer === option} // Compare with option text
                  isCorrect={option === question.correctAnswer} // Compare with correct answer text
                  showFeedback={showFeedback}
                  onSelect={() => onAnswerSelect(option)} // Pass option text
                  disabled={showFeedback}
                />
              ))}
            </div>

            {/* Navigation */}
            <Navigation
              onPrevious={onPreviousQuestion}
              onNext={handleNext}
              isFirstQuestion={isFirstQuestion}
              isLastQuestion={isLastQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              nextButtonText={isLastQuestion ? "Finish Quiz" : "Next Question"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;