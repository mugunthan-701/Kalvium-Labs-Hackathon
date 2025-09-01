import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ currentQuestionIndex, totalQuestions }) => {
  // Add validation to prevent NaN in progress calculation
  const progressPercentage = totalQuestions > 0 
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : 0;

  // Prevent errors if props are undefined
  if (typeof currentQuestionIndex !== 'number' || typeof totalQuestions !== 'number') {
    return (
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <h1 className="text-xl font-bold">MCQ Quiz</h1>
        </div>
        <div className="bg-blue-500 px-4 py-2 rounded-full text-sm font-medium">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-blue-500 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
Header.propTypes = {
  currentQuestionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired
};

// Add default props
Header.defaultProps = {
  currentQuestionIndex: 0,
  totalQuestions: 0
};

export default Header;