import React from "react"
import { ChevronRight } from "lucide-react"

const STEPS = [
  { num: "1", title: "Add resume", sub: "PDF or DOCX" },
  { num: "2", title: "Pick a role", sub: "Preset or custom" },
  { num: "3", title: "Start interview", sub: "Get live feedback" },
]

const HeroSection = ({ className = "" }) => {
  return (
    <header
      className={`relative shrink-0 overflow-hidden bg-[#0B1220] text-slate-50 rounded-[16px] border border-slate-800 px-5 sm:px-7 py-3.5 sm:py-4.5 ${className}`}
    >
      <div className="flex flex-row items-center justify-between gap-6 lg:gap-8 w-full">
        {/* LEFT ZONE (left-aligned, flex column) */}
        <div className="flex flex-col items-start text-left min-w-0">
          {/* Badge chip on top */}
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 mb-2.5 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 animate-pulse"></span>
            <span className="font-mono text-[11px] font-semibold text-slate-300 tracking-[0.06em] uppercase">
              AI-Powered Interview Preparation
            </span>
          </div>

          {/* Title (Newsreader 600, -0.02em, 1.1 line-height) */}
          <h1 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] mb-2 animate-slide-up">
            <span className="text-orange-500">AI</span>{" "}
            <span className="text-slate-50">Interviewer</span>
          </h1>

          {/* Subtitle (Instrument Sans 400, 15px, 1.5 line-height) */}
          <p className="font-sans text-[14px] sm:text-[15px] font-normal text-slate-400 leading-[1.5] max-w-[520px] animate-slide-up">
            Upload your resume, add job details, and get{" "}
            <span className="text-orange-500 font-semibold">instant feedback</span>.
          </p>
        </div>

        {/* RIGHT ZONE (3-step guide, hidden below 768px width) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.num}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-600 shrink-0" />
              )}
              <div className="flex items-center gap-2.5">
                {/* Step number in JetBrains Mono */}
                <div className="w-8 h-8 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center shrink-0">
                  <span className="font-mono text-[13px] font-semibold text-orange-400">{step.num}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[13px] font-semibold text-slate-200 whitespace-nowrap leading-tight">
                    {step.title}
                  </span>
                  <span className="hidden lg:inline font-sans text-[12px] font-normal text-slate-400 whitespace-nowrap mt-0.5 leading-tight">
                    {step.sub}
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  )
}

export default HeroSection