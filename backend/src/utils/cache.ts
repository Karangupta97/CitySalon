import { logger } from "./logger";

class MemoryCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    logger.info(`[Cache Hit] Key: ${key}`);
    return entry.value;
  }

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    logger.info(`[Cache Set] Key: ${key}, TTL: ${ttlSeconds}s`);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

export const cache = new MemoryCache();
