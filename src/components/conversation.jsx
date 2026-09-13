import { Bot, User, Mic } from "lucide-react"
import { useRef, useEffect } from "react"

const Conversation = ({ conversation, isRecording, isProcessingTranscription, isSpeakingLoading, liveTranscript }) => {
  const conversationRef = useRef(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation, isRecording, isProcessingTranscription, isSpeakingLoading, liveTranscript]);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto pr-1" ref={conversationRef}>
      <div className="space-y-4 py-2 flex-grow">
        {conversation.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Bot className="w-8 h-8 text-white/60" />
            </div>
            <p className="dark:text-gray-300 text-gray-600 font-medium">No conversation yet. Start the interview to begin!</p>
          </div>
        ) : (
          conversation.map((item, idx) => (
            <div
              key={idx}
              className={`flex ${item.type === "question" ? "justify-start" : "justify-end"} animate-slide-up`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                  item.type === "question"
                    ? "bg-slate-800 border-l-4 border-orange-500 text-slate-200"
                    : "bg-gray-800/90 border border-gray-700/80 text-gray-200"
                }`}
              >
                <div className="flex items-center mb-1.5">
                  {item.type === "question" ? (
                    <Bot className="w-4 h-4 mr-2 text-orange-500" />
                  ) : (
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  <span className={`font-semibold text-xs ${item.type === "question" ? "text-orange-500" : "text-gray-400"}`}>
                    {item.type === "question" ? "AI Interviewer" : "You"}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${item.type === "question" ? "text-slate-200" : "text-gray-200"}`}>
                  {item.text}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Processing Indicator */}
        {isProcessingTranscription && (
          <div className="flex justify-end animate-pulse">
            <div className="bg-gray-800/90 border border-gray-700 px-4 py-3 rounded-2xl max-w-xs">
              <div className="flex items-center text-white/70 dark:text-gray-300">
                <span className="font-medium text-xs">Transcribing voice...</span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-3 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-3 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TTS Audio Speaking Indicator (Small, subtle & grayed out) */}
        {isSpeakingLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800/80 border border-slate-700/80 text-slate-400 px-3 py-1.5 rounded-xl max-w-xs text-xs flex items-center space-x-2">
              <Bot className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-xs">AI speaking...</span>
              <div className="flex space-x-1 ml-1">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Recording Indicator & Persistent Live Speech Transcript */}
        {isRecording && (
          <div className="flex justify-end animate-slide-up mt-2">
            <div className="bg-gray-900/90 border border-orange-500/50 px-4 py-3 rounded-2xl max-w-lg shadow-lg">
              <div className="flex items-start text-gray-200">
                <Mic className="w-4 h-4 mr-2 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex flex-col flex-grow">
                  <span className="font-semibold text-xs text-orange-400 flex items-center">
                    Live Speech Transcript:
                  </span>
                  <p className="text-sm italic text-gray-100 mt-1 leading-relaxed">
                    {liveTranscript || "Listening... Speak into your microphone."}
                  </p>
                </div>
                <div className="ml-3 flex space-x-1 flex-shrink-0 mt-1">
                  <div className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
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

export default Conversation