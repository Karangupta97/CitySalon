import { Router } from "express";
import rateLimit from "express-rate-limit";
import { advisorChat, discoverSalons } from "@controllers/advisor.controller";
import { logger } from "@utils/logger";

const router = Router();

// Track requests for suspicious activity logging
const requestTimestamps: Map<string, number[]> = new Map();

function suspiciousActivityLogger(ip: string): void {
  const now = Date.now();
  const timestamps = requestTimestamps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < 10000);
  recent.push(now);
  requestTimestamps.set(ip, recent);

  if (recent.length > 5) {
    logger.warn(`Suspicious activity: ${ip} made ${recent.length} requests in 10 seconds`);
  }
}

// Rate limit: 10 requests per minute per IP for advisor
const advisorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many requests", retryAfter: 60 });
  },
});

// Stricter rate limit for discover: 5 per minute per IP
const discoverLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many requests", retryAfter: 60 });
  },
});

// Global rate limit: 100 per hour per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many requests", retryAfter: 3600 });
  },
});

router.use(globalLimiter);

router.post("/advisor", advisorLimiter, (req, _res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  suspiciousActivityLogger(ip);
  next();
}, advisorChat);

router.post("/discover", discoverLimiter, (req, _res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  suspiciousActivityLogger(ip);
  next();
}, discoverSalons);

export default router;
