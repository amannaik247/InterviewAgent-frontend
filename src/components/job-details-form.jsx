"use client"
import React from "react"
import { Briefcase, Building, CheckCircle, AlertCircle } from "lucide-react"

const JobDetailsForm = ({
  jobDescription,
  setJobDescription,
  companyDetails,
  setCompanyDetails,
  onSubmit,
  submitStatus,
}) => {
  const isReady = jobDescription.trim() && companyDetails.trim()

  return (
    <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-slate-800 p-6 transition-all duration-300">
      {/* Step Header */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
          2
        </div>
        <h2 className="text-xl font-bold text-slate-50">Enter Job Details</h2>
      </div>

      <div className="space-y-4">
        {/* Job Description */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-slate-200 mb-2">
            <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
            Job Description
          </label>
          <div className="relative">
            <textarea
              rows="3"
              placeholder="Describe the role, responsibilities, and required skills..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200 resize-none text-sm"
            />
            <div className="absolute bottom-2.5 right-3 text-xs text-slate-500">{jobDescription.length}/500</div>
          </div>
        </div>

        {/* Company Details */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-slate-200 mb-2">
            <Building className="w-4 h-4 mr-2 text-orange-500" />
            Company Details
          </label>
          <div className="relative">
            <textarea
              rows="2"
              placeholder="Company industry, culture, recent news, or any specific details..."
              value={companyDetails}
              onChange={(e) => setCompanyDetails(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200 resize-none text-sm"
            />
            <div className="absolute bottom-2.5 right-3 text-xs text-slate-500">{companyDetails.length}/300</div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!isReady}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
            isReady
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md active:bg-orange-700"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          Submit Job Details
        </button>

        {/* Status Message */}
        {submitStatus && (
          <div
            className={`p-3 rounded-xl flex items-center border animate-slide-up ${
              submitStatus.type === "success"
                ? "bg-slate-800/90 border-emerald-500/40 text-emerald-400"
                : submitStatus.type === "loading"
                ? "bg-slate-800/90 border-slate-700 text-slate-200"
                : "bg-slate-800/90 border-rose-500/40 text-rose-400"
            }`}
          >
            {submitStatus.type === "success" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm text-slate-200">{submitStatus.message}</span>
              </>
            ) : submitStatus.type === "loading" ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-orange-500 border-t-transparent rounded-full flex-shrink-0"></div>
                <span className="font-medium text-xs sm:text-sm text-slate-200">{submitStatus.message}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2 text-rose-400 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm text-slate-200">{submitStatus.message}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetailsForm