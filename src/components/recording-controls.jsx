"use client"
import { Mic, Square } from "lucide-react"

const RecordingControls = ({ onStartRecording, onStopRecording, isRecording, isProcessingTranscription }) => {
  return (
    <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 pt-4 px-4 pb-4 flex items-center justify-between w-1/2 mx-auto">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform flex items-center space-x-3 ${isRecording
            ? "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white shadow-lg hover:shadow-xl"
            : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
          }`}
      >
        {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        <span>{isRecording ? "Stop Recording" : "Record Response"}</span>
      </button>

      <div className="flex items-center space-x-4">
        {isProcessingTranscription && (
          <div className="flex animate-pulse">
            <div className="bg-blue-100 border border-blue-200 px-3 py-2 rounded-xl">
              <div className="flex items-center text-blue-600">
                <span className="font-medium text-sm">Processing...</span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="flex animate-pulse">
            <div className="bg-red-100 border border-red-200 px-3 py-2 rounded-xl">
              <div className="flex items-center text-red-600">
                <Mic className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Listening...</span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-3 bg-red-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-3 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-3 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordingControls
