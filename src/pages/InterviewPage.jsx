"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  MessageSquare, BarChart2, RotateCcw, Mic, Pause,
  Info, CheckCircle2, X, ScrollText, ChevronRight,
} from "lucide-react"
import SpeakerTile from "../components/SpeakerTile"
import RecordingControls from "../components/recording-controls"
import Conversation from "../components/conversation"
import AnalysisDisplay from "../components/AnalysisDisplay"
import { useUserCamera } from "../hooks/useUserCamera"

// ─── Guidelines Modal ────────────────────────────────────────────────────────
const GUIDELINES = [
  {
    icon: <Mic className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />,
    text: "Press Record Response before you start speaking. The mic captures your audio only while recording is active.",
  },
  {
    icon: <Pause className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />,
    text: "Press Stop Recording once you have finished your answer. This sends your response to the AI for the next question.",
  },
  {
    icon: <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />,
    text: "Wait for the AI to finish speaking before you record your next answer — the button will be disabled while the AI is talking.",
  },
  {
    icon: <MessageSquare className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />,
    text: "Speak clearly and at a natural pace. Short pauses are fine — finish your complete thought before pausing.",
  },
  {
    icon: <BarChart2 className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />,
    text: "Click Analyze Interview once you have answered at least 2 questions. The AI will grade your communication, knowledge, problem-solving, and more.",
  },
  {
    icon: <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />,
    text: "Toggle the Transcript panel to review your full conversation at any time.",
  },
]

function GuidelinesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
        {/* Glow accent */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
            <Info className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Interview Guidelines</h2>
            <p className="text-xs text-slate-400">Read before you begin</p>
          </div>
        </div>

        {/* Guidelines list */}
        <ul className="space-y-3 mb-6">
          {GUIDELINES.map((g, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
              {g.icon}
              <span>{g.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Got it — Let's go!
        </button>
      </div>
    </div>
  )
}

// ─── AI Caption Hook ─────────────────────────────────────────────────────────
/**
 * Returns the caption text to show on the AI tile.
 * When AI is speaking → cycle through words of the last question (simulated streaming).
 * When AI stops → fade out after delay.
 */
function useAICaption(conversation, isAISpeaking) {
  const [caption, setCaption] = useState("")
  const [captionVisible, setCaptionVisible] = useState(false)
  const wordTimerRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const prevSpeakingRef = useRef(false)

  useEffect(() => {
    if (isAISpeaking && !prevSpeakingRef.current) {
      // AI just started speaking — find the last question
      const lastQ = [...conversation].reverse().find((m) => m.type === "question")
      if (lastQ) {
        const words = lastQ.text.trim().split(/\s+/)
        let idx = 0
        setCaptionVisible(true)
        clearTimeout(fadeTimerRef.current)
        clearInterval(wordTimerRef.current)

        // Reveal words progressively, ~4 words per "chunk" every 600ms
        const CHUNK = 4
        const revealNext = () => {
          const slice = words.slice(0, idx + CHUNK).join(" ")
          setCaption(slice)
          idx += CHUNK
          if (idx < words.length) {
            wordTimerRef.current = setTimeout(revealNext, 600)
          }
        }
        revealNext()
      }
    }

    if (!isAISpeaking && prevSpeakingRef.current) {
      // AI just stopped — fade caption out after 2s
      clearInterval(wordTimerRef.current)
      fadeTimerRef.current = setTimeout(() => {
        setCaptionVisible(false)
        setTimeout(() => setCaption(""), 400)
      }, 2000)
    }

    prevSpeakingRef.current = isAISpeaking

    return () => {
      clearTimeout(wordTimerRef.current)
      clearTimeout(fadeTimerRef.current)
    }
  }, [isAISpeaking, conversation])

  return { caption, captionVisible }
}

// ─── Transcript Drawer ───────────────────────────────────────────────────────
function TranscriptDrawer({ open, conversation, isRecording, isProcessingTranscription, isSpeakingLoading, liveTranscript, onClose }) {
  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-40 w-full max-w-sm
          bg-[#0F172A] border-l border-slate-800 shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-white">Full Transcript</span>
            {conversation.length > 0 && (
              <span className="text-xs text-slate-500 ml-1">
                ({Math.floor(conversation.length / 2)} Q&amp;A)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drawer body — reuses the existing Conversation component unchanged */}
        <div className="flex-1 overflow-hidden p-4">
          <Conversation
            conversation={conversation}
            isRecording={isRecording}
            isProcessingTranscription={isProcessingTranscription}
            isSpeakingLoading={isSpeakingLoading}
            liveTranscript={liveTranscript}
          />
        </div>
      </div>
    </>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function InterviewPage({
  conversation,
  isRecording,
  isProcessingTranscription,
  isSpeakingLoading,
  isBrowserSpeaking,
  speakingAudio,
  fullTranscript,
  onStartRecording,
  onStopRecording,
  onFinishInterview,
  onStartNewInterview,
  onGuidelinesAccepted,
  analysisData,
  analysisStatus,
}) {
  const [activeTab, setActiveTab] = useState("interview")
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  const { stream: cameraStream, isEnabled: cameraEnabled, isLoading: cameraLoading, toggle: toggleCamera } = useUserCamera()

  // Show guidelines once per browser session
  useEffect(() => {
    const seen = sessionStorage.getItem("interview_guidelines_seen")
    if (!seen) {
      setShowGuidelines(true)
      sessionStorage.setItem("interview_guidelines_seen", "true")
    } else {
      onGuidelinesAccepted?.()
    }
  }, [])

  const isAISpeaking = isBrowserSpeaking || isSpeakingLoading

  // AI tile caption (progressive word reveal)
  const { caption: aiCaption, captionVisible: aiCaptionVisible } = useAICaption(conversation, isAISpeaking)

  // User tile caption — live STT transcript, visible while recording
  const userCaption = fullTranscript || ""
  const userCaptionVisible = isRecording && userCaption.length > 0

  const handleTriggerAnalysis = async () => {
    if (isRecording) onStopRecording()
    setActiveTab("analysis")
    await onFinishInterview()
  }

  const handleCloseGuidelines = () => {
    setShowGuidelines(false)
    onGuidelinesAccepted?.()
  }

  const handleConfirmStartNew = () => {
    if (window.confirm("Start a new interview session? This will reset your current conversation and analysis.")) {
      sessionStorage.removeItem("interview_guidelines_seen")
      onStartNewInterview()
    }
  }

  const MIN_MESSAGES_FOR_ANALYSIS = 4

  // AI status badge
  const aiStatusBadge = isAISpeaking ? "AI Speaking..." : null
  const aiStatusDot = isAISpeaking ? "orange" : "slate"

  // User status badge
  const userStatusBadge = isRecording
    ? "Recording..."
    : isProcessingTranscription
    ? "Processing..."
    : null
  const userStatusDot = isRecording ? "red" : "slate"

  return (
    <div className="h-screen bg-[#0B1220] text-slate-50 flex flex-col overflow-hidden">
      {/* Guidelines modal */}
      {showGuidelines && <GuidelinesModal onClose={handleCloseGuidelines} />}

      {/* ── Transcript Drawer ──────────────────────────────────────────────── */}
      <TranscriptDrawer
        open={showTranscript}
        conversation={conversation}
        isRecording={isRecording}
        isProcessingTranscription={isProcessingTranscription}
        isSpeakingLoading={isAISpeaking}
        liveTranscript={fullTranscript}
        onClose={() => setShowTranscript(false)}
      />

      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md flex-shrink-0 z-10">
        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 sm:space-x-2 ${
              activeTab === "interview"
                ? "bg-[#1E2A3A] text-orange-400 border-b-2 border-orange-500 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${activeTab === "interview" ? "text-orange-500" : ""}`} />
            <span>Interview</span>
          </button>

          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 sm:space-x-2 ${
              activeTab === "analysis"
                ? "bg-[#1E2A3A] text-orange-400 border-b-2 border-orange-500 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BarChart2 className={`w-4 h-4 ${activeTab === "analysis" ? "text-orange-500" : ""}`} />
            <span>Analysis</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
              showTranscript
                ? "bg-orange-500/15 border-orange-500/50 text-orange-300"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-orange-500/40"
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Transcript</span>
            {showTranscript ? (
              <ChevronRight className="w-3 h-3 rotate-180 transition-transform" />
            ) : (
              <ChevronRight className="w-3 h-3 transition-transform" />
            )}
          </button>

          {/* Start New Interview */}
          <button
            onClick={handleConfirmStartNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-orange-500/40 transition-all duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start New Interview</span>
          </button>

          {/* Guidelines info button */}
          <button
            onClick={() => setShowGuidelines(true)}
            title="View interview guidelines"
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500/40 flex items-center justify-center transition-all duration-200"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">

        {/* Interview tab: dual tiles */}
        {activeTab === "interview" && (
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Tiles area */}
            <div className="flex-1 min-h-0 flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
              {/* ── AI Interviewer Tile ──────────────────────────────────── */}
              <SpeakerTile
                label="AI Interviewer"
                colorScheme="orange"
                isSpeaking={isAISpeaking}
                audio={speakingAudio}
                captionText={aiCaption}
                captionVisible={aiCaptionVisible}
                statusBadge={aiStatusBadge}
                statusDot={aiStatusDot}
              />

              {/* ── User Tile ────────────────────────────────────────────── */}
              <SpeakerTile
                label="You"
                colorScheme="white"
                isSpeaking={isRecording}
                micStream={null /* Note: STT hook handles mic separately; orb uses isSpeaking */}
                captionText={userCaption}
                captionVisible={userCaptionVisible}
                videoStream={cameraStream}
                statusBadge={userStatusBadge}
                statusDot={userStatusDot}
                onCameraToggle={toggleCamera}
                cameraEnabled={cameraEnabled}
                cameraLoading={cameraLoading}
              />
            </div>

            {/* ── Control Bar ──────────────────────────────────────────────── */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <RecordingControls
                isRecording={isRecording}
                isSpeaking={isAISpeaking}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                onAnalyzeInterview={handleTriggerAnalysis}
                isProcessingTranscription={isProcessingTranscription}
                conversationLength={conversation.length}
                minMessagesForAnalysis={MIN_MESSAGES_FOR_ANALYSIS}
              />
            </div>
          </div>
        )}

        {/* Analysis tab */}
        {activeTab === "analysis" && (
          <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto">
            <AnalysisDisplay analysis={analysisData} analysisStatus={analysisStatus} />
          </div>
        )}
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.93) } to { opacity: 1; transform: scale(1) } }
        .animate-fadeIn  { animation: fadeIn  0.2s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.22s ease forwards; }
      `}</style>
    </div>
  )
}
