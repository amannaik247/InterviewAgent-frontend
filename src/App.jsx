"use client"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import HeroSection from "./components/hero-section"
import ResumeUpload from "./components/resume-upload"
import JobDetailsForm from "./components/job-details-form"
import StartInterviewButton from "./components/start-interview-button"
import Conversation from "./components/conversation"
import RecordingControls from "./components/recording-controls"
import AnalysisDisplay from "./components/AnalysisDisplay"
import CircularAudioVisualizer from "./components/CircularAudioVisualizer"

function App() {
  useEffect(() => {
    let userId = localStorage.getItem("interview_user_id")
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem("interview_user_id", userId)
    }

    // Load saved state from localStorage
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

  const [isResumeUploaded, setIsResumeUploaded] = useState(false)
  const [jobDetailsSubmitted, setJobDetailsSubmitted] = useState(false);

  useEffect(() => {
    const savedJobDetailsSubmitted = localStorage.getItem("jobDetailsSubmitted") === "true";
    setJobDetailsSubmitted(savedJobDetailsSubmitted);
  }, []);

  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [companyDetails, setCompanyDetails] = useState("")
  const [conversation, setConversation] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const audioRef = useRef(null)

  const [resumeUploadStatus, setResumeUploadStatus] = useState(null)
  const [jobDetailsSubmitStatus, setJobDetailsSubmitStatus] = useState(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [SpeechSDK, setSpeechSDK] = useState(null);
  const [isProcessingTranscription, setIsProcessingTranscription] = useState(false);
  const [speakingAudio, setSpeakingAudio] = useState(null);

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

  const API_BASE = "http://127.0.0.1:8000"

  const handleUploadResume = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "X-User-ID": localStorage.getItem("interview_user_id") },
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

  const handleSubmitJobDetails = async () => {
    if (!jobDescription || !companyDetails) {
      setJobDetailsSubmitStatus({ type: "error", message: "Please fill in both job description and company details." })
      return
    }

    setJobDetailsSubmitStatus({ type: "loading", message: "Submitting job details..." });

    const formData = new FormData()
    formData.append("job_description", jobDescription)
    formData.append("company_details", companyDetails)

    try {
      const response = await axios.post(`${API_BASE}/job/update_details`, formData, {
        headers: { "X-User-ID": localStorage.getItem("interview_user_id") },
        withCredentials: true,
      })
      setJobDetailsSubmitStatus({
        type: "success",
        message: response.data.message || "Job details updated successfully.",
      });
      setJobDetailsSubmitted(true);
    } catch (err) {
      console.error(err);
      setJobDetailsSubmitStatus({ type: "error", message: "Error submitting job details." });
      setJobDetailsSubmitted(false);
    }
  }

  const speak = async (text) => {
    const voice = "Jennifer-PlayAI" //set interviewer voice here
    // some good voices Jennifer, Deedee, Judy - female; Basil - male
    const res = await fetch(`${API_BASE}/speak/speak_up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": localStorage.getItem("interview_user_id")
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!res.ok) {
      console.error("TTS request failed");
      return;
    }

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    setSpeakingAudio(audio);
    audio.play();
  }

  const handleStartInterview = async () => {
    try {
      const res = await axios.post(`${API_BASE}/question/generate`, null, {
        headers: { "X-User-ID": localStorage.getItem("interview_user_id") },
        withCredentials: true,
      })
      const question = res.data.question
      setConversation((prev) => [...prev, { type: "question", text: question }])
      speak(question)
      setInterviewStarted(true)
      // Removed setInterviewId as interview_id is now user_id and handled by the backend
    } catch (err) {
      console.error(err.response.data)
      alert("Error generating initial interview question.")
    }
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
          setIsProcessingTranscription(true);
        const blob = new Blob(chunks, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(blob)
        audioRef.current.src = audioUrl

        // Send to backend for transcription
        const formData = new FormData()
        formData.append("file", blob, "recording.webm")

        try {
          const transRes = await axios.post(`${API_BASE}/transcribe`, formData, {
            headers: { "X-User-ID": localStorage.getItem("interview_user_id") },
          })
          const userText = transRes.data.text

          setConversation((prev) => [...prev, { type: "answer", text: userText }])
          setIsProcessingTranscription(false);

          // Now send this to generate a follow-up question
          const followRes = await axios.post(`${API_BASE}/question/generate`,
            { user_input: userText }, // Axios sends data directly as the second argument
            {
              headers: { "X-User-ID": localStorage.getItem("interview_user_id") },
              withCredentials: true,
            }
          )
          const followUp = followRes.data.question

          setConversation((prev) => [...prev, { type: "question", text: followUp }])
          speak(followUp)
        } catch (err) {
          console.error(err)
          alert("Error transcribing or generating next question.")
        }
      }

      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error(err)
      alert("Microphone access denied or not working.")
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const handleStartNewInterview = () => {
    localStorage.removeItem("interview_user_id");
    localStorage.removeItem("interviewStarted");
    localStorage.removeItem("jobDescription");
    localStorage.removeItem("companyDetails");
    localStorage.removeItem("conversation");
    localStorage.removeItem("isResumeUploaded");
    window.location.reload(); // Reload the page to reset state
  };

  const handleFinishInterview = async () => {
    if (isRecording) {
      handleStopRecording(); // Stop recording if still active
    }
    try {
      // The /evaluate endpoint now relies on X-User-ID header, no interviewId needed in path
      const res = await axios.post(`${API_BASE}/evaluate`, null, {
        headers: { "X-User-ID": localStorage.getItem("interview_user_id") },
        withCredentials: true,
      });
      setAnalysisData(res.data);
    } catch (err) {
      console.error("Error fetching analysis:", err);
      alert("Error fetching interview analysis.");
    }
  };

  const isInterviewReady = isResumeUploaded && jobDetailsSubmitted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <HeroSection />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!interviewStarted ? (
          <div className="space-y-8">
            <ResumeUpload
              onFileChange={setResumeFile}
              onUpload={handleUploadResume}
              uploadStatus={resumeUploadStatus}
              setResumeUploadStatus={setResumeUploadStatus}
            />
            <JobDetailsForm
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              companyDetails={companyDetails}
              setCompanyDetails={setCompanyDetails}
              onSubmit={handleSubmitJobDetails}
              submitStatus={jobDetailsSubmitStatus}
            />
            <StartInterviewButton onStart={handleStartInterview} isDisabled={!isInterviewReady} />
          </div>
        ) : (
          <div className="space-y-8">
            <CircularAudioVisualizer audio={speakingAudio} canvasWidth={600} canvasHeight={200} />
            <Conversation conversation={conversation} isRecording={isRecording} isProcessingTranscription={isProcessingTranscription} />
            <RecordingControls
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              audioRef={audioRef}
            />
            <button
              onClick={handleStartNewInterview}
              className="w-full py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out
              bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600
              focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 mb-4"
            >
              Start New Interview
            </button>
            <button
              onClick={handleFinishInterview}
              className="w-full py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out
              bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700
              focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75"
            >
              Finish Interview & Get Analysis
            </button>
            {analysisData && <AnalysisDisplay analysis={analysisData} />}
            <div className="flex justify-center mt-8">
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
