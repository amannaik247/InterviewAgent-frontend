import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const AnalysisDisplay = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Interview Analysis</h2>
        <p className="text-gray-500">No analysis available yet. Please finish the interview to see the results.</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 8) return <CheckCircle className="w-5 h-5 mr-2" />;
    if (score >= 5) return <HelpCircle className="w-5 h-5 mr-2" />; // Neutral/Warning
    return <XCircle className="w-5 h-5 mr-2" />; // Needs improvement
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          📊
        </div>
        Interview Analysis
      </h2>

      <div className="space-y-6">
        {Object.entries(analysis).map(([categoryName, categoryData]) => (
          <div key={categoryName} className="border-b pb-4 last:border-b-0 last:pb-0">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              {getScoreIcon(categoryData.score)}
              {categoryName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
              <span className={`ml-auto font-bold ${getScoreColor(categoryData.score)}`}>
                {categoryData.score}/10
              </span>
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{categoryData.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisDisplay;