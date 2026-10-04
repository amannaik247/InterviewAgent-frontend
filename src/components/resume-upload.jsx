"use client"

import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle } from "lucide-react"

const ResumeUpload = ({
  onFileChange,
  onUpload,
  uploadStatus,
  setResumeUploadStatus,
  isResumeUploaded,
  onRemoveResume,
  resumeFile,
}) => {
  const [fileName, setFileName] = useState(resumeFile?.name || "")
  const [fileSize, setFileSize] = useState(
    resumeFile
      ? resumeFile.size < 1024 * 1024
        ? `${Math.round(resumeFile.size / 1024)} KB`
        : `${(resumeFile.size / (1024 * 1024)).toFixed(1)} MB`
      : ""
  )
  const [isDragOver, setIsDragOver] = useState(false)
  const [localError, setLocalError] = useState("")
  const fileInputRef = useRef(null)

  const handleValidateAndUpload = async (file) => {
    if (!file) return

    setLocalError("")

    // Validate file type: PDF and DOCX only
    const name = file.name.toLowerCase()
    const isPdf = name.endsWith(".pdf") || file.type === "application/pdf"
    const isDocx =
      name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"

    if (!isPdf && !isDocx) {
      setLocalError("Invalid file type. Only PDF and DOCX files are allowed.")
      return
    }

    // Validate file size: max 5 MB
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setLocalError("File too large. Maximum file size is 5 MB.")
      return
    }

    const formattedSize =
      file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    setFileName(file.name)
    setFileSize(formattedSize)
    onFileChange?.(file)

    if (onUpload) {
      const formData = new FormData()
      formData.append("file", file)
      try {
        setResumeUploadStatus?.({ type: "loading", message: "Uploading resume..." })
        await onUpload(formData)
      } catch (err) {
        setLocalError("Error uploading resume. Please try again.")
      }
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    setFileName("")
    setFileSize("")
    setLocalError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileChange?.(null)
    setResumeUploadStatus?.(null)
    onRemoveResume?.()
  }

  const isUploaded = Boolean(fileName || isResumeUploaded)
  const displayError = localError || (uploadStatus?.type === "error" ? uploadStatus.message : "")

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        id="resume-file-input"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleValidateAndUpload(file)
        }}
      />

      {isUploaded ? (
        <div className="w-full h-[86px] border border-slate-700/80 rounded-[10px] px-3.5 py-2.5 bg-[#131E36]/80 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-[8px] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-[210px]" title={fileName}>
                {fileName}
              </p>
              {fileSize && <p className="text-[11px] text-slate-400 mt-0.5">{fileSize}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="px-2.5 py-1 text-[12px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-[8px] transition-colors cursor-pointer flex-shrink-0"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload resume"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragOver(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) handleValidateAndUpload(file)
          }}
          className={`w-full h-[86px] border border-dashed rounded-[10px] p-2.5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
            isDragOver
              ? "border-orange-500 bg-orange-500/10"
              : displayError
              ? "border-rose-500/60 bg-[#131E36]/60"
              : "border-slate-700/80 bg-[#131E36]/60 hover:border-orange-500/60 hover:bg-orange-500/5"
          }`}
        >
          <Upload className={`w-4 h-4 mb-0.5 transition-colors ${isDragOver ? "text-orange-500" : "text-orange-400"}`} />
          <span className="text-[13px] font-semibold text-slate-200">Upload resume</span>
          <span className="text-[11px] text-slate-400">PDF or DOCX (max 5 MB)</span>
        </div>
      )}

      {displayError && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-rose-400 animate-slide-up" role="alert">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  )
}

export default ResumeUpload