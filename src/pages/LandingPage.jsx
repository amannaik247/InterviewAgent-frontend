"use client"
import React from "react"
import HeroSection from "../components/hero-section"
import ResumeUpload from "../components/resume-upload"
import JobDetailsForm from "../components/job-details-form"
import StartInterviewButton from "../components/start-interview-button"

export default function LandingPage({
  onFileChange,
  onUploadResume,
  uploadStatus,
  setResumeUploadStatus,
  jobDescription,
  setJobDescription,
  companyDetails,
  setCompanyDetails,
  onSubmitJobDetails,
  jobDetailsSubmitStatus,
  onStartInterview,
  isInterviewReady,
}) {
  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 bg-white">
      <HeroSection />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dark:text-white">
        <div className="space-y-4">
          <ResumeUpload
            onFileChange={onFileChange}
            onUpload={onUploadResume}
            uploadStatus={uploadStatus}
            setResumeUploadStatus={setResumeUploadStatus}
          />
          <JobDetailsForm
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            companyDetails={companyDetails}
            setCompanyDetails={setCompanyDetails}
            onSubmit={onSubmitJobDetails}
            submitStatus={jobDetailsSubmitStatus}
          />
          <StartInterviewButton onStart={onStartInterview} isDisabled={!isInterviewReady} />
        </div>
      </div>
    </div>
  )
}
