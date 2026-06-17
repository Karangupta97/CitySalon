import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@config/env";

const ADVISOR_SYSTEM_PROMPT = `You are CitySalon's AI beauty advisor for Mumbai, India. You give expert, friendly beauty advice. You know about hair treatments, skin care, bridal makeup, nail art, grooming, spa services. Always respond in 2-4 sentences max. If relevant, end by asking if the user wants salon recommendations. Never make up salon names. Never discuss anything unrelated to beauty, salons, or skincare. If asked off-topic, say: I can only help with beauty and salon queries. Respond in the same language the user writes in.`;

const DISCOVER_SYSTEM_PROMPT = `You are CitySalon's salon discovery engine for Mumbai. Extract from the user query: service type, area/location in Mumbai, budget in INR, date if mentioned, special requirements. Return ONLY valid JSON in this exact format: {"service": string, "area": string, "budget": number or null, "date": string or null, "requirements": string[], "confidence": number 0-1, "searchSummary": string}. If you cannot extract a service or area, set confidence below 0.5. Never return anything except valid JSON.`;

function getGenAI(): GoogleGenerativeAI {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function getAdvisorResponse(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 400,
    },
    systemInstruction: ADVISOR_SYSTEM_PROMPT,
  });

  const chatHistory = history.slice(-3).map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();
}

export interface DiscoveryIntent {
  service: string;
  area: string;
  budget: number | null;
  date: string | null;
  requirements: string[];
  confidence: number;
  searchSummary: string;
}

export async function getDiscoveryIntent(query: string): Promise<DiscoveryIntent> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 200,
    },
    systemInstruction: DISCOVER_SYSTEM_PROMPT,
  });

  const result = await model.generateContent(query);
  const responseText = result.response.text().trim();

  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = responseText;
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  // Validate shape
  return {
    service: typeof parsed.service === "string" ? parsed.service : "",
    area: typeof parsed.area === "string" ? parsed.area : "",
    budget: typeof parsed.budget === "number" ? parsed.budget : null,
    date: typeof parsed.date === "string" ? parsed.date : null,
    requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    searchSummary: typeof parsed.searchSummary === "string" ? parsed.searchSummary : "",
  };
}
