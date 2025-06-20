"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Plus } from "lucide-react"

export default function page() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate a new session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Load messages and session ID from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages')
    const savedSessionId = localStorage.getItem('chat-session-id')
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } catch (error) {
        console.error('Error parsing saved messages:', error)
      }
    }
    
    if (savedSessionId) {
      setSessionId(savedSessionId)
    } else {
      // Generate new session ID if none exists
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      localStorage.setItem('chat-session-id', newSessionId)
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages))
    }
  }, [messages])

  // Function to start a new chat
  const startNewChat = () => {
    const newSessionId = generateSessionId()
    setMessages([])
    setInput("")
    setSessionId(newSessionId)
    localStorage.removeItem('chat-messages')
    localStorage.setItem('chat-session-id', newSessionId)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return
    setLoading(true)

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ userInput: input, sessionId: sessionId }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      const botMessage = { role: "assistant", content: data.message }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AI Zikrya</h1>
                <p className="text-sm text-slate-500">Your AI Zack</p>
              </div>
            </div>
            <button
              onClick={startNewChat}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Start a conversation</h3>
                <p className="text-slate-500">Talk to me!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] sm:max-w-[70%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className={`text-xs text-slate-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.role === "user" ? "Sofia" : "Zikrya"}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 sm:p-6">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-slate-400"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  style={{
                    minHeight: "48px",
                    maxHeight: "120px",
                    height: "auto",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "auto"
                    target.style.height = Math.min(target.scrollHeight, 120) + "px"
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
