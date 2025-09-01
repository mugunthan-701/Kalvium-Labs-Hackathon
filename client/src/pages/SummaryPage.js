import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizSummary, generateShortNotes } from '../services/geminiService';

const SummaryPage = ({ results, totalQuestions, onRetakeQuiz }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [shortNotes, setShortNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const correctAnswers = results.filter(result => result.isCorrect).length;
  const incorrectAnswers = results.filter(result => !result.isCorrect).length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Move getDefaultFeedback above useEffect and wrap in useCallback
  const getDefaultFeedback = useCallback(() => {
    if (scorePercentage >= 80) {
      return "Excellent! You have a strong understanding of the concepts. Keep practicing to maintain your knowledge and explore advanced topics.";
    } else if (scorePercentage >= 60) {
      return "Good job! You have a solid foundation. Focus on the areas where you struggled to improve your understanding.";
    } else {
      return "Keep practicing! Learning takes time to master. Review the concepts you found challenging and try again.";
    }
  }, [scorePercentage]);

  useEffect(() => {
    const getSummary = async () => {
      try {
        setLoading(true);
        const aiSummary = await generateQuizSummary(results, totalQuestions);
        setSummary(aiSummary);
      } catch (error) {
        console.error('Error generating summary:', error);
        // Fallback summary
        setSummary({
          overallFeedback: getDefaultFeedback(),
          strengths: ["Problem solving", "Basic concepts"],
          weakAreas: ["Advanced topics", "Complex scenarios"],
          studyRecommendations: ["Review incorrect answers", "Practice more questions"],
          encouragement: "Keep learning and improving!"
        });
      } finally {
        setLoading(false);
      }
    };

    getSummary();
  }, [results, totalQuestions, getDefaultFeedback]);

  const handleGenerateNotes = async () => {
    try {
      setNotesLoading(true);
      const incorrectTopics = results
        .filter(result => !result.isCorrect)
        .map(result => result.question.split(' ').slice(0, 4).join(' ')); // First 4 words as topic
      
      const aiNotes = await generateShortNotes(incorrectTopics);
      setShortNotes(aiNotes);
      setShowNotes(true);
    } catch (error) {
      console.error('Error generating notes:', error);
      setShortNotes({
        notes: {
          "Study Topics": ["Review key concepts", "Practice regularly", "Focus on weak areas"]
        }
      });
      setShowNotes(true);
    } finally {
      setNotesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating your personalized summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">Your performance overview and insights.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Score Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Results</h2>
            
            {/* Score Circle */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - scorePercentage / 100)}
                    className={`${
                      scorePercentage >= 80 ? 'text-green-500' :
                      scorePercentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                    } transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{scorePercentage}%</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h2>
            
            {summary && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">{summary.overallFeedback}</p>
                </div>
                
                {summary.strengths && summary.strengths.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                      <span className="mr-2">✓</span> Strengths
                    </h3>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      {summary.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {summary.weakAreas && summary.weakAreas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <span className="mr-2">▲</span> Areas for Improvement
                    </h3>
                    <ul className="list-disc list-inside text-orange-700 space-y-1">
                      {summary.weakAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Study Recommendations */}
        {summary?.studyRecommendations && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Study Recommendations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {summary.studyRecommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-purple-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Notes Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📝 Personalized Study Notes</h2>
            {!showNotes && (
              <button
                onClick={handleGenerateNotes}
                disabled={notesLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {notesLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  'Generate AI Notes'
                )}
              </button>
            )}
          </div>
          
          {showNotes && shortNotes && (
            <div className="space-y-4">
              {Object.entries(shortNotes.notes).map(([topic, notes], index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">{topic}</h3>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    {notes.map((note, noteIndex) => (
                      <li key={noteIndex}>{note}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Encouragement */}
        {summary?.encouragement && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-center">
            <p className="text-lg font-medium">{summary.encouragement}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onRetakeQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;