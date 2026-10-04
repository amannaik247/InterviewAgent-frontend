"use client"

import React, { useState, useRef } from "react"
import { Play, Lock, ChevronDown, Sparkles, Upload, Building2, Briefcase } from "lucide-react"
import HeroSection from "../components/hero-section"
import ResumeUpload from "../components/resume-upload"
import CircularAudioVisualizer from "../components/CircularAudioVisualizer"
import { COMPANY_PRESETS, ROLE_PRESETS } from "/data/presets"

export default function LandingPage({
  onFileChange,
  onUploadResume,
  uploadStatus,
  setResumeUploadStatus,
  isResumeUploaded,
  onRemoveResume,
  resumeFile,
  jobDescription,
  setJobDescription,
  companyDetails,
  setCompanyDetails,
  onSubmitJobDetails,
  jobDetailsSubmitStatus,
  onStartInterview,
}) {
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [isStarting, setIsStarting] = useState(false)

  const companyTextareaRef = useRef(null)
  const jobTextareaRef = useRef(null)

  // ── Company Dropdown handler ───────────────────────────────────────────────
  const handleCompanyChange = (e) => {
    const value = e.target.value
    setSelectedCompanyId(value)
    if (value === "custom") {
      setCompanyDetails("")
      setTimeout(() => companyTextareaRef.current?.focus(), 0)
    } else if (value === "") {
      setCompanyDetails("")
    } else {
      const preset = COMPANY_PRESETS.find((c) => c.id === value)
      if (preset) {
        setCompanyDetails(preset.description)
      }
    }
  }

  // ── Job Role Dropdown handler ──────────────────────────────────────────────
  const handleRoleChange = (e) => {
    const value = e.target.value
    setSelectedRoleId(value)
    if (value === "custom") {
      setJobDescription("")
      setTimeout(() => jobTextareaRef.current?.focus(), 0)
    } else if (value === "") {
      setJobDescription("")
    } else {
      const preset = ROLE_PRESETS.find((r) => r.id === value)
      if (preset) {
        setJobDescription(preset.description)
      }
    }
  }

  // ── Company Description Textarea handler ───────────────────────────────────
  const handleCompanyDescriptionChange = (e) => {
    const text = e.target.value
    setCompanyDetails(text)
    if (selectedCompanyId && selectedCompanyId !== "custom") {
      const preset = COMPANY_PRESETS.find((c) => c.id === selectedCompanyId)
      if (!preset || preset.description !== text) {
        setSelectedCompanyId("custom")
      }
    } else if (!selectedCompanyId && text.trim().length > 0) {
      setSelectedCompanyId("custom")
    }
  }

  // ── Job Description Textarea handler ───────────────────────────────────────
  const handleJobDescriptionChange = (e) => {
    const text = e.target.value
    setJobDescription(text)
    if (selectedRoleId && selectedRoleId !== "custom") {
      const preset = ROLE_PRESETS.find((r) => r.id === selectedRoleId)
      if (!preset || preset.description !== text) {
        setSelectedRoleId("custom")
      }
    } else if (!selectedRoleId && text.trim().length > 0) {
      setSelectedRoleId("custom")
    }
  }

  // ── Validation & Readiness ────────────────────────────────────────────────
  const hasResume = Boolean(isResumeUploaded || resumeFile)
  const hasCompany = companyDetails.trim().length > 0
  const hasJob = jobDescription.trim().length > 0
  const canStart = hasResume && hasCompany && hasJob

  // ── Helper text in footer ─────────────────────────────────────────────────
  const getHelperText = () => {
    const missingResume = !hasResume
    const missingCompany = !hasCompany
    const missingJob = !hasJob

    if (!missingResume && !missingCompany && !missingJob) {
      return "Ready to go"
    }
    if (missingResume && missingCompany && missingJob) {
      return "Add your resume and both descriptions to continue"
    }
    if (missingResume && missingCompany) {
      return "Add your resume and company description to continue"
    }
    if (missingResume && missingJob) {
      return "Add your resume and job description to continue"
    }
    if (missingCompany && missingJob) {
      return "Add company and job descriptions to continue"
    }
    if (missingResume) {
      return "Add your resume to continue"
    }
    if (missingCompany) {
      return "Add company description to continue"
    }
    if (missingJob) {
      return "Add job description to continue"
    }
    return "Complete all fields to continue"
  }

  const handleStartInterviewClick = async () => {
    if (!canStart || isStarting) return
    setIsStarting(true)
    try {
      if (onSubmitJobDetails) {
        await onSubmitJobDetails()
      }
      if (onStartInterview) {
        await onStartInterview()
      }
    } catch (err) {
      console.error("Failed to start interview:", err)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] p-2.5 sm:p-3.5 page-desktop-fit flex flex-col items-center justify-center box-border w-full">
      {/* Outer container: fills webpage, height 100% on desktop, flex column, gap 12px, padding 16px, 1px border, 24px radius */}
      <div className="w-full h-full rounded-[24px] border border-slate-800 bg-[#0B1220] flex flex-col gap-3 p-3.5 sm:p-4.5 shadow-2xl container-desktop-fit box-border overflow-hidden">
        
        {/* Header (shrink-0 and compact, <= 22% of viewport height) */}
        <HeroSection className="w-full" />

        {/* Main row: flex-1 with min-height 0, two-column grid (1.85fr / 1fr), gap 12px */}
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] gap-3.5 flex-1 min-h-0 h-full">
          
          {/* QUICK START PANEL (Card: 16px radius, 1px border, panel surface, flex column, overflow hidden) */}
          <div className="rounded-[16px] border border-slate-800 bg-[#0F172A] flex flex-col overflow-hidden h-full shadow-xl">
            
            {/* a. Header bar (padding 12px 20px, 1px bottom divider, slightly tinted background) */}
            <div className="shrink-0 px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-orange-500/10 border border-orange-500/25 text-orange-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[17px] sm:text-[18px] font-semibold text-slate-100 leading-tight">Quick start</h2>
                <p className="text-[12px] sm:text-[13px] text-slate-400 mt-0.5 leading-tight">
                  Choose a preset or paste your own details.
                </p>
              </div>
            </div>

            {/* b. Body (flex-1, min-height 0, padding 16px 20px) */}
            <div className="flex-1 min-h-0 px-5 py-3.5 overflow-y-auto lg:overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-stretch">
                
                {/* LEFT COLUMN (Resume group + Company group) */}
                <div className="flex flex-col h-full gap-3">
                  {/* 1. Resume group: chip "Resume" (length-wise rectangle matching box width), then dropzone beneath it */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="resume-file-input"
                      className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[12px] font-semibold uppercase tracking-wider cursor-pointer mb-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </label>

                    <ResumeUpload
                      onFileChange={onFileChange}
                      onUpload={onUploadResume}
                      uploadStatus={uploadStatus}
                      setResumeUploadStatus={setResumeUploadStatus}
                      isResumeUploaded={isResumeUploaded}
                      onRemoveResume={onRemoveResume}
                      resumeFile={resumeFile}
                    />
                  </div>

                  {/* 2. Company group (flex-1, flex column): chip "Company" (length-wise rectangle matching box width), dropdown, textarea */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <label
                      htmlFor="company-preset-select"
                      className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[12px] font-semibold uppercase tracking-wider cursor-pointer mb-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Company</span>
                    </label>

                    <div className="relative w-full mb-1.5">
                      <select
                        id="company-preset-select"
                        value={selectedCompanyId}
                        onChange={handleCompanyChange}
                        className="w-full h-[42px] appearance-none px-3.5 pr-9 rounded-[10px] border border-slate-700/80 bg-[#131E36] hover:border-slate-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/25 text-slate-100 text-[14px] font-medium transition-all cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-400">
                          Select company
                        </option>
                        {COMPANY_PRESETS.map((preset) => (
                          <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-100">
                            {preset.name}
                          </option>
                        ))}
                        <option value="custom" className="bg-slate-900 text-slate-100">
                          Custom
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col">
                      <label htmlFor="company-description" className="sr-only">
                        Company description
                      </label>
                      <textarea
                        id="company-description"
                        ref={companyTextareaRef}
                        placeholder="Company description"
                        value={companyDetails}
                        onChange={handleCompanyDescriptionChange}
                        className="w-full flex-1 min-h-[100px] lg:min-h-0 p-3 rounded-[10px] border border-slate-700/80 bg-[#131E36] hover:border-slate-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/25 text-slate-100 placeholder-slate-500 text-[14px] leading-[22px] transition-all resize-none overflow-y-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (Job role group) */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 min-h-0 flex flex-col">
                    {/* Chip "Job role" (length-wise rectangle matching box width) */}
                    <label
                      htmlFor="role-preset-select"
                      className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[12px] font-semibold uppercase tracking-wider cursor-pointer mb-1.5"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Job role</span>
                    </label>

                    {/* Dropdown */}
                    <div className="relative w-full mb-1.5">
                      <select
                        id="role-preset-select"
                        value={selectedRoleId}
                        onChange={handleRoleChange}
                        className="w-full h-[42px] appearance-none px-3.5 pr-9 rounded-[10px] border border-slate-700/80 bg-[#131E36] hover:border-slate-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/25 text-slate-100 text-[14px] font-medium transition-all cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-400">
                          Select role
                        </option>
                        {ROLE_PRESETS.map((preset) => (
                          <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-100">
                            {preset.title}
                          </option>
                        ))}
                        <option value="custom" className="bg-slate-900 text-slate-100">
                          Custom
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Job description textarea filling the remaining height */}
                    <div className="flex-1 min-h-0 flex flex-col">
                      <label htmlFor="job-description" className="sr-only">
                        Job description
                      </label>
                      <textarea
                        id="job-description"
                        ref={jobTextareaRef}
                        placeholder="Job description"
                        value={jobDescription}
                        onChange={handleJobDescriptionChange}
                        className="w-full flex-1 min-h-[140px] lg:min-h-0 p-3 rounded-[10px] border border-slate-700/80 bg-[#131E36] hover:border-slate-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/25 text-slate-100 placeholder-slate-500 text-[14px] leading-[22px] transition-all resize-none overflow-y-auto"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* c. Footer (padding 12px 20px, 1px top divider) */}
            <div className="shrink-0 px-5 py-3 border-t border-slate-800 bg-slate-900/30 flex flex-col">
              <p className="text-[12px] text-slate-400 text-center mb-2 font-medium">
                {getHelperText()}
              </p>
              <button
                type="button"
                id="start-interview-btn"
                onClick={handleStartInterviewClick}
                disabled={!canStart || isStarting}
                aria-disabled={!canStart || isStarting}
                className={`w-full h-[46px] px-6 rounded-[10px] font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2.5 ${
                  !canStart
                    ? "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60 opacity-70"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-md active:scale-[0.99] cursor-pointer"
                }`}
              >
                {isStarting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing interview...</span>
                  </>
                ) : !canStart ? (
                  <>
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Start Interview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>Start Interview</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ANIMATION CARD (Card: identical background, border, radius, same height) */}
          <div className="rounded-[16px] border border-slate-800 bg-[#0F172A] relative overflow-hidden h-full shadow-xl flex flex-col min-h-[300px]">
            {/* Top-left: status chip with a 6px dot in accent color and text "Ready" */}
            <div className="absolute top-3.5 left-3.5 z-20">
              <div className="inline-flex items-center h-[28px] px-2.5 rounded-[8px] gap-1.5 border border-slate-700/60 bg-slate-800/80 backdrop-blur-sm text-slate-300 text-[12px] font-semibold uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span>Ready</span>
              </div>
            </div>

            {/* Animation covers the WHOLE box */}
            <div className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden">
              <CircularAudioVisualizer
                audio={null}
                micStream={null}
                idlePulse={true}
                isSpeaking={false}
                colorScheme="orange"
              />
            </div>

            {/* Welcome text: positioned OVER the animation and JUST BELOW the main circle */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[calc(50%+52px)] z-20 text-center pointer-events-none w-full max-w-[280px] px-2">
              <p className="text-slate-100 text-[16px] sm:text-[17px] font-semibold leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Welcome! We were expecting you.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
