"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import jsPDF from "jspdf"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

export function ChatInterface() {
  const questions = [
    "What is the name of the screen?",
    "What is the purpose of this screen?",
    "What inputs or fields are needed from the user?",
    "Which fields are required?",
    "How should the screen layout look?",
    "What actions can the user perform?",
    "What should happen after the main action?",
    "Are there any rules or validations?",
    "Are there any special cases?",
    "Do you need search or filters?",
    "How should the UI look and feel?"
  ]

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi, I am Krishna. Let’s create your screen.",
      role: "assistant"
    },
    {
      id: "2",
      content: questions[0],
      role: "assistant"
    }
  ])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ✅ JSON Generator
  const generateJSON = () => ({
    screenName: answers[0],
    purpose: answers[1],
    inputs: answers[2],
    requiredFields: answers[3],
    layout: answers[4],
    actions: answers[5],
    postAction: answers[6],
    validations: answers[7],
    specialCases: answers[8],
    searchFilter: answers[9],
    uiStyle: answers[10],
  })

  // ✅ PDF Generator
  const downloadPDF = () => {
    const doc = new jsPDF()

    let y = 10
    doc.setFontSize(14)
    doc.text("Krishna AI - Screen Specification", 10, y)

    y += 10
    doc.setFontSize(10)

    questions.forEach((q, index) => {
      doc.text(`${q}`, 10, y)
      y += 6
      doc.text(`→ ${answers[index] || ""}`, 10, y)
      y += 10
    })

    doc.save("krishna-screen.pdf")
  }

  // ✅ Restart / Regenerate
  const restartFlow = () => {
    setStep(0)
    setAnswers([])
    setShowPreview(false)
    setIsEditing(false)
    setMessages([
      {
        id: "1",
        content: "Hi, I am Krishna. Let’s create your screen.",
        role: "assistant"
      },
      {
        id: "2",
        content: questions[0],
        role: "assistant"
      }
    ])
  }

  // ✅ Submit Logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
    }

    const newAnswers = [...answers, input.trim()]
    const nextStep = step + 1

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      let aiContent = ""

      if (nextStep < questions.length) {
        aiContent = questions[nextStep]
      } else {
        aiContent = "All details collected ✅ Showing preview..."
        setShowPreview(true)
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiContent,
        role: "assistant",
      }

      setMessages((prev) => [...prev, aiMessage])
      setAnswers(newAnswers)
      setStep(nextStep)
      setIsTyping(false)
    }, 600)
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-center border-b px-4 py-4">
        <h1 className="text-lg font-semibold">Krishna AI</h1>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {isTyping && <TypingIndicator />}

          {/* ✅ Preview Section */}
          {showPreview && (
            <div className="mt-6 rounded-xl border p-4 bg-white">
              <h2 className="font-semibold mb-3">Preview</h2>

              {questions.map((q, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-medium">{q}</p>

                  {isEditing ? (
                    <input
                      value={answers[i]}
                      onChange={(e) => {
                        const updated = [...answers]
                        updated[i] = e.target.value
                        setAnswers(updated)
                      }}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{answers[i]}</p>
                  )}
                </div>
              ))}

              {/* JSON */}
              <div className="mt-4">
                <p className="text-xs mb-1">AI JSON:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(generateJSON(), null, 2)}
                </pre>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={downloadPDF}
                  className="px-3 py-2 bg-blue-500 text-white rounded"
                >
                  Download PDF
                </button>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-2 bg-gray-500 text-white rounded"
                >
                  {isEditing ? "Save" : "Edit"}
                </button>

                <button
                  onClick={restartFlow}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      {!showPreview && (
        <footer className="border-t px-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-2xl gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-4 py-2"
              placeholder="Type your answer..."
            />
            <button className="bg-blue-500 text-white px-4 rounded">
              <Send size={16} />
            </button>
          </form>
        </footer>
      )}
    </div>
  )
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="text-sm text-gray-400">Krishna is typing...</div>
  )
}
