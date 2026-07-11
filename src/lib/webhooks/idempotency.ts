import { Redis } from "@upstash/redis";

/**
 * Idempotency guard — prevents duplicate email sends when Spree retries a
 * webhook delivery (timeout, lost response, etc.).
 *
 * Backed by Upstash Redis (works with either a directly-created Upstash
 * database or Vercel's KV storage, since Vercel KV is Upstash under the
 * hood and exposes the same REST API — hence checking both env var name
 * conventions below). Falls back to an in-process Set when no credentials
 * are configured (local dev, or before the owner provisions Redis) so the
 * app keeps working, but duplicate suppression resets on every deploy/cold
 * start in that mode — see docs/technical-debt.md (F6).
 */
const KEY_PREFIX = "webhook-processed:";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days — comfortably covers webhook redelivery windows

const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

if (!redis && process.env.NODE_ENV === "production") {
  console.warn(
    "[webhooks] UPSTASH_REDIS_REST_URL/TOKEN (or KV_REST_API_URL/TOKEN) not set — " +
      "webhook idempotency is in-memory only and resets on every cold start/deploy.",
  );
}

const memoryFallback = new Set<string>();
const MAX_MEMORY_EVENTS = 10_000;

export async function isAlreadyProcessed(eventId: string): Promise<boolean> {
  if (redis) return (await redis.exists(KEY_PREFIX + eventId)) === 1;
  return memoryFallback.has(eventId);
}

export async function markProcessed(eventId: string): Promise<void> {
  if (redis) {
    await redis.set(KEY_PREFIX + eventId, "1", { ex: TTL_SECONDS });
    return;
  }
  if (memoryFallback.size >= MAX_MEMORY_EVENTS) {
    const first = memoryFallback.values().next().value;
    if (first) memoryFallback.delete(first);
  }
  memoryFallback.add(eventId);
}
