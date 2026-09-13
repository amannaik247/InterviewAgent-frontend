"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

const ResumeUpload = ({ onFileChange, onUpload, uploadStatus, setResumeUploadStatus }) => {
  const [fileName, setFileName] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setResumeUploadStatus({ type: "loading", message: "Uploading resume..." })
      const formData = new FormData()
      formData.append("file", file)
      try {
        await onUpload(formData)
      } catch (err) {
        setFileName("")
        onFileChange(null)
      } finally {
        e.target.value = null
      }
    } else {
      setFileName("")
      onFileChange(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setFileName(file.name)
      onFileChange(file)
    }
  }

  return (
    <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-slate-800 p-6 transition-all duration-300">
      {/* Step Header */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
          1
        </div>
        <h2 className="text-xl font-bold text-slate-50">Upload Your Resume</h2>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-orange-500 bg-slate-800/80"
            : uploadStatus && uploadStatus.type === "success"
            ? "border-emerald-500/60 bg-slate-800/40"
            : uploadStatus && uploadStatus.type === "error"
            ? "border-rose-500/60 bg-slate-800/40"
            : "border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept=".pdf"
        />

        <div className="space-y-4">
          {fileName ? (
            <div className="animate-fade-in">
              <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-emerald-400 font-medium text-sm">{fileName}</p>
            </div>
          ) : (
            <div>
              <Upload
                className={`w-10 h-10 mx-auto mb-3 transition-colors duration-200 ${
                  isDragOver ? "text-orange-500" : "text-slate-400"
                }`}
              />
              <p className="text-base font-medium text-slate-200 mb-1">Drop your PDF here or click to browse</p>
              <p className="text-xs text-slate-400">Supports PDF files up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-xl flex items-center border animate-slide-up ${
            uploadStatus.type === "success"
              ? "bg-slate-800/90 border-emerald-500/40 text-emerald-400"
              : uploadStatus.type === "error"
              ? "bg-slate-800/90 border-rose-500/40 text-rose-400"
              : "bg-slate-800/90 border-slate-700 text-slate-200"
          }`}
        >
          {uploadStatus.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-400 flex-shrink-0" />
          ) : uploadStatus.type === "error" ? (
            <AlertCircle className="w-5 h-5 mr-2 text-rose-400 flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            </div>
          )}
          <span className="font-medium text-xs sm:text-sm text-slate-200">{uploadStatus.message}</span>
          {uploadStatus.type === "loading" && (
            <span className="ml-auto text-right text-xs text-slate-400">First upload may take 30s</span>
          )}
        </div>
      )}
    </div>
  )
}

export default ResumeUpload