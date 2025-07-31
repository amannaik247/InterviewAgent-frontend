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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      {/* Step Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          1
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Upload Your Resume</h2>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-blue-500 bg-blue-50 scale-105"
            : uploadStatus && uploadStatus.type === "success"
              ? "border-green-500 bg-green-50"
              : uploadStatus && uploadStatus.type === "error"
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
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
              <FileText className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">{fileName}</p>
            </div>
          ) : (
            <div>
              <Upload
                className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
                  isDragOver ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <p className="text-lg font-medium text-gray-700 mb-2">Drop your PDF here or click to browse</p>
              <p className="text-sm text-gray-500">Supports PDF files up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}


      {/* Status Message */}
      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center animate-slide-up ${
            uploadStatus.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : uploadStatus.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
          }`} 
        >
          {uploadStatus.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : uploadStatus.type === "error" ? (
            <AlertCircle className="w-5 h-5 mr-2" />
          ) : (
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            </div>
          )}
          <span className="font-medium">{uploadStatus.message}</span>
        </div>
      )}
    </div>
  )
}

export default ResumeUpload
