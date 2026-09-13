"use client"
import { useState, useEffect, useRef, useCallback } from "react"

/**
 * useUserCamera
 *
 * Manages the user's camera stream for the User speaker tile.
 * Audio is intentionally excluded (mic is handled by the STT hook).
 *
 * Returns:
 *  stream     – MediaStream | null
 *  isEnabled  – boolean
 *  isLoading  – boolean (while getUserMedia is pending)
 *  error      – string | null
 *  toggle     – () => void  (start or stop camera)
 */
export function useUserCamera() {
  const [stream, setStream] = useState(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const streamRef = useRef(null)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setStream(null)
    setIsEnabled(false)
  }, [])

  const toggle = useCallback(async () => {
    if (isEnabled) {
      stopStream()
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false, // mic handled separately by useSpeechToText
      })
      streamRef.current = mediaStream
      setStream(mediaStream)
      setIsEnabled(true)
    } catch (err) {
      console.warn("Camera access error:", err)
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission denied.")
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No camera found on this device.")
      } else {
        setError("Could not access camera.")
      }
      setIsEnabled(false)
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled, stopStream])

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  return { stream, isEnabled, isLoading, error, toggle }
}
