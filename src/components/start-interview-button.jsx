"use client"
import React from "react"
import { Play, Lock } from "lucide-react"

const StartInterviewButton = ({ onStart, isDisabled }) => {
  return (
    <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-slate-800 p-6 transition-all duration-300">
      {/* Step Header */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
          3
        </div>
        <h2 className="text-xl font-bold text-slate-50">Start Your Interview</h2>
      </div>

      {/* Description */}
      <p className="text-slate-300 mb-4 leading-relaxed text-sm">
        Ready to begin? Our AI interviewer will ask you personalized questions based on your resume and the job details
        you provided.
      </p>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={isDisabled}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-3 ${
          isDisabled
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            : "bg-[#1E2A3A] text-slate-100 border border-orange-500/40 hover:bg-slate-700 hover:border-orange-500/70 active:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]"
        }`}
      >
        {isDisabled ? (
          <>
            <Lock className="w-5 h-5 text-slate-500" />
            <span className="text-slate-400">Complete steps 1 & 2 to start</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current text-orange-500" />
            <span>Start Interview</span>
          </>
        )}
      </button>

      {/* Progress Indicator */}
      {isDisabled && (
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-400 mb-1.5">Complete the steps above to unlock</p>
          <div className="flex justify-center space-x-1.5">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StartInterviewButton