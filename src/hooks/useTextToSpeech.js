"use client"
import { useState, useEffect, useRef, useCallback } from "react"

export function useTextToSpeech({ lang = "en-US" } = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const voiceRef = useRef(null)

  const chooseBestVoice = useCallback((availableVoices) => {
    if (!availableVoices || availableVoices.length === 0) return null

    // 1. Preferred high-quality / natural voices
    const preferredNames = ["Microsoft Mark", "Microsoft Jenny", "Microsoft Aria", "Google US English", "Samantha", "Karen", "Daniel"]
    for (const name of preferredNames) {
      const match = availableVoices.find((v) => v.name.includes(name))
      if (match) return match
    }

    // 2. Natural / Neural / Online voices for English
    const naturalVoice = availableVoices.find(
      (v) =>
        (v.lang.startsWith("en") || v.lang.includes("en")) &&
        (v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("Online") || v.name.includes("Microsoft"))
    )
    if (naturalVoice) return naturalVoice

    // 3. Default English voice
    const defaultEng = availableVoices.find((v) => (v.lang.startsWith("en") || v.lang.includes("en")) && v.default)
    if (defaultEng) return defaultEng

    // 4. Any English voice
    const anyEng = availableVoices.find((v) => v.lang.startsWith("en") || v.lang.includes("en"))
    if (anyEng) return anyEng

    // 5. Fallback to first available voice
    return availableVoices[0]
  }, [])

  const updateVoices = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const available = window.speechSynthesis.getVoices()
      setVoices(available)
      const best = chooseBestVoice(available)
      setSelectedVoice(best)
      voiceRef.current = best
    }
  }, [chooseBestVoice])

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)

      // Initial fetch
      updateVoices()

      // Chrome/Edge load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices
      }
    } else {
      setIsSupported(false)
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [updateVoices])

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [])

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [])

  const speak = useCallback(
    (text, { onEnd, onError } = {}) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onError) onError(new Error("SpeechSynthesis not supported"))
        return false
      }

      try {
        // Cancel any active utterance to prevent overlap
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        if (voiceRef.current) {
          utterance.voice = voiceRef.current
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          setIsPaused(false)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          setIsPaused(false)
          if (onEnd) onEnd()
        }

        utterance.onerror = (event) => {
          console.warn("SpeechSynthesis error event:", event)
          setIsSpeaking(false)
          setIsPaused(false)
          if (onError) onError(event)
        }

        window.speechSynthesis.speak(utterance)
        return true
      } catch (err) {
        console.error("Failed to invoke SpeechSynthesis.speak:", err)
        setIsSpeaking(false)
        setIsPaused(false)
        if (onError) onError(err)
        return false
      }
    },
    [lang]
  )

  return {
    isSupported,
    voices,
    selectedVoice,
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    cancel,
  }
}
