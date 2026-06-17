"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  Send,
  ArrowLeft,
  User,
  MapPin,
  Star,
  ArrowRight,
  Leaf,
  Scissors,
  Heart,
  Droplets,
  RotateCcw,
  MessageSquare,
  Plus,
  Trash2,
  Menu,
  X,
  LogIn,
  Search,
  Shield,
  Mic,
  MicOff,
} from "lucide-react"
import { useAuth } from "@/components/boty/auth-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  salonSuggestions?: SalonSuggestion[]
  timestamp: number
}

interface SalonSuggestion {
  id: string
  name: string
  area: string
  rating: number
  reviews: number
  service: string
  price: string
  image: string
  hygieneScore: number
  liveStatus: string
  distance: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

const quickPrompts = [
  { icon: Scissors, label: "Hair damaged from bleaching", prompt: "My hair is damaged from bleaching, what treatment should I get first?" },
  { icon: Droplets, label: "Best facial for dry skin", prompt: "I have dry, flaky skin. What type of facial would help me the most?" },
  { icon: Heart, label: "Bridal prep timeline", prompt: "I'm getting married in 3 months. What treatments should I start now?" },
  { icon: Search, label: "Find a salon near me", prompt: "Find me a good salon nearby for a haircut and spa" },
  { icon: Leaf, label: "Chemical-free hair care", prompt: "I want to switch to chemical-free hair products. What should I look for?" },
  { icon: Star, label: "Best rated salons", prompt: "Show me the top-rated salons with best hygiene scores" },
]

function generateTitle(firstMessage: string): string {
  const words = firstMessage.split(" ").slice(0, 6).join(" ")
  return words.length > 40 ? words.substring(0, 40) + "..." : words
}

async function callAdvisorAPI(
  messages: { role: string; content: string }[],
  userName?: string
): Promise<{ text: string; salonSuggestions?: SalonSuggestion[] }> {
  const res = await fetch("/api/advisor/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, userName }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }))
    throw new Error(err.error || "Failed to get response")
  }

  return res.json()
}

function useChatHistory(userId: string | null) {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    if (!userId) {
      setSessions([])
      return
    }
    const stored = localStorage.getItem(`citysalon_chats_${userId}`)
    if (stored) {
      try { setSessions(JSON.parse(stored)) } catch { setSessions([]) }
    }
  }, [userId])

  const save = useCallback((updated: ChatSession[]) => {
    if (!userId) return
    setSessions(updated)
    localStorage.setItem(`citysalon_chats_${userId}`, JSON.stringify(updated))
  }, [userId])

  const createSession = useCallback((firstMessage: string, messages: Message[]): ChatSession => {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      title: generateTitle(firstMessage),
      messages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const updated = [session, ...sessions]
    save(updated)
    return session
  }, [sessions, save])

  const updateSession = useCallback((sessionId: string, messages: Message[]) => {
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, messages, updatedAt: Date.now() } : s
    )
    save(updated)
  }, [sessions, save])

  const deleteSession = useCallback((sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId)
    save(updated)
  }, [sessions, save])

  return { sessions, createSession, updateSession, deleteSession }
}

export default function AIBeautyAdvisorPage() {
  const { user } = useAuth()
  const { sessions, createSession, updateSession, deleteSession } = useChatHistory(user?.id ?? null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => { scrollToBottom() }, [messages, isTyping])

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.interimResults = true
    recognition.continuous = false

    let finalTranscript = ""

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      finalTranscript = ""
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      setInput(finalTranscript || interim)
    }

    recognition.onerror = () => setIsListening(false)

    recognition.onend = () => {
      setIsListening(false)
      // Auto-send the final transcript
      if (finalTranscript.trim()) {
        handleSend(finalTranscript.trim())
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      // Build message history for context
      const chatHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await callAdvisorAPI(chatHistory, user?.name?.split(" ")[0])

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        salonSuggestions: response.salonSuggestions,
        timestamp: Date.now(),
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)

      if (user) {
        if (activeSessionId) {
          updateSession(activeSessionId, finalMessages)
        } else {
          const session = createSession(messageText, finalMessages)
          setActiveSessionId(session.id)
        }
      }
    } catch (error) {
      // Show error as assistant message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check that the Gemini API key is configured in your `.env.local` file and try again.\n\nIf the issue persists, please try again in a moment.",
        timestamp: Date.now(),
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  const handleNewChat = () => {
    setMessages([])
    setActiveSessionId(null)
    setInput("")
    setIsTyping(false)
    setSidebarOpen(false)
  }

  const handleLoadSession = (session: ChatSession) => {
    setMessages(session.messages)
    setActiveSessionId(session.id)
    setSidebarOpen(false)
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
    if (activeSessionId === sessionId) {
      setMessages([])
      setActiveSessionId(null)
    }
  }

  return (
    <div className="h-[100dvh] flex bg-background overflow-hidden">
      {/* Sidebar — Chat History (logged-in users only) */}
      {user && (
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <aside className={`fixed lg:relative z-50 lg:z-auto top-0 left-0 h-full w-[280px] bg-card/95 backdrop-blur-xl border-r border-border/20 flex flex-col boty-transition ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-border/15">
              <span className="text-sm font-medium text-foreground">Chat History</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleNewChat} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition" aria-label="New chat">
                  <Plus className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setSidebarOpen(false)} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition lg:hidden" aria-label="Close sidebar">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
              {sessions.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 text-center py-8 px-4">Your conversations will appear here</p>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer boty-transition ${
                        activeSessionId === session.id ? "bg-primary/8 text-foreground" : "hover:bg-muted/50 text-foreground/70"
                      }`}
                      onClick={() => handleLoadSession(session)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                      <span className="text-xs truncate flex-1">{session.title}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id) }}
                        className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground/0 group-hover:text-muted-foreground hover:text-destructive boty-transition"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border/15">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">{user.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/10 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {user && (
              <button type="button" onClick={() => setSidebarOpen(true)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition lg:hidden" aria-label="Open history">
                <Menu className="w-4 h-4" />
              </button>
            )}
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 boty-transition" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center ring-1 ring-primary/10">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-foreground block leading-tight">Beauty Advisor</span>
              <span className="text-[10px] text-emerald-600 font-medium">Online</span>
            </div>
            <span className="text-sm font-medium text-foreground sm:hidden">Advisor</span>
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary boty-transition">
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
            <button type="button" onClick={handleNewChat} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition" aria-label="New chat">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
            {/* Empty State */}
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-accent/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
                  <Sparkles className="w-7 h-7 text-primary" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-3 ring-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-2">
                  {user ? `Hi ${user.name.split(" ")[0]}, how can I help?` : "Your Beauty Advisor"}
                </h1>
                <p className="text-sm text-muted-foreground/70 text-center max-w-md mb-3">
                  {user
                    ? "Ask me about beauty advice, skincare, or find the perfect salon."
                    : "Get personalized beauty advice and find your perfect salon match."
                  }
                </p>
                {!user && (
                  <p className="text-[11px] text-muted-foreground/40 text-center mb-8">
                    Sign in to save your chat history
                  </p>
                )}
                {user && <div className="mb-8" />}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-2xl">
                  {quickPrompts.map((item) => {
                    const Icon = item.icon
                    return (
                      <button key={item.label} type="button" onClick={() => handleSend(item.prompt)} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/20 bg-card/30 text-left hover:bg-card/70 hover:border-primary/20 hover:shadow-sm boty-transition group">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/12 boty-transition">
                          <Icon className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary boty-transition" />
                        </div>
                        <span className="text-xs text-foreground/60 leading-snug group-hover:text-foreground boty-transition">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-5">
              {messages.map((message, msgIndex) => (
                <div
                  key={message.id}
                  className={`animate-blur-in opacity-0 ${message.role === "user" ? "flex justify-end" : ""}`}
                  style={{ animationDelay: `${msgIndex * 0.05}s`, animationFillMode: "forwards" }}
                >
                  {/* User Message — Right-aligned bubble */}
                  {message.role === "user" && (
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      <div className="flex items-end gap-2.5 justify-end">
                        <div className="flex flex-col items-end">
                          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground/50 mt-1.5 mr-1">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mb-5">
                          {user ? (
                            <span className="text-[9px] font-bold text-foreground/70">{user.name.split(" ").map(n => n[0]).join("")}</span>
                          ) : (
                            <User className="w-3.5 h-3.5 text-foreground/60" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Message — Left-aligned, full-width card */}
                  {message.role === "assistant" && (
                    <div className="max-w-full">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ring-1 ring-primary/10">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-primary/80">Beauty Advisor</span>
                            <span className="text-[10px] text-muted-foreground/40">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <div className="bg-card/60 border border-border/20 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                            <div className="text-sm text-foreground/90 leading-[1.7] whitespace-pre-line">
                              {message.content.split("**").map((part, i) =>
                                i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : <span key={i}>{part}</span>
                              )}
                            </div>

                            {/* Salon Suggestions — Premium Cards */}
                            {message.salonSuggestions && message.salonSuggestions.length > 0 && (
                              <div className="mt-5 pt-4 border-t border-border/15 space-y-3">
                                <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Recommended Salons</p>
                                {message.salonSuggestions.map((salon) => {
                                  const statusColors: Record<string, string> = {
                                    available: "bg-emerald-500",
                                    "short-wait": "bg-amber-400",
                                    busy: "bg-orange-400",
                                    "fully-booked": "bg-red-400",
                                  }
                                  const statusLabels: Record<string, string> = {
                                    available: "Walk-in",
                                    "short-wait": "Short wait",
                                    busy: "Busy",
                                    "fully-booked": "Booked",
                                  }
                                  return (
                                    <Link
                                      key={salon.id + salon.service}
                                      href={`/salon/${salon.id}`}
                                      className="flex items-center gap-3.5 p-3 rounded-xl bg-background/60 border border-border/20 hover:border-primary/25 hover:shadow-md boty-transition group"
                                    >
                                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border/10">
                                        <Image
                                          src={salon.image}
                                          alt={salon.name}
                                          fill
                                          className="object-cover group-hover:scale-105 boty-transition"
                                        />
                                        {/* Live status dot */}
                                        <div className="absolute top-1 right-1">
                                          <span className={`block w-2.5 h-2.5 rounded-full ${statusColors[salon.liveStatus] || "bg-gray-400"} ring-2 ring-background shadow-sm`} />
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary boty-transition">{salon.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className="flex items-center gap-0.5">
                                            <Star className="w-3 h-3 fill-accent text-accent" />
                                            <span className="text-[11px] font-semibold text-foreground">{salon.rating}</span>
                                          </div>
                                          <span className="text-[10px] text-muted-foreground">({salon.reviews.toLocaleString()} reviews)</span>
                                          <span className="text-border">·</span>
                                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Shield className="w-2.5 h-2.5 text-primary/60" />
                                            {salon.hygieneScore}%
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                          <span className="inline-flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {salon.area}
                                          </span>
                                          <span className="text-border">·</span>
                                          <span className="font-medium text-primary">{salon.price}</span>
                                          <span className="text-border">·</span>
                                          <span className="inline-flex items-center gap-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[salon.liveStatus] || "bg-gray-400"}`} />
                                            {statusLabels[salon.liveStatus] || salon.liveStatus}
                                          </span>
                                        </div>
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary flex-shrink-0 group-hover:translate-x-0.5 boty-transition" />
                                    </Link>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 animate-blur-in">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-primary/10">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-card/60 border border-border/20 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDuration: "0.6s" }} />
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDuration: "0.6s", animationDelay: "0.15s" }} />
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDuration: "0.6s", animationDelay: "0.3s" }} />
                      </div>
                      <span className="text-[11px] text-muted-foreground/50 ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="flex-shrink-0 border-t border-border/10 bg-gradient-to-t from-background via-background to-background/80 safe-bottom">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 p-2.5 bg-card/80 border border-border/25 rounded-2xl shadow-lg shadow-black/[0.03] focus-within:border-primary/40 focus-within:shadow-primary/5 focus-within:shadow-xl boty-transition backdrop-blur-sm">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about beauty, treatments, or find a salon..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40 px-3 py-2.5 min-w-0"
                  disabled={isTyping}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isTyping}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 boty-transition ${
                    isListening
                      ? "bg-destructive/10 text-destructive ring-2 ring-destructive/30 animate-pulse"
                      : "bg-transparent text-muted-foreground/50 hover:text-foreground hover:bg-muted/50"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 boty-transition ${
                    input.trim() && !isTyping
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 scale-100 hover:scale-105"
                      : "bg-muted/50 text-muted-foreground/30 scale-95"
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className="text-[10px] text-muted-foreground/35 text-center mt-2.5">
              {user ? "Chats saved automatically" : "Sign in to save history"} · AI provides general guidance only
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
