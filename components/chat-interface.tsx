"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

export function ChatInterface() {
  // 🔥 STEP 1: Questions (Your Template)
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

  // 🔥 STEP 2: Initial Messages
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
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 🔥 STEP 3: Replace Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
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
        aiContent = "All details collected ✅ Generating preview..."

        console.log("Final Answers:", newAnswers)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        role: "assistant",
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      setAnswers(newAnswers)
      setStep(nextStep)
    }, 800)
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-center border-b border-border/50 bg-card/80 px-4 py-4 backdrop-blur-xl">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Krishna AI
        </h1>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/50 bg-card/80 px-4 py-4 backdrop-blur-xl">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Krishna..."
              className="w-full rounded-full border border-border bg-input px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  )
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-secondary text-secondary-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
        </div>
      </div>
    </div>
  )
}
