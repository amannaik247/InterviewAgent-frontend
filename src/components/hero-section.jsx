import React from "react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-[#0B1220] text-slate-50 border-b border-slate-800">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 mb-3 animate-fade-in">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">AI-Powered Interview Preparation</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 animate-slide-up">
            <span className="text-orange-500">
              AI
            </span>{" "}
            <span className="text-slate-50">Interviewer</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Your personal AI-powered interview coach. Upload your resume, provide job details, and practice your
            interview skills with{" "}
            <span className="text-orange-500 font-semibold">
              instant feedback
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection