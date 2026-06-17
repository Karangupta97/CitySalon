import { Request, Response } from "express";
import { getAdvisorResponse, getDiscoveryIntent } from "@services/advisor.service";
import { logger } from "@utils/logger";

// Input validation and sanitization
function sanitizeInput(input: unknown): { valid: boolean; message: string; sanitized: string } {
  if (!input || typeof input !== "string") {
    return { valid: false, message: "Invalid input", sanitized: "" };
  }

  let text = input.trim();

  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Check length
  if (text.length < 3) {
    return { valid: false, message: "Invalid input", sanitized: "" };
  }
  if (text.length > 500) {
    return { valid: false, message: "Invalid input", sanitized: "" };
  }

  // Check for injection patterns
  const injectionPatterns = [
    /ignore\s+previous/i,
    /disregard/i,
    /system\s*:/i,
    /\[INST\]/i,
    /forget\s+everything/i,
    /<script/i,
    /SELECT\s+.*FROM/i,
    /DROP\s+TABLE/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /UNION\s+SELECT/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      return { valid: false, message: "Invalid input", sanitized: "" };
    }
  }

  return { valid: true, message: "", sanitized: text };
}

export async function advisorChat(req: Request, res: Response): Promise<void> {
  try {
    const { valid, message, sanitized } = sanitizeInput(req.body.message);
    if (!valid) {
      res.status(400).json({ error: message });
      return;
    }

    // Validate history if provided
    const history = Array.isArray(req.body.history)
      ? req.body.history.slice(-3).map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" as const : "model" as const,
          content: typeof msg.content === "string" ? msg.content.slice(0, 500) : "",
        }))
      : [];

    const reply = await getAdvisorResponse(sanitized, history);
    res.json({ reply });
  } catch (err) {
    logger.error("Advisor chat error", { error: err });
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

export async function discoverSalons(req: Request, res: Response): Promise<void> {
  try {
    const { valid, message, sanitized } = sanitizeInput(req.body.query);
    if (!valid) {
      res.status(400).json({ error: message });
      return;
    }

    const intent = await getDiscoveryIntent(sanitized);
    res.json({ intent });
  } catch (err) {
    logger.error("Discovery error", { error: err });

    // If JSON parse failed from Gemini
    if (err instanceof SyntaxError) {
      res.json({ error: "Could not parse query", confidence: 0 });
      return;
    }

    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
