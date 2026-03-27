"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand. Let me help you with that. What kind of screen would you like to create?",
        role: "assistant",
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
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
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
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
            aria-label="Send message"
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
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
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

function EmptyState() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <div className="h-8 w-8 rounded-full bg-primary" />
      </div>
      <p className="text-lg font-medium text-foreground">
        Hi, I am Krishna.
      </p>
      <p className="mt-1 text-muted-foreground">
        {"Let's create your screen."}
      </p>
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
