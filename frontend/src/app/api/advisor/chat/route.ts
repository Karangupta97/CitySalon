import { GoogleGenerativeAI, Part } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { salonsList } from "@/data/salons-list"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const SYSTEM_PROMPT = `You are "Beauty Advisor" — an AI beauty consultant for CitySalon, a platform that helps users find salons and get beauty/wellness advice in Mumbai & Navi Mumbai, India.

YOUR ROLE:
- Provide expert beauty, hair care, skincare, and wellness advice
- Help users find the right salon based on their needs
- Recommend treatments, routines, and products
- Answer questions about salon services, pricing, and availability
- Analyze user-uploaded images (hair, skin, face) to give personalized advice

IMAGE ANALYSIS:
When a user uploads an image, analyze it carefully for:
- Hair: texture, condition, damage level, color, style, face shape compatibility
- Skin: tone, texture, visible concerns (acne, dryness, pigmentation, aging)
- Face: shape (oval, round, square, heart, oblong), features, proportions
Then provide specific, actionable recommendations based on what you see.

PERSONALITY:
- Warm, knowledgeable, and professional
- Use simple language, avoid jargon unless explaining it
- Be concise but thorough — use bullet points and bold text for readability
- Use emojis sparingly (1-2 per response max)
- Always be encouraging and supportive

FORMATTING RULES:
- Use **bold** for key terms and headings
- Use bullet points (•) for lists
- Use numbered lists for step-by-step instructions
- Keep paragraphs short (2-3 sentences max)
- Use line breaks between sections

SALON RECOMMENDATIONS:
When the user asks about finding salons, getting treatments, or needs service recommendations, analyze their query and respond with a JSON block at the END of your message in this exact format:

---SALONS---
[array of salon IDs that match their needs]
---END---

Available salon IDs and their details:
${salonsList.map(s => `- "${s.id}": ${s.name} (${s.location}) — Services: ${s.services.join(", ")} | Rating: ${s.rating} | Price: ${s.priceRange} | Open: ${s.openNow} | Hygiene: ${s.hygieneScore}%`).join("\n")}

RULES FOR SALON SUGGESTIONS:
- Only include the ---SALONS--- block when recommending salons is relevant
- Match salons based on: service type, location preference, budget, rating, availability
- Recommend 2-4 salons maximum
- Don't include salon details in your text — the app will render cards automatically
- If the user asks something unrelated to beauty/salons, just answer normally without salon suggestions

TOPICS YOU CAN HELP WITH:
- Hair: damage repair, coloring, treatments, haircuts, styling, hair fall
- Skin: facials, acne, anti-aging, routines, products, treatments
- Body: waxing, spa, massage, body treatments
- Nails: manicure, pedicure, nail art
- Bridal: prep timelines, packages, makeup artists
- General wellness: diet for skin/hair, supplements, lifestyle tips
- Salon finding: by location, service, budget, rating, availability

TOPICS TO DECLINE:
- Medical advice (redirect to dermatologist/doctor)
- Non-beauty topics (politely redirect)
- Specific brand endorsements (suggest categories instead)`

interface ChatMessage {
  role: string
  content: string
  image?: string // base64 data URL
}

export async function POST(request: NextRequest) {
  try {
    const { messages, userName } = (await request.json()) as {
      messages: ChatMessage[]
      userName?: string
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const lastMessage = messages[messages.length - 1]
    const hasImage = !!lastMessage.image

    console.log("[Advisor] User message:", lastMessage.content)
    if (hasImage) console.log("[Advisor] 📷 Image attached")

    let responseText: string

    if (hasImage) {
      // For image messages, use generateContent directly (chat API doesn't support inline images well)
      const historyContext = messages.slice(0, -1).map((msg) =>
        `${msg.role === "user" ? "User" : "Advisor"}: ${msg.content}`
      ).join("\n")

      const parts: Part[] = []

      // Add the image
      const matches = lastMessage.image!.match(/^data:(.+);base64,(.+)$/)
      if (matches) {
        const mimeType = matches[1]
        const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
        if (!supportedTypes.includes(mimeType)) {
          return NextResponse.json(
            { error: `Unsupported image format (${mimeType}). Please upload a JPEG, PNG, or WEBP image.` },
            { status: 400 }
          )
        }
        parts.push({
          inlineData: { mimeType, data: matches[2] },
        })
      }

      // Add context + user message
      const textPrompt = [
        SYSTEM_PROMPT,
        `\nUser's name: ${userName || "Guest"}`,
        historyContext ? `\nConversation so far:\n${historyContext}` : "",
        `\nUser's latest message (with the attached image): ${lastMessage.content || "Analyze this image and give me personalized beauty/styling advice based on what you see."}`,
      ].join("\n")

      parts.push({ text: textPrompt })

      const result = await model.generateContent(parts)
      responseText = result.response.text()
    } else {
      // For text-only messages, use the chat API for better context handling
      const history = [
        {
          role: "user" as const,
          parts: [{ text: `System context: ${SYSTEM_PROMPT}\n\nThe user's name is: ${userName || "Guest"}. Greet them appropriately if this is the start of the conversation.` }],
        },
        {
          role: "model" as const,
          parts: [{ text: "Understood. I'm ready to help as Beauty Advisor for CitySalon. I'll provide beauty advice, analyze uploaded images for personalized recommendations, recommend salons from the available list, and format my responses clearly with bold text and bullet points. I'll include the ---SALONS--- block only when salon recommendations are relevant." }],
        },
        ...messages.slice(0, -1).map((msg) => ({
          role: (msg.role === "user" ? "user" : "model") as "user" | "model",
          parts: [{ text: msg.content }],
        })),
      ]

      const chat = model.startChat({ history })
      const result = await chat.sendMessage(lastMessage.content || "Hello")
      responseText = result.response.text()
    }

    console.log("[Advisor] ✅ Gemini responded successfully")
    console.log("[Advisor] Response length:", responseText.length, "chars")
    console.log("[Advisor] Response preview:", responseText.substring(0, 200) + "...")

    // Parse salon suggestions from response
    let text = responseText
    let salonIds: string[] = []

    const salonMatch = responseText.match(/---SALONS---\s*\n?([\s\S]*?)\n?---END---/)
    if (salonMatch) {
      text = responseText.replace(/---SALONS---[\s\S]*?---END---/, "").trim()
      try {
        const parsed = JSON.parse(salonMatch[1].trim())
        if (Array.isArray(parsed)) {
          salonIds = parsed
        }
      } catch {
        const rawIds = salonMatch[1].trim()
        salonIds = rawIds
          .replace(/[\[\]"']/g, "")
          .split(/[,\n]/)
          .map((id: string) => id.trim())
          .filter(Boolean)
      }
    }

    // Map salon IDs to full salon data
    const salonSuggestions = salonIds
      .map((id) => salonsList.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => ({
        id: s!.id,
        name: s!.name,
        area: s!.location,
        rating: s!.rating,
        reviews: s!.reviews,
        service: s!.services.slice(0, 3).join(", "),
        price: s!.priceRange,
        image: s!.image,
        hygieneScore: s!.hygieneScore,
        liveStatus: s!.liveStatus,
        distance: s!.distance,
      }))

    console.log("[Advisor] Salon suggestions:", salonSuggestions.length, "salons matched")
    if (salonSuggestions.length > 0) {
      console.log("[Advisor] Salons:", salonSuggestions.map(s => s.name).join(", "))
    }

    return NextResponse.json({ text, salonSuggestions })
  } catch (error: unknown) {
    console.error("Advisor API error:", error)
    const message = error instanceof Error ? error.message : "Failed to get response"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
