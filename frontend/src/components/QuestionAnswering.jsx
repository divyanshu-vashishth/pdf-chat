import { useState } from "react"
import axios from "axios"
import ai from '../assets/ai.svg'

function QuestionAnswering({ activeDoc }) {
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState("")

  const handleQuestionSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError("")
    const userMessage = { role: "user", content: question }
    setConversation((prev) => [...prev, userMessage])

    const formData = new FormData()
    formData.append("doc_id", activeDoc.id)
    formData.append("question", question)

    try {
      const response = await axios.post("http://localhost:8000/ask-question", formData)
      const aiMessage = { role: "assistant", content: response.data.answer }
      setConversation((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Error asking question:", err)
      setError("Failed to get an answer. Please try again.")
    } finally {
      setLoading(false)
      setQuestion("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] relative">
      <div className="flex-1 overflow-y-auto mb-4">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500"></div>
        ) : (
          <div className="space-y-8 py-4">
            {conversation.map((message, index) => (
              <div key={index} className="max-w-6xl mx-auto">
                {message.role === "user" ? (
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-2xl text-white font-semibold">
                      u
                    </div>
                    <div className="ml-4 max-w-6xl">
                      <p className="text-lg">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <img src={ai} alt="AI" />
                    <div className="ml-4 max-w-6xl">
                      <p className="text-lg">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-6xl mx-auto">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <img src={ai} alt="AI" />
                  </div>
                  <div className="ml-4 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="fixed bottom-6 left-0 right-0 px-6">
        <form onSubmit={handleQuestionSubmit} className="max-w-6xl mx-auto">
          <div className="relative shadow-lg rounded-md">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Send a message..."
              className={`w-full rounded-md px-6 py-4 pr-16 focus:outline-none ${!activeDoc ? 'cursor-not-allowed bg-gray-100' : ''}`}
              disabled={!activeDoc}
            />
            <button
              type="submit"
              disabled={loading || !question.trim() || !activeDoc}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionAnswering
