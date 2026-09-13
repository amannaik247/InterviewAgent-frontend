import { useRef, useEffect } from "react"
import CircularAudioVisualizer from "./CircularAudioVisualizer"
import LiveCaptionOverlay from "./LiveCaptionOverlay"
import { Video, VideoOff } from "lucide-react"

/**
 * SpeakerTile
 *
 * A full video-call-style tile for one speaker (AI or User).
 *
 * Props:
 *  label        – "AI Interviewer" | "You"
 *  colorScheme  – "orange" | "white"
 *  isSpeaking   – boolean (drives orb animation)
 *  audio        – HTMLAudioElement | null  (AI playback)
 *  micStream    – MediaStream | null       (user mic, for white orb amplitude)
 *  captionText  – string (rolling live transcript)
 *  captionVisible – boolean
 *  videoStream  – MediaStream | null       (user camera; renders video if truthy)
 *  statusBadge  – string | null            (e.g. "AI Speaking...")
 *  statusDot    – "orange" | "red" | "slate" (badge dot color)
 *  onCameraToggle – () => void | undefined (show camera btn only on User tile)
 *  cameraEnabled  – boolean
 *  cameraLoading  – boolean
 */
export default function SpeakerTile({
  label,
  colorScheme = "orange",
  isSpeaking = false,
  audio = null,
  micStream = null,
  captionText = "",
  captionVisible = false,
  videoStream = null,
  statusBadge = null,
  statusDot = "slate",
  onCameraToggle,
  cameraEnabled = false,
  cameraLoading = false,
}) {
  const videoRef = useRef(null)

  // Attach camera stream to the <video> element
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream
    } else if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [videoStream])

  // ── Tile accent styles by color scheme ───────────────────────────────────
  const isOrange = colorScheme === "orange"
  const borderAccent = isOrange ? "border-orange-500/30" : "border-blue-400/30"
  const bgGradient = isOrange
    ? "from-[#1a1008] via-[#0f172a] to-[#0B1220]"
    : "from-[#080d1a] via-[#0f172a] to-[#0B1220]"
  const labelColor = isOrange ? "text-orange-400" : "text-blue-300"
  const labelBg = isOrange ? "bg-orange-500/10 border-orange-500/25" : "bg-blue-500/10 border-blue-400/25"

  const dotColors = {
    orange: "bg-orange-400",
    red:    "bg-red-400 animate-pulse",
    slate:  "bg-slate-400 animate-ping",
  }

  return (
    <div
      className={`relative flex-1 min-h-0 rounded-2xl border ${borderAccent} bg-gradient-to-br ${bgGradient} overflow-hidden shadow-2xl`}
      style={{ minHeight: "280px" }}
    >
      {/* ── Speaker label (top-left) ─────────────────────────────────────── */}
      <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${labelBg} backdrop-blur-sm`}>
        <span className={`text-xs font-semibold tracking-wide ${labelColor}`}>{label}</span>
      </div>

      {/* ── Status badge (top-right) ─────────────────────────────────────── */}
      {statusBadge && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm">
          <div className={`w-1.5 h-1.5 rounded-full ${dotColors[statusDot] || dotColors.slate}`} />
          <span className="text-xs text-slate-300 font-medium">{statusBadge}</span>
        </div>
      )}

      {/* ── Camera toggle button (User tile only, bottom-left) ───────────── */}
      {onCameraToggle && (
        <button
          onClick={onCameraToggle}
          disabled={cameraLoading}
          title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          className={`absolute bottom-2 left-2 z-20 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-200 backdrop-blur-sm ${
            cameraLoading
              ? "bg-slate-800/70 border-slate-600 opacity-60 cursor-wait"
              : cameraEnabled
              ? "bg-blue-500/20 border-blue-400/50 text-blue-300 hover:bg-blue-500/30"
              : "bg-slate-800/70 border-slate-600 text-slate-400 hover:border-blue-400/50 hover:text-blue-300"
          }`}
        >
          {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
      )}

      {/* ── Main content: video feed OR orb animation ────────────────────── */}
      <div className="absolute inset-0">
        {videoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" /* mirror selfie view */ }}
          />
        ) : (
          <CircularAudioVisualizer
            audio={audio}
            micStream={micStream}
            colorScheme={colorScheme}
            isSpeaking={isSpeaking}
            idlePulse
          />
        )}
      </div>

      {/* ── Live caption overlay (bottom) ───────────────────────────────── */}
      <LiveCaptionOverlay
        text={captionText}
        colorScheme={colorScheme}
        visible={captionVisible}
      />
    </div>
  )
}
