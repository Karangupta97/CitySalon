"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  name: string
  area: string
  rating: number
  service: string
  price: string
  slug: string
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
  { icon: Leaf, label: "Chemical-free hair care", prompt: "I want to switch to chemical-free hair products. What should I look for?" },
]

function generateTitle(firstMessage: string): string {
  const words = firstMessage.split(" ").slice(0, 6).join(" ")
  return words.length > 40 ? words.substring(0, 40) + "..." : words
}

function getAIResponse(query: string, userName?: string): { text: string; salons?: SalonSuggestion[] } {
  const q = query.toLowerCase()

  // Greeting detection
  if (q.match(/^(hi|hello|hey|good morning|good evening|good afternoon|namaste|hii+)/)) {
    const greeting = userName
      ? `Hey ${userName}! 👋 Great to see you back. I'm your personal beauty advisor — here to help with hair care, skincare routines, treatment recommendations, or finding the perfect salon.\n\nWhat can I help you with today?`
      : `Hey there! 👋 I'm your AI Beauty Advisor — think of me as your personal beauty consultant available 24/7.\n\nI can help you with:\n• **Hair care** — damage repair, color advice, treatments\n• **Skincare** — routines, facials, product recommendations\n• **Bridal prep** — timelines, packages, artist booking\n• **Salon finder** — matching you with the right salon for your needs & budget\n\nWhat's on your mind today?`
    return { text: greeting }
  }

  // Hair damage / bleach
  if (q.includes("bleach") || q.includes("damage") || q.includes("protein") || q.includes("dry hair") || q.includes("frizz")) {
    return {
      text: "For bleach-damaged or frizzy hair, I'd recommend starting with a **protein treatment** before any further color work. Here's your recovery plan:\n\n1. **Olaplex or Keratin treatment** — rebuilds broken disulfide bonds in the hair shaft\n2. **Deep conditioning mask** — apply weekly for 4–6 weeks (look for ones with argan oil or shea butter)\n3. **Avoid heat styling** for at least 2 weeks post-treatment\n4. Switch to a **sulfate-free shampoo** to retain moisture\n5. Use a **leave-in conditioner** with argan oil or coconut milk daily\n6. Sleep on a **silk pillowcase** — reduces friction breakage\n\n**Timeline:** You should see significant improvement in 3–4 weeks with consistent care.\n\nHere are salons near you offering these treatments:",
      salons: [
        { name: "Akshita Shoanak Studio", area: "Ulwe, Navi Mumbai", rating: 4.9, service: "Keratin Treatment", price: "₹5,999", slug: "akshita-shoanak" },
        { name: "Glamour Studio", area: "Bandra West", rating: 4.8, service: "Olaplex Treatment", price: "₹3,499", slug: "akshita-shoanak" },
        { name: "Hair Revival Salon", area: "Vashi", rating: 4.7, service: "Protein Treatment", price: "₹1,299", slug: "akshita-shoanak" },
      ],
    }
  }

  // Dry skin / facial
  if (q.includes("dry") || q.includes("flaky") || q.includes("facial") || q.includes("glow") || q.includes("hydrat")) {
    return {
      text: "For dry, dehydrated skin, here are the best facial options ranked by effectiveness:\n\n**Top Picks:**\n1. **Hydra Facial** — vortex suction deeply cleanses + infuses serums. Best for immediate glow and long-term hydration.\n2. **Oxygen Facial** — pushes concentrated oxygen + hyaluronic acid into skin layers.\n3. **Gold Facial** — boosts blood circulation and gives a dewy, radiant finish.\n\n**At-home routine between visits:**\n- Morning: Hyaluronic acid serum → moisturizer → SPF 50\n- Night: Gentle cleanser → niacinamide → rich night cream\n- Weekly: Sheet mask with ceramides\n\n**Pro tips:**\n• Apply moisturizer on slightly damp skin — locks in 3× more hydration\n• Avoid hot water on face — use lukewarm\n• Drink 2.5L+ water daily — hydration starts from within\n\nHere are salons with availability:",
      salons: [
        { name: "Akshita Shoanak Studio", area: "Ulwe, Navi Mumbai", rating: 4.9, service: "Hydra Facial", price: "₹3,499", slug: "akshita-shoanak" },
        { name: "Skin & Glow Clinic", area: "Airoli", rating: 4.8, service: "Oxygen Facial", price: "₹2,999", slug: "akshita-shoanak" },
      ],
    }
  }

  // Bridal
  if (q.includes("bridal") || q.includes("wedding") || q.includes("married") || q.includes("bride")) {
    return {
      text: "Congratulations! Here's your complete **3-month bridal prep timeline**:\n\n**Month 1 — Foundation:**\n- Start consistent skincare (cleanse → tone → moisturize → SPF daily)\n- Monthly facials — Hydra or Gold facial for glow\n- Hair spa every 2 weeks for texture improvement\n- Begin body polishing treatments\n- Start drinking 3L water/day + add biotin supplements\n\n**Month 2 — Enhancement:**\n- Trial makeup session (book 2–3 different artists to compare)\n- Hair color or highlights if desired (gives time for adjustments)\n- Teeth whitening if planned\n- Start threading/shaping to establish your preferred brow shape\n- Body waxing schedule — do a test run now\n\n**Month 3 — Final Prep:**\n- Final facial: 5 days before (not closer — skin needs recovery)\n- Threading & shaping: 2 days before\n- Hair wash + deep condition: 1 day before\n- Mani-pedi: 1 day before\n- Bridal makeup + hairstyling: Day of ✨\n\n**Pro tip:** Book your bridal artist 2–3 months in advance — the best ones fill up fast!\n\nTop-rated bridal salons near you:",
      salons: [
        { name: "Akshita Shoanak Studio", area: "Ulwe, Navi Mumbai", rating: 4.9, service: "Bridal Makeup", price: "₹15,999", slug: "akshita-shoanak" },
        { name: "The Bridal Room", area: "Khar West", rating: 4.8, service: "Complete Bridal Package", price: "₹22,999", slug: "akshita-shoanak" },
      ],
    }
  }

  // Natural / organic
  if (q.includes("natural") || q.includes("chemical-free") || q.includes("organic") || q.includes("ayurved")) {
    return {
      text: "Great choice going chemical-free! Here's your complete guide:\n\n**Ingredients to AVOID:**\n- SLS / SLES (harsh detergents that strip natural oils)\n- Parabens (preservatives linked to scalp irritation)\n- Silicones (dimethicone — creates buildup, fake smoothness)\n- Synthetic fragrances (can cause sensitivity)\n\n**Natural ingredients to LOOK FOR:**\n- **Amla & Shikakai** — natural cleansing + shine\n- **Bhringraj oil** — promotes hair growth, reduces greying\n- **Aloe vera** — soothes scalp inflammation\n- **Coconut milk** — deep conditioning\n- **Reetha (soapnut)** — gentle natural lather\n- **Hibiscus** — prevents premature greying\n\n**Indian brands worth trying:** Juicy Chemistry, Plum, Forest Essentials, Kama Ayurveda, Rustic Art\n\n**Salon treatments (chemical-free):**\n- Herbal hair spa (zero chemicals)\n- Ayurvedic scalp therapy (medicated oils)\n- Natural henna for color (avoid black henna — contains PPD)\n\n**Transition tip:** Your hair may feel waxy or different for 2–3 weeks as silicone buildup detoxes. This is completely normal — stick with it!",
    }
  }

  // Hair fall
  if (q.includes("hair fall") || q.includes("hair loss") || q.includes("thinning") || q.includes("bald")) {
    return {
      text: "Hair fall can have multiple causes. Here's a structured approach:\n\n**First, identify the cause:**\n- **Nutritional** — low iron, vitamin D, biotin deficiency\n- **Stress** — telogen effluvium (temporary, recovers in 3–6 months)\n- **Hormonal** — thyroid issues, PCOS, postpartum\n- **Mechanical** — tight hairstyles, heat damage, chemical overprocessing\n\n**Immediate steps:**\n1. Get blood work done (iron, ferritin, vitamin D, thyroid panel)\n2. Start a biotin + zinc supplement (consult your doctor)\n3. Use a mild, sulfate-free shampoo — don't wash daily\n4. Apply minoxidil 2% if recommended by dermatologist\n5. Scalp massage with warm coconut/castor oil 2× per week\n\n**Salon treatments that help:**\n- PRP therapy (platelet-rich plasma) — stimulates follicles\n- Mesotherapy — vitamin injection into scalp\n- LED light therapy — improves blood flow\n- Hair spa with keratin — strengthens existing strands\n\n**Don't:** Use home remedies like onion juice without patch testing first — it can irritate sensitive scalps.\n\nWant me to find salons offering hair fall treatments near you?",
      salons: [
        { name: "Akshita Shoanak Studio", area: "Ulwe, Navi Mumbai", rating: 4.9, service: "Hair Spa & Conditioning", price: "₹1,499", slug: "akshita-shoanak" },
      ],
    }
  }

  // Acne
  if (q.includes("acne") || q.includes("pimple") || q.includes("breakout") || q.includes("oily skin")) {
    return {
      text: "For acne-prone or oily skin, here's what I recommend:\n\n**Daily routine:**\n- Morning: Salicylic acid cleanser → niacinamide serum → oil-free moisturizer → SPF 50 (gel-based)\n- Night: Double cleanse (oil → foam) → retinol (start 2×/week) → lightweight moisturizer\n\n**Key ingredients:**\n- **Salicylic acid (BHA)** — unclogs pores\n- **Niacinamide** — controls oil, reduces redness\n- **Retinol** — prevents future breakouts, fades marks\n- **Tea tree oil** — spot treatment (diluted)\n- **Zinc** — reduces inflammation\n\n**Salon treatments:**\n- Chemical peel (glycolic/lactic acid) — monthly\n- LED blue light therapy — kills acne bacteria\n- Extraction facial — professional comedone removal\n- Carbon laser facial — deep pore cleansing\n\n**Avoid:** Heavy creams, pore-clogging makeup, touching your face, dairy (for some people)\n\n**Timeline:** Consistent routine shows results in 6–8 weeks. Acne scars take 3–6 months to fade.",
      salons: [
        { name: "Akshita Shoanak Studio", area: "Ulwe, Navi Mumbai", rating: 4.9, service: "Hydra Facial", price: "₹3,499", slug: "akshita-shoanak" },
      ],
    }
  }

  // Thank you / appreciation
  if (q.match(/thank|thanks|helpful|great advice|perfect/)) {
    return {
      text: "You're welcome! 😊 I'm glad I could help. Feel free to come back anytime you have beauty or salon-related questions.\n\n**Quick reminders:**\n- Consistency is key — most treatments need 4–6 weeks to show results\n- Always patch-test new products\n- Stay hydrated and get enough sleep — it shows on your skin!\n\nIs there anything else I can help you with?",
    }
  }

  // Default
  return {
    text: "That's a great question! Here's what I'd suggest:\n\n1. **Consult a professional** — a trained stylist can assess your specific hair/skin type in person for the most accurate advice\n2. **Start simple** — introduce one new product or treatment at a time so you can track what works\n3. **Be patient** — most beauty treatments show real results after 4–6 weeks of consistency\n4. **Protect daily** — SPF 50 for skin, heat protectant spray for hair\n\n**General wellness tips that show on your skin & hair:**\n- Hydration — aim for 2.5L water daily\n- Sleep — 7+ hours is ideal for cell regeneration\n- Diet — biotin (eggs, nuts), zinc (seeds), omega-3s (fish, flaxseed)\n- Stress management — cortisol directly impacts skin & hair health\n\nWould you like me to recommend specific salons or treatments? Just tell me:\n- Your **location**\n- Your **main concern**\n- Your **budget range**\n\nAnd I'll find the best matches! 🎯",
  }
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => { scrollToBottom() }, [messages, isTyping])

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

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800))

    const response = getAIResponse(messageText, user?.name?.split(" ")[0])
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.text,
      salonSuggestions: response.salons,
      timestamp: Date.now(),
    }

    const finalMessages = [...updatedMessages, assistantMessage]
    setMessages(finalMessages)
    setIsTyping(false)

    // Save to history if logged in
    if (user) {
      if (activeSessionId) {
        updateSession(activeSessionId, finalMessages)
      } else {
        const session = createSession(messageText, finalMessages)
        setActiveSessionId(session.id)
      }
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
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <aside className={`fixed lg:relative z-50 lg:z-auto top-0 left-0 h-full w-[280px] bg-card/95 backdrop-blur-xl border-r border-border/20 flex flex-col boty-transition ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}>
            {/* Sidebar Header */}
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

            {/* Session List */}
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

            {/* Sidebar Footer — User Info */}
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
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/20">
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

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Beauty Advisor</span>
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary boty-transition">
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign in to save</span>
              </Link>
            )}
            <button type="button" onClick={handleNewChat} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground boty-transition" aria-label="New chat">
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
            {/* Empty State */}
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-2">
                  {user ? `Hi ${user.name.split(" ")[0]}, how can I help?` : "How can I help you today?"}
                </h1>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-10">
                  {user
                    ? "Your chats are saved automatically. Ask me anything about beauty & wellness."
                    : "Ask me about hair, skin, treatments, or finding the right salon. Sign in to save your chat history."
                  }
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {quickPrompts.map((item) => {
                    const Icon = item.icon
                    return (
                      <button key={item.label} type="button" onClick={() => handleSend(item.prompt)} className="flex items-start gap-3 p-4 rounded-xl border border-border/30 bg-card/40 text-left hover:bg-card/80 hover:border-primary/20 boty-transition group">
                        <Icon className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0 group-hover:text-primary boty-transition" />
                        <span className="text-sm text-foreground/70 leading-snug group-hover:text-foreground boty-transition">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`${message.role === "assistant" ? "bg-card/40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-5 rounded-xl" : ""}`}>
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" ? "bg-foreground/10" : "bg-primary/10"
                      }`}>
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-foreground/70" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-xs font-medium text-foreground/60 mb-1.5">
                          {message.role === "user" ? (user?.name?.split(" ")[0] || "You") : "Beauty Advisor"}
                        </p>
                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {message.content.split("**").map((part, i) =>
                            i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : <span key={i}>{part}</span>
                          )}
                        </div>

                        {/* Salon Suggestions */}
                        {message.salonSuggestions && message.salonSuggestions.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {message.salonSuggestions.map((salon) => (
                              <Link
                                key={salon.name + salon.service}
                                href={`/salon/${salon.slug}`}
                                className="flex items-center justify-between p-3.5 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-background boty-transition group"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-foreground">{salon.name}</span>
                                    <div className="flex items-center gap-0.5">
                                      <Star className="w-3 h-3 fill-accent text-accent" />
                                      <span className="text-[11px] text-muted-foreground">{salon.rating}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{salon.area}</span>
                                    <span>{salon.service}</span>
                                    <span className="font-medium text-primary">{salon.price}</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary flex-shrink-0 ml-3 group-hover:translate-x-0.5 boty-transition" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="bg-card/40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-5 rounded-xl">
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="flex-shrink-0 border-t border-border/20 bg-background safe-bottom">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 p-2 bg-card/60 border border-border/30 rounded-2xl focus-within:border-primary/30 focus-within:bg-card/80 boty-transition">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about hair, skin, treatments, salons..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 px-3 py-2 min-w-0"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 boty-transition ${
                    input.trim() && !isTyping
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent text-muted-foreground/40"
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
              {user ? "Your chats are saved automatically." : "Sign in to save your chat history."} Beauty Advisor provides general guidance only.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
