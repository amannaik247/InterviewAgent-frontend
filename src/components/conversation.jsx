import { Bot, User, Mic } from "lucide-react"
import { useRef, useEffect } from "react"

const Conversation = ({ conversation, isRecording, isProcessingTranscription }) => {
  const conversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation, isRecording, isProcessingTranscription]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 pb-8 max-h-96 overflow-y-auto" ref={conversationRef}>
      <div className="sticky top-0 bg-white shadow-xl rounded-t-2xl pt-4 pb-2 px-8 z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
            💬
          </div>
          Interview Conversation
        </h2>
      </div>

      <div className="space-y-4 px-8">
        {conversation.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No conversation yet. Start the interview to begin!</p>
          </div>
        ) : (
          conversation.map((item, idx) => (
            <div
              key={idx}
              className={`flex ${item.type === "question" ? "justify-start" : "justify-end"} animate-slide-up`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  item.type === "question"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center mb-2">
                  {item.type === "question" ? <Bot className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  <span className="font-semibold text-sm">{item.type === "question" ? "AI Interviewer" : "You"}</span>
                </div>
                <p className="text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))
        )}

        {/* Processing Indicator */}
        {isProcessingTranscription && (
          <div className="flex justify-end animate-pulse">
            <div className="bg-blue-100 border border-blue-200 px-4 py-3 rounded-2xl max-w-xs">
              <div className="flex items-center text-blue-600">
                <span className="font-medium text-sm">Processing...</span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-4 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-4 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex justify-end animate-pulse">
            <div className="bg-red-100 border border-red-200 px-4 py-3 rounded-2xl max-w-xs">
              <div className="flex items-center text-red-600">
                <Mic className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Listening...</span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-4 bg-red-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-4 bg-red-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-4 bg-red-400 rounded-full animate-bounce"
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

export default Conversation
