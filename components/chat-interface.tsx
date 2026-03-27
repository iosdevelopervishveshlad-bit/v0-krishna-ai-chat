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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ✅ JSON
  const generateJSON = (data: string[]) => ({
    screenName: data[0],
    purpose: data[1],
    inputs: data[2],
    requiredFields: data[3],
    layout: data[4],
    actions: data[5],
    postAction: data[6],
    validations: data[7],
    specialCases: data[8],
    searchFilter: data[9],
    uiStyle: data[10],
  })

  // ✅ AI Prompt
  const generateAIPrompt = () => {
    const data = generateJSON(answers)

    return `
Create a SwiftUI screen using MVVM architecture.

Screen Name: ${data.screenName}

Purpose:
${data.purpose}

Requirements:
- Inputs: ${data.inputs}
- Required Fields: ${data.requiredFields}
- Layout: ${data.layout}
- Actions: ${data.actions}

Validations:
${data.validations}

Special Cases:
${data.specialCases}

Search/Filter:
${data.searchFilter}

UI Style:
${data.uiStyle}

Rules:
- Use clean architecture (MVVM)
- Keep UI minimal (Apple style)
- Add validation
`
  }

  // ✅ PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    let y = 10

    doc.text("Krishna AI - Screen Specification", 10, y)
    y += 10

    questions.forEach((q, i) => {
      doc.text(q, 10, y)
      y += 6
      doc.text(`→ ${answers[i] || ""}`, 10, y)
      y += 10
    })

    doc.save("krishna-screen.pdf")
  }

  // ✅ Restart
  const restartFlow = () => {
    setStep(0)
    setAnswers([])
    setShowPreview(false)
    setIsEditing(false)
    setMessages([
      { id: "1", content: "Hi, I am Krishna. Let’s create your screen.", role: "assistant" },
      { id: "2", content: questions[0], role: "assistant" }
    ])
  }

  // ✅ FIXED SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newAnswers = [...answers, input.trim()]
    const nextStep = step + 1

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: input, role: "user" }
    ])

    setAnswers(newAnswers)
    setStep(nextStep)
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      let reply = ""

      if (nextStep < questions.length) {
        reply = questions[nextStep]
      } else {
        reply = "All details collected ✅ Showing preview..."
        setShowPreview(true)
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), content: reply, role: "assistant" }
      ])

      setIsTyping(false)
    }, 400)
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="text-center py-4 border-b font-semibold">
        Krishna AI
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={m.role === "user" ? "bg-blue-500 text-white px-3 py-2 rounded" : "bg-gray-200 px-3 py-2 rounded"}>
              {m.content}
            </span>
          </div>
        ))}

        {isTyping && <p className="text-sm text-gray-400">Krishna typing...</p>}

        {/* ✅ PREVIEW */}
        {showPreview && (
          <div className="border p-4 rounded bg-white mt-4">
            <h2 className="font-semibold mb-3">Preview</h2>

            {questions.map((q, i) => (
              <div key={i}>
                <p className="text-sm font-medium">{q}</p>
                {isEditing ? (
                  <input
                    value={answers[i]}
                    onChange={(e) => {
                      const updated = [...answers]
                      updated[i] = e.target.value
                      setAnswers(updated)
                    }}
                    className="border w-full p-1 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{answers[i]}</p>
                )}
              </div>
            ))}

            {/* JSON */}
            <div className="mt-4">
              <div className="flex justify-between">
                <p className="text-xs font-semibold">Raw JSON</p>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(generateJSON(answers), null, 2))}
                  className="text-xs bg-blue-500 text-white px-2 rounded"
                >
                  Copy
                </button>
              </div>

              <pre className="bg-gray-100 p-2 text-xs overflow-x-auto">
                {JSON.stringify(generateJSON(answers), null, 2)}
              </pre>
            </div>

            {/* AI Prompt */}
            <div className="mt-4">
              <div className="flex justify-between">
                <p className="text-xs font-semibold">AI Prompt</p>
                <button
                  onClick={() => navigator.clipboard.writeText(generateAIPrompt())}
                  className="text-xs bg-green-600 text-white px-2 rounded"
                >
                  Copy
                </button>
              </div>

              <pre className="bg-black text-green-400 p-2 text-xs whitespace-pre-wrap">
                {generateAIPrompt()}
              </pre>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button onClick={downloadPDF} className="bg-blue-500 text-white px-3 py-2 rounded">
                Download PDF
              </button>
              <button onClick={() => setIsEditing(!isEditing)} className="bg-gray-500 text-white px-3 py-2 rounded">
                Edit
              </button>
              <button onClick={restartFlow} className="bg-red-500 text-white px-3 py-2 rounded">
                Restart
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {!showPreview && (
        <form onSubmit={handleSubmit} className="flex p-4 gap-2 border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border px-3 py-2"
            placeholder="Type answer..."
          />
          <button className="bg-blue-500 text-white px-4">
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  )
}
