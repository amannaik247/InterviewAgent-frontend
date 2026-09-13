import { useEffect, useRef, useState } from "react"

/**
 * LiveCaptionOverlay
 *
 * Renders a sliding-window live-subtitle strip at the bottom of a tile.
 * Shows the last ~6 words from `text`, fading in word-by-word.
 *
 * Props:
 *  text       – full rolling transcript string (updated progressively)
 *  colorScheme – "orange" | "white"  (accent colour for active word)
 *  visible    – boolean; when false the bar fades out
 */
const WORDS_SHOWN = 6

export default function LiveCaptionOverlay({ text = "", colorScheme = "orange", visible = true }) {
  const [displayWords, setDisplayWords] = useState([])
  const [opacity, setOpacity] = useState(0)
  const fadeTimerRef = useRef(null)

  // Build the sliding window of words whenever text changes
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(Boolean)
    const last = words.slice(-WORDS_SHOWN)
    setDisplayWords(last)
  }, [text])

  // Fade in when visible + has content, fade out otherwise
  useEffect(() => {
    clearTimeout(fadeTimerRef.current)
    if (visible && displayWords.length > 0) {
      setOpacity(1)
    } else {
      // Short delay before fading so last words don't vanish instantly
      fadeTimerRef.current = setTimeout(() => setOpacity(0), visible ? 0 : 800)
    }
    return () => clearTimeout(fadeTimerRef.current)
  }, [visible, displayWords.length])

  const accentClass = colorScheme === "orange" ? "text-orange-300" : "text-blue-200"

  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{ transition: "opacity 300ms ease", opacity }}
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Gradient scrim for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent rounded-b-2xl" />

      {/* Caption text */}
      <div className="relative px-4 pb-4 pt-8 flex flex-wrap gap-x-1.5 gap-y-0.5 justify-center">
        {displayWords.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={`text-sm sm:text-base font-medium tracking-wide ${
              i === displayWords.length - 1 ? accentClass : "text-white/90"
            }`}
            style={{
              animation: "captionWordIn 220ms ease forwards",
              display: "inline-block",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes captionWordIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
