"use client"
import { useState, useEffect, useRef, useCallback } from "react"

export function useSpeechToText({ lang = "en-US" } = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [fullTranscript, setFullTranscript] = useState("")
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const shouldBeListeningRef = useRef(false)
  const finalTranscriptRef = useRef("")
  const interimTranscriptRef = useRef("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = lang

        recognition.onresult = (event) => {
          let currentInterim = ""
          let newFinal = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const text = result[0].transcript
            if (result.isFinal) {
              newFinal += text + " "
            } else {
              currentInterim += text
            }
          }

          if (newFinal) {
            finalTranscriptRef.current = (finalTranscriptRef.current + " " + newFinal).trim()
            setTranscript(finalTranscriptRef.current)
            interimTranscriptRef.current = ""
            setInterimTranscript("")
            setFullTranscript(finalTranscriptRef.current)
          } else {
            interimTranscriptRef.current = currentInterim
            setInterimTranscript(currentInterim)
            const combined = (finalTranscriptRef.current + " " + currentInterim).trim()
            setFullTranscript(combined)
          }
        }

        recognition.onerror = (event) => {
          console.warn("Web Speech Recognition error:", event.error)
          if (event.error === "no-speech") {
            // Ignore silence during continuous listening
            return
          }
          if (event.error === "not-allowed") {
            setError("Microphone permission denied.")
            shouldBeListeningRef.current = false
            setIsListening(false)
            return
          }
          if (event.error === "audio-capture") {
            setError("No microphone found on your device.")
            shouldBeListeningRef.current = false
            setIsListening(false)
            return
          }
          setError(`Speech recognition error: ${event.error}`)
        }

        recognition.onend = () => {
          // Auto-restart if recognition stopped unexpectedly while active
          if (shouldBeListeningRef.current) {
            try {
              recognition.start()
            } catch (err) {
              console.warn("Failed to auto-restart speech recognition:", err)
              setIsListening(false)
            }
          } else {
            setIsListening(false)
          }
        }

        recognitionRef.current = recognition
      } else {
        setIsSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        shouldBeListeningRef.current = false
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
    }
  }, [lang])

  const startListening = useCallback(() => {
    setError(null)
    finalTranscriptRef.current = ""
    interimTranscriptRef.current = ""
    setTranscript("")
    setInterimTranscript("")
    setFullTranscript("")
    if (recognitionRef.current) {
      shouldBeListeningRef.current = true
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.warn("Recognition start call:", err)
        setIsListening(true)
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.warn("Recognition stop call:", err)
      }
    }
    setIsListening(false)
    return (finalTranscriptRef.current + " " + interimTranscriptRef.current).trim()
  }, [])

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = ""
    interimTranscriptRef.current = ""
    setTranscript("")
    setInterimTranscript("")
    setFullTranscript("")
  }, [])

  const getFullTranscript = useCallback(() => {
    return (finalTranscriptRef.current + " " + interimTranscriptRef.current).trim()
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    getFullTranscript,
  }
}
