import React from 'react';

const Navigation = ({ 
  onPrevious, 
  onNext, 
  isFirstQuestion, 
  isLastQuestion, 
  currentQuestionIndex, 
  totalQuestions,
  nextButtonText = "Next Question"
}) => {
  const renderProgressDots = () => {
    const dots = [];
    for (let i = 0; i < totalQuestions; i++) {
      let dotColor = "bg-gray-300"; // Default gray
      
      if (i < currentQuestionIndex) {
        dotColor = "bg-green-500"; // Completed questions
      } else if (i === currentQuestionIndex) {
        dotColor = "bg-blue-500"; // Current question
      }
      
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${dotColor} transition-colors duration-200`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`
          px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2
          ${isFirstQuestion 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <span>‹</span>
        <span>Previous</span>
      </button>

      <div className="flex space-x-2">
        {renderProgressDots()}
      </div>

      <button
        onClick={onNext}
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      >
        <span>{nextButtonText}</span>
        <span>›</span>
      </button>
    </div>
  );
};

export default Navigation;
