"use client"
import { Play, Lock } from "lucide-react"

const StartInterviewButton = ({ onStart, isDisabled }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      {/* Step Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          3
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Start Your Interview</h2>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        Ready to begin? Our AI interviewer will ask you personalized questions based on your resume and the job details
        you provided.
      </p>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={isDisabled}
        className={`w-full py-6 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center space-x-3 ${
          isDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
            : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
        }`}
      >
        {isDisabled ? (
          <>
            <Lock className="w-6 h-6" />
            <span>Complete steps 1 & 2 to start</span>
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            <span>Start Interview</span>
          </>
        )}
      </button>

      {/* Progress Indicator */}
      {isDisabled && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Complete the steps above to unlock</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StartInterviewButton
