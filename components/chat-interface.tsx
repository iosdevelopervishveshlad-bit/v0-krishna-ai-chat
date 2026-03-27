"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Copy, Check, Edit, RefreshCw, FileDown } from "lucide-react"
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

  const [copied, setCopied] = useState<"json" | "prompt" | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hi, I am Krishna 👋 Let’s create your screen.", role: "assistant" },
    { id: "2", content: questions[0], role: "assistant" }
  ])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

  const generateAIPrompt = () => {
    const data = generateJSON(answers)
    return `Create a SwiftUI screen using MVVM architecture.

Screen Name: ${data.screenName}

Inputs: ${data.inputs}
Required: ${data.requiredFields}
Layout: ${data.layout}
Actions: ${data.actions}

Validations: ${data.validations}
Special: ${data.specialCases}
UI Style: ${data.uiStyle}`
  }

  const copyToClipboard = (type: "json" | "prompt", text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 1500)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    let y = 10
    doc.text("Krishna AI - Screen Spec", 10, y)
    y += 10

    questions.forEach((q, i) => {
      doc.text(q, 10, y)
      y += 6
      doc.text(`→ ${answers[i] || ""}`, 10, y)
      y += 10
    })

    doc.save("krishna-screen.pdf")
  }

  const restartFlow = () => {
    setStep(0)
    setAnswers([])
    setShowPreview(false)
    setIsEditing(false)
    setMessages([
      { id: "1", content: "Hi, I am Krishna 👋 Let’s create your screen.", role: "assistant" },
      { id: "2", content: questions[0], role: "assistant" }
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newAnswers = [...answers, input.trim()]
    const nextStep = step + 1

    setMessages(prev => [...prev, { id: Date.now().toString(), content: input, role: "user" }])
    setAnswers(newAnswers)
    setStep(nextStep)
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      let reply = nextStep < questions.length
        ? questions[nextStep]
        : "All done ✅ Showing preview..."

      setMessages(prev => [...prev, { id: Date.now().toString(), content: reply, role: "assistant" }])
      setIsTyping(false)

      if (nextStep >= questions.length) setShowPreview(true)
    }, 400)
  }

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      
      {/* Header */}
      <header className="p-4 text-center font-semibold border-b bg-white">
        Krishna AI 💙
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
        {messages.map(m => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block px-3 py-2 rounded-xl text-sm ${
              m.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-white border"
            }`}>
              {m.content}
            </span>
          </div>
        ))}

        {isTyping && <p className="text-xs text-gray-400">Typing...</p>}

        {/* Preview */}
        {showPreview && (
          <div className="bg-white p-4 rounded-xl border mt-4">
            <h2 className="font-semibold mb-3">Preview</h2>

            {questions.map((q, i) => (
              <div key={i} className="mb-2">
                <p className="text-xs text-gray-500">{q}</p>

                {isEditing ? (
                  <input
                    value={answers[i]}
                    onChange={(e) => {
                      const updated = [...answers]
                      updated[i] = e.target.value
                      setAnswers(updated)
                    }}
                    className="w-full border p-2 rounded text-sm"
                  />
                ) : (
                  <p className="text-sm">{answers[i]}</p>
                )}
              </div>
            ))}

            {/* JSON */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>JSON</span>
                <button
                  onClick={() => copyToClipboard("json", JSON.stringify(generateJSON(answers), null, 2))}
                  className="flex items-center gap-1"
                >
                  {copied === "json" ? <Check size={14}/> : <Copy size={14}/>}
                </button>
              </div>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(generateJSON(answers), null, 2)}
              </pre>
            </div>

            {/* Prompt */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>AI Prompt</span>
                <button
                  onClick={() => copyToClipboard("prompt", generateAIPrompt())}
                >
                  {copied === "prompt" ? <Check size={14}/> : <Copy size={14}/>}
                </button>
              </div>
              <pre className="bg-black text-green-400 p-2 rounded text-xs whitespace-pre-wrap">
                {generateAIPrompt()}
              </pre>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={downloadPDF} className="btn"><FileDown size={16}/> PDF</button>
              <button onClick={() => setIsEditing(true)} className="btn"><Edit size={16}/> Edit</button>
              <button onClick={() => setIsEditing(false)} className="btn bg-green-600">Save</button>
              <button onClick={restartFlow} className="btn bg-red-500"><RefreshCw size={16}/> Reset</button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input (Fixed Bottom) */}
      {!showPreview && (
        <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 border rounded-full px-4 py-2 text-sm"
          />
          <button className="bg-blue-500 text-white px-4 rounded-full">
            <Send size={16}/>
          </button>
        </form>
      )}
    </div>
  )
}
