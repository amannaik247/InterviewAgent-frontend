"use client"
import { Mic, Square, Volume2 } from "lucide-react"

const RecordingControls = ({ onStartRecording, onStopRecording, isRecording, audioRef }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Step Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          🎤
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Record Your Answer</h2>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={onStartRecording}
          disabled={isRecording}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-3 ${
            isRecording
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
          }`}
        >
          <Mic className="w-5 h-5" />
          <span>{isRecording ? "Recording..." : "Start Recording"}</span>
        </button>

        <button
          onClick={onStopRecording}
          disabled={!isRecording}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-3 ${
            !isRecording
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white hover:scale-105 shadow-lg hover:shadow-xl"
          }`}
        >
          <Square className="w-5 h-5" />
          <span>Stop Recording</span>
        </button>
      </div>

      {/* Audio Player */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <Volume2 className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Playback</span>
        </div>
        <audio
          ref={audioRef}
          controls
          className="w-full h-10 rounded-lg"
          style={{
            filter: "sepia(20%) saturate(70%) hue-rotate(200deg) brightness(90%) contrast(90%)",
          }}
        />
      </div>

      {/* Recording Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Recording Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Find a quiet environment to minimize background noise</li>
          <li>• Take your time to think before answering</li>
        </ul>
      </div>
    </div>
  )
}

export default RecordingControls
