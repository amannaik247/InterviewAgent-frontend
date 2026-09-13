"use client"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import InterviewPage from "./pages/InterviewPage"
import { useSpeechToText } from "./hooks/useSpeechToText"
import { useTextToSpeech } from "./hooks/useTextToSpeech"

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const [isResumeUploaded, setIsResumeUploaded] = useState(false)
  const [jobDetailsSubmitted, setJobDetailsSubmitted] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [companyDetails, setCompanyDetails] = useState("")
  const [conversation, setConversation] = useState([])
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [isMediaRecorderRecording, setIsMediaRecorderRecording] = useState(false)
  const audioRef = useRef(null)
  const pendingFirstSpeech = useRef(null)

  const [resumeUploadStatus, setResumeUploadStatus] = useState(null)
  const [jobDetailsSubmitStatus, setJobDetailsSubmitStatus] = useState(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [analysisStatus, setAnalysisStatus] = useState(null)
  const [isProcessingTranscription, setIsProcessingTranscription] = useState(false)
  const [speakingAudio, setSpeakingAudio] = useState(null)
  const [isSpeakingLoading, setIsSpeakingLoading] = useState(false)

  const {
    isSupported: isWebSpeechSupported,
    isListening: isWebSpeechListening,
    interimTranscript,
    fullTranscript,
    startListening: startWebSpeech,
    stopListening: stopWebSpeech,
    getFullTranscript,
    resetTranscript,
  } = useSpeechToText()

  const {
    isSupported: isWebTTSSupported,
    isSpeaking: isBrowserSpeaking,
    speak: speakBrowserText,
    cancel: cancelBrowserSpeech,
  } = useTextToSpeech()

  const isRecording = isWebSpeechSupported ? isWebSpeechListening : isMediaRecorderRecording

  useEffect(() => {
    let userId = localStorage.getItem("interview_user_id")
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem("interview_user_id", userId)
    }

    const savedInterviewStarted = localStorage.getItem("interviewStarted") === "true"
    const savedJobDescription = localStorage.getItem("jobDescription") || ""
    const savedCompanyDetails = localStorage.getItem("companyDetails") || ""
    const savedConversation = JSON.parse(localStorage.getItem("conversation")) || []
    const savedIsResumeUploaded = localStorage.getItem("isResumeUploaded") === "true"
    const savedJobDetailsSubmitted = localStorage.getItem("jobDetailsSubmitted") === "true"

    if (savedInterviewStarted) {
      setInterviewStarted(savedInterviewStarted)
      setJobDescription(savedJobDescription)
      setCompanyDetails(savedCompanyDetails)
      setConversation(savedConversation)
      setIsResumeUploaded(savedIsResumeUploaded)
      setJobDetailsSubmitted(savedJobDetailsSubmitted)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("interviewStarted", interviewStarted)
  }, [interviewStarted])

  useEffect(() => {
    localStorage.setItem("jobDescription", jobDescription)
  }, [jobDescription])

  useEffect(() => {
    localStorage.setItem("companyDetails", companyDetails)
  }, [companyDetails])

  useEffect(() => {
    localStorage.setItem("conversation", JSON.stringify(conversation))
  }, [conversation])

  useEffect(() => {
    localStorage.setItem("isResumeUploaded", isResumeUploaded)
  }, [isResumeUploaded])

  useEffect(() => {
    localStorage.setItem("jobDetailsSubmitted", jobDetailsSubmitted)
  }, [jobDetailsSubmitted])

  const API_BASE = "http://localhost:8000"

  const getUserId = () => {
    let userId = localStorage.getItem("interview_user_id")
    if (!userId || userId === "null" || userId === "undefined") {
      userId = crypto.randomUUID()
      localStorage.setItem("interview_user_id", userId)
    }
    return userId
  }

  const handleUploadResume = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "X-User-ID": getUserId() },
        withCredentials: true,
      })
      setResumeUploadStatus({ type: "success", message: response.data.message || "Resume uploaded successfully." })
      setResumeFile(formData.get("file"))
      setIsResumeUploaded(true)
    } catch (err) {
      console.error(err)
      setResumeUploadStatus({ type: "error", message: "Error uploading resume." })
      setIsResumeUploaded(false)
      throw err
    }
  }

  const getAudioContext = () => {
    if (!window.__interviewAudioContext) {
      window.__interviewAudioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (window.__interviewAudioContext.state === "suspended") {
      window.__interviewAudioContext.resume().catch(() => {})
    }
    return window.__interviewAudioContext
  }

  const handleSubmitJobDetails = async () => {
    getAudioContext()
    if (!jobDescription || !companyDetails) {
      setJobDetailsSubmitStatus({ type: "error", message: "Please fill in both job description and company details." })
      return
    }

    setJobDetailsSubmitStatus({ type: "loading", message: "Submitting job details..." })

    const formData = new FormData()
    formData.append("job_description", jobDescription)
    formData.append("company_details", companyDetails)

    try {
      const response = await axios.post(`${API_BASE}/job/update_details`, formData, {
        headers: { "X-User-ID": getUserId() },
        withCredentials: true,
      })
      setJobDetailsSubmitStatus({
        type: "success",
        message: response.data.message || "Job details updated successfully. Ready to start interview!",
      })
      setJobDetailsSubmitted(true)
    } catch (err) {
      console.error(err)
      setJobDetailsSubmitStatus({ type: "error", message: "Error submitting job details." })
      setJobDetailsSubmitted(false)
    }
  }

  const speakBackendFallback = async (text) => {
    const voice = "Puck"
    setIsSpeakingLoading(true)
    try {
      if (speakingAudio) {
        speakingAudio.pause()
        speakingAudio.currentTime = 0
      }

      const ctx = getAudioContext()
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {})
      }

      const res = await fetch(`${API_BASE}/speak/speak_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": getUserId(),
        },
        body: JSON.stringify({ text, voice }),
      })

      if (!res.ok) {
        console.error("Backend TTS request failed with status:", res.status, res.statusText)
        setIsSpeakingLoading(false)
        return
      }

      const audioBlob = await res.blob()
      if (!audioBlob || audioBlob.size < 100) {
        console.error("Received invalid or 0-byte audio blob from backend TTS endpoint")
        setIsSpeakingLoading(false)
        return
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      setSpeakingAudio(audio)
      setIsSpeakingLoading(false)

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio autoplay blocked by browser policy:", err)
        })
      }
    } catch (err) {
      console.error("Error in backend TTS fallback:", err)
      setIsSpeakingLoading(false)
    }
  }

  const speak = async (text) => {
    cancelBrowserSpeech()
    if (speakingAudio) {
      speakingAudio.pause()
      speakingAudio.currentTime = 0
    }

    if (isWebTTSSupported) {
      const success = speakBrowserText(text, {
        onError: (err) => {
          console.warn("Browser SpeechSynthesis failed, using backend TTS fallback:", err)
          speakBackendFallback(text)
        },
      })
      if (success) return
    }

    await speakBackendFallback(text)
  }

  const handleStartInterview = async () => {
    getAudioContext()
    try {
      const res = await axios.post(`${API_BASE}/question/generate`, null, {
        headers: { "X-User-ID": getUserId() },
        withCredentials: true,
      })
      const question = res.data.question
      setConversation((prev) => [...prev, { type: "question", text: question }])
      setInterviewStarted(true)
      // Store question — speak only after user dismisses the guidelines modal
      pendingFirstSpeech.current = question
      navigate("/interview")
    } catch (err) {
      console.error("Error in /question/generate:", err.response?.data || err)
      const errorMsg = err.response?.data?.detail || "Error generating initial interview question."
      alert(`Could not start interview: ${errorMsg}`)
      navigate("/")
    }
  }

  const handleGuidelinesAccepted = () => {
    if (pendingFirstSpeech.current) {
      speak(pendingFirstSpeech.current)
      pendingFirstSpeech.current = null
    }
  }

  const sendTranscriptToBackend = async (userText) => {
    if (!userText || !userText.trim()) return

    setConversation((prev) => [...prev, { type: "answer", text: userText }])
    setIsProcessingTranscription(true)

    try {
      const followRes = await axios.post(
        `${API_BASE}/question/generate`,
        { user_input: userText },
        {
          headers: { "X-User-ID": getUserId() },
          withCredentials: true,
        }
      )
      const followUp = followRes.data.question

      setConversation((prev) => [...prev, { type: "question", text: followUp }])
      speak(followUp)
    } catch (err) {
      console.error(err)
      alert("Error generating next question.")
    } finally {
      setIsProcessingTranscription(false)
    }
  }

  const handleStartRecording = async () => {
    getAudioContext()
    if (isWebSpeechSupported) {
      startWebSpeech()
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        const chunks = []

        recorder.ondataavailable = (e) => chunks.push(e.data)
        recorder.onstop = async () => {
          setIsProcessingTranscription(true)
          const blob = new Blob(chunks, { type: "audio/webm" })
          const audioUrl = URL.createObjectURL(blob)
          if (audioRef.current) audioRef.current.src = audioUrl

          const formData = new FormData()
          formData.append("file", blob, "recording.webm")

          try {
            const transRes = await axios.post(`${API_BASE}/transcribe`, formData, {
              headers: { "X-User-ID": getUserId() },
            })
            const userText = transRes.data.text
            await sendTranscriptToBackend(userText)
          } catch (err) {
            console.error(err)
            alert("Error transcribing or generating next question.")
            setIsProcessingTranscription(false)
          }
        }

        setMediaRecorder(recorder)
        setAudioChunks(chunks)
        recorder.start()
        setIsMediaRecorderRecording(true)
      } catch (err) {
        console.error(err)
        alert("Microphone access denied or not working.")
      }
    }
  }

  const handleStopRecording = async () => {
    if (isWebSpeechSupported) {
      const capturedText = stopWebSpeech() || getFullTranscript()
      if (capturedText) {
        await sendTranscriptToBackend(capturedText)
      }
    } else {
      if (mediaRecorder && isMediaRecorderRecording) {
        mediaRecorder.stop()
        setIsMediaRecorderRecording(false)
      }
    }
  }

  const handleStartNewInterview = () => {
    cancelBrowserSpeech()
    if (speakingAudio) {
      speakingAudio.pause()
      speakingAudio.currentTime = 0
    }
    if (isRecording) {
      if (isWebSpeechSupported) {
        stopWebSpeech()
      } else if (mediaRecorder) {
        mediaRecorder.stop()
      }
    }

    localStorage.removeItem("interview_user_id")
    localStorage.removeItem("interviewStarted")
    localStorage.removeItem("jobDescription")
    localStorage.removeItem("companyDetails")
    localStorage.removeItem("conversation")
    localStorage.removeItem("isResumeUploaded")
    localStorage.removeItem("jobDetailsSubmitted")

    setInterviewStarted(false)
    setIsResumeUploaded(false)
    setJobDetailsSubmitted(false)
    setJobDescription("")
    setCompanyDetails("")
    setConversation([])
    setAnalysisData(null)
    setAnalysisStatus(null)
    setResumeUploadStatus(null)
    setJobDetailsSubmitStatus(null)
    setResumeFile(null)

    navigate("/")
  }

  const handleFinishInterview = async () => {
    if (isRecording) {
      await handleStopRecording()
    }
    setAnalysisStatus({ type: "loading", message: "Analyzing interview..." })
    try {
      const res = await axios.post(`${API_BASE}/evaluate`, null, {
        headers: { "X-User-ID": getUserId() },
        withCredentials: true,
      })
      setAnalysisData(res.data)
      setAnalysisStatus({ type: "success", message: "Analysis completed!" })
    } catch (err) {
      console.error("Error fetching analysis:", err)
      setAnalysisStatus({ type: "error", message: "Error fetching interview analysis: Need more conversation." })
    }
  }

  const isInterviewReady = isResumeUploaded && jobDetailsSubmitted

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onFileChange={setResumeFile}
            onUploadResume={handleUploadResume}
            uploadStatus={resumeUploadStatus}
            setResumeUploadStatus={setResumeUploadStatus}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            companyDetails={companyDetails}
            setCompanyDetails={setCompanyDetails}
            onSubmitJobDetails={handleSubmitJobDetails}
            jobDetailsSubmitStatus={jobDetailsSubmitStatus}
            onStartInterview={handleStartInterview}
            isInterviewReady={isInterviewReady}
          />
        }
      />
      <Route
        path="/interview"
        element={
          <InterviewPage
            conversation={conversation}
            isRecording={isRecording}
            isProcessingTranscription={isProcessingTranscription}
            isSpeakingLoading={isSpeakingLoading}
            isBrowserSpeaking={isBrowserSpeaking}
            speakingAudio={speakingAudio}
            fullTranscript={fullTranscript}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onFinishInterview={handleFinishInterview}
            onStartNewInterview={handleStartNewInterview}
            onGuidelinesAccepted={handleGuidelinesAccepted}
            analysisData={analysisData}
            analysisStatus={analysisStatus}
          />
        }
      />
    </Routes>
  )
}

export default App