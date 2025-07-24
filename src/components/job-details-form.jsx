"use client"
import { Briefcase, Building, CheckCircle, AlertCircle } from "lucide-react"

const JobDetailsForm = ({
  jobDescription,
  setJobDescription,
  companyDetails,
  setCompanyDetails,
  onSubmit,
  submitStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      {/* Step Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          2
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Enter Job Details</h2>
      </div>

      <div className="space-y-6">
        {/* Job Description */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
            Job Description
          </label>
          <div className="relative">
            <textarea
              rows="4"
              placeholder="Describe the role, responsibilities, and required skills..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 resize-none bg-gray-50 focus:bg-white group-hover:border-purple-300"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">{jobDescription.length}/500</div>
          </div>
        </div>

        {/* Company Details */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
            <Building className="w-4 h-4 mr-2 text-purple-500" />
            Company Details
          </label>
          <div className="relative">
            <textarea
              rows="3"
              placeholder="Company industry, culture, recent news, or any specific details..."
              value={companyDetails}
              onChange={(e) => setCompanyDetails(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 resize-none bg-gray-50 focus:bg-white group-hover:border-purple-300"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">{companyDetails.length}/300</div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!jobDescription.trim() || !companyDetails.trim()}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
            jobDescription.trim() && companyDetails.trim()
              ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit Job Details
        </button>

        {/* Status Message */}
        {submitStatus && (
          <div
            className={`p-4 rounded-lg flex items-center animate-slide-up ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{submitStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetailsForm
