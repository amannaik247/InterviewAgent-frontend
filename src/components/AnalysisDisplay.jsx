import React from 'react';
import { CheckCircle, AlertCircle, ThumbsUp, Meh, ThumbsDown, BarChart2, MessageSquareQuote } from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
};

const getScoreBg = (score) => {
  if (score >= 8) return "from-green-500 to-emerald-600";
  if (score >= 5) return "from-yellow-500 to-orange-500";
  return "from-red-500 to-rose-600";
};

const getScoreLabel = (score) => {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 5) return "Average";
  return "Needs Improvement";
};

const getScoreIcon = (score) => {
  if (score >= 8) return <ThumbsUp className="w-4 h-4 mr-1 text-green-400" />;
  if (score >= 5) return <Meh className="w-4 h-4 mr-1 text-yellow-400" />;
  return <ThumbsDown className="w-4 h-4 mr-1 text-red-400" />;
};

// Circular progress ring for the overall score
const ScoreRing = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const gradientId = `scoreGrad-${Math.round(score)}`;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {score >= 8 ? (
              <>
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#10b981" />
              </>
            ) : score >= 5 ? (
              <>
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#f97316" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#e11d48" />
              </>
            )}
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className={`text-4xl font-extrabold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400 font-medium tracking-wide">/10</span>
      </div>
    </div>
  );
};

const AnalysisDisplay = ({ analysis, analysisStatus }) => {
  if (!analysis && !analysisStatus) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
          <BarChart2 className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-2">No Analysis Available Yet</h2>
        <p className="dark:text-gray-400 text-gray-500 text-sm max-w-sm">
          Click "Analyze Interview" in the left panel to evaluate your performance across technical, behavioral, and communication metrics.
        </p>
      </div>
    );
  }

  if (analysisStatus && analysisStatus.type === "loading") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin"></div>
          <BarChart2 className="w-6 h-6 text-orange-400 absolute" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Analyzing Your Interview...</h3>
          <p className="text-sm text-gray-400 mt-1">Evaluating response accuracy, communication style, and experience alignment.</p>
        </div>
      </div>
    );
  }

  if (analysisStatus && analysisStatus.type === "error") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-16 text-center space-y-3">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 border border-red-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">Analysis Request Failed</h3>
        <p className="text-sm text-gray-400 max-w-md">{analysisStatus.message}</p>
      </div>
    );
  }

  // Extract overall fields, keep only category entries for the cards
  const { overall_score, overall_summary, ...categories } = analysis || {};
  const hasCategories = categories && Object.keys(categories).length > 0;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-700/80 pb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
          📊
        </div>
        <div>
          <h2 className="text-xl font-bold dark:text-white text-gray-900">Performance Assessment</h2>
          <p className="text-xs text-gray-400">Detailed AI evaluation report for this candidate interview session.</p>
        </div>
      </div>

      {/* Overall Score Hero */}
      {overall_score !== undefined && (
        <div className="bg-gray-800/80 border border-gray-700/60 rounded-2xl p-6 mb-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={overall_score} />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">Overall Score</p>
              <h3 className={`text-3xl font-extrabold mb-1 ${getScoreColor(overall_score)}`}>
                {getScoreLabel(overall_score)}
              </h3>
              <p className="text-sm text-gray-400">
                Average across all 5 evaluation categories.
              </p>
              {/* Mini bar breakdown */}
              {hasCategories && (
                <div className="mt-3 space-y-1.5">
                  {Object.entries(categories).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-40 truncate capitalize">{key.replace(/_/g, ' ')}</span>
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(val.score)}`}
                          style={{ width: `${val.score * 10}%`, transition: 'width 1s ease' }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${getScoreColor(val.score)} w-6 text-right`}>{val.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interviewer's Opinion */}
      {overall_summary && (
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-sm font-semibold text-orange-300 uppercase tracking-wider">Interviewer's Opinion</h3>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed italic">"{overall_summary}"</p>
        </div>
      )}

      {/* Per-category cards */}
      {hasCategories ? (
        <div className="space-y-4 pb-4">
          {Object.entries(categories).map(([categoryName, categoryData]) => (
            <div key={categoryName} className="bg-gray-800/80 border border-gray-700/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold dark:text-gray-100 text-gray-800 flex items-center">
                  {getScoreIcon(categoryData.score)}
                  <span className="ml-1.5">{categoryName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</span>
                </h3>
                <span className={`text-base font-bold ${getScoreColor(categoryData.score)} bg-gray-900/60 px-3 py-1 rounded-lg border border-gray-700`}>
                  {categoryData.score}/10
                </span>
              </div>
              <p className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed mt-2">{categoryData.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <p>Analysis completed, but no score categories were returned.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;