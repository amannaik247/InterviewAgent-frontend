"use client"
import React from "react"
import { Mic, Square, BarChart2, MessageSquare, Loader2 } from "lucide-react"

const RecordingControls = ({
  isRecording,
  isSpeaking,
  onStartRecording,
  onStopRecording,
  onAnalyzeInterview,
  isProcessingTranscription,
  conversationLength = 0,
  minMessagesForAnalysis = 4,
}) => {
  const isRecordDisabled = isSpeaking || isProcessingTranscription
  const canAnalyze = conversationLength >= minMessagesForAnalysis

  return (
    <div className="w-full flex items-center justify-center gap-4">

      {/* ── Primary: Record / Stop button (circular call-button style) ───── */}
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isRecordDisabled}
        title={
          isProcessingTranscription
            ? "Processing your answer..."
            : isSpeaking
            ? "Wait for AI to finish speaking"
            : isRecording
            ? "Stop recording"
            : "Start recording your answer"
        }
        className={`
          relative group w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg flex-shrink-0
          ${
            isRecordDisabled
              ? "bg-slate-800 border-2 border-slate-700 opacity-50 cursor-not-allowed"
              : isRecording
              ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-500/30 hover:shadow-[0_0_28px_rgba(239,68,68,0.55)]"
              : "bg-orange-500/15 border-2 border-orange-500/70 shadow-[0_0_16px_rgba(249,115,22,0.25)] hover:bg-orange-500/25 hover:border-orange-400 hover:shadow-[0_0_24px_rgba(249,115,22,0.4)]"
          }
        `}
      >
        {/* Pulse ring while recording */}
        {isRecording && !isRecordDisabled && (
          <span className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping" />
        )}

        {isProcessingTranscription ? (
          <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
        ) : isRecording ? (
          <Square className="w-6 h-6 text-red-400 fill-red-400" />
        ) : (
          <Mic className={`w-6 h-6 ${isRecordDisabled ? "text-slate-500" : "text-orange-400"}`} />
        )}
      </button>

      {/* ── Label below the big button ───────────────────────────────────── */}
      <div className="flex flex-col items-start gap-2">
        <span className={`text-xs font-medium whitespace-nowrap ${
          isRecordDisabled ? "text-slate-500" : isRecording ? "text-red-400" : "text-slate-300"
        }`}>
          {isProcessingTranscription
            ? "Processing..."
            : isSpeaking
            ? "AI Speaking..."
            : isRecording
            ? "Stop Recording"
            : "Record Response"}
        </span>

        {/* ── Secondary: Analyze button (pill/outline) ─────────────────── */}
        {canAnalyze ? (
          <button
            onClick={onAnalyzeInterview}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 bg-transparent text-orange-400 border border-orange-500/40 hover:bg-orange-500/10 hover:border-orange-400 whitespace-nowrap"
          >
            <BarChart2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Analyze Interview</span>
          </button>
        ) : (
          <div
            title={`Answer at least ${Math.ceil((minMessagesForAnalysis - conversationLength) / 2)} more question(s) to unlock analysis`}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs text-slate-600 border border-slate-800 cursor-not-allowed select-none whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Chat more to analyze</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordingControls