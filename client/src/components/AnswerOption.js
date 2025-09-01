import React from 'react';

const AnswerOption = ({ 
  option, 
  index, 
  isSelected, 
  isCorrect, 
  showFeedback, 
  onSelect, 
  disabled 
}) => {
  const getOptionStyle = () => {
    if (showFeedback) {
      if (isCorrect) {
        return "bg-green-500 text-white border-green-500"; // Correct answer
      }
      if (isSelected && !isCorrect) {
        return "bg-red-500 text-white border-red-500"; // Incorrect selected answer
      }
      return "bg-white text-gray-700 border-gray-300"; // Default for non-selected
    }

    // Default state when no feedback is shown
    return isSelected
      ? "bg-blue-500 text-white border-blue-500"
      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300";
  };

  const getLabelStyle = () => {
    if (!showFeedback) {
      return isSelected 
        ? "bg-white text-blue-500" 
        : "bg-gray-200 text-gray-700";
    }

    if (isCorrect) {
      return "bg-white text-green-500";
    }

    if (isSelected && !isCorrect) {
      return "bg-white text-red-500";
    }

    return "bg-gray-200 text-gray-700";
  };

  const getIcon = () => {
    if (!showFeedback) return null;
    
    if (isCorrect) {
      return (
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-500 font-bold">✓</span>
        </div>
      );
    }

    if (isSelected && !isCorrect) {
      return (
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-500 font-bold">✗</span>
        </div>
      );
    }

    return null;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={disabled}
      className={`
        w-full p-4 rounded-md border-2 transition-all duration-200 flex items-center justify-between
        ${getOptionStyle()}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
          ${getLabelStyle()}
        `}>
          {optionLabels[index]}
        </div>
        <span className="text-left font-medium">{option}</span>
      </div>
      {getIcon()}
    </button>
  );
};

export default AnswerOption;