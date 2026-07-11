import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

const redisExists = vi.fn();
const redisSet = vi.fn();

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn().mockImplementation(function MockRedis(this: unknown) {
    Object.assign(this as object, { exists: redisExists, set: redisSet });
  }),
}));

afterEach(() => {
  process.env = { ...originalEnv };
  vi.clearAllMocks();
  vi.resetModules();
});

describe("idempotency — in-memory fallback (no Redis configured)", () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
  });

  it("reports unprocessed events as not processed, then processed after marking", async () => {
    const { isAlreadyProcessed, markProcessed } = await import(
      "../idempotency"
    );

    expect(await isAlreadyProcessed("evt_1")).toBe(false);
    await markProcessed("evt_1");
    expect(await isAlreadyProcessed("evt_1")).toBe(true);
  });

  it("keeps events independent by id", async () => {
    const { isAlreadyProcessed, markProcessed } = await import(
      "../idempotency"
    );

    await markProcessed("evt_a");
    expect(await isAlreadyProcessed("evt_a")).toBe(true);
    expect(await isAlreadyProcessed("evt_b")).toBe(false);
  });
});

describe("idempotency — Redis-backed (UPSTASH_REDIS_REST_URL/TOKEN set)", () => {
  beforeEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  });

  it("delegates isAlreadyProcessed to redis.exists with the prefixed key", async () => {
    redisExists.mockResolvedValueOnce(1);
    const { isAlreadyProcessed } = await import("../idempotency");

    expect(await isAlreadyProcessed("evt_1")).toBe(true);
    expect(redisExists).toHaveBeenCalledWith("webhook-processed:evt_1");
  });

  it("delegates markProcessed to redis.set with a TTL", async () => {
    const { markProcessed } = await import("../idempotency");

    await markProcessed("evt_1");
    expect(redisSet).toHaveBeenCalledWith("webhook-processed:evt_1", "1", {
      ex: 60 * 60 * 24 * 7,
    });
  });

  it("treats a missing key as not processed", async () => {
    redisExists.mockResolvedValueOnce(0);
    const { isAlreadyProcessed } = await import("../idempotency");

    expect(await isAlreadyProcessed("evt_never_seen")).toBe(false);
  });
});

describe("idempotency — Vercel KV env var naming", () => {
  beforeEach(() => {
    process.env.KV_REST_API_URL = "https://example.vercel-kv.io";
    process.env.KV_REST_API_TOKEN = "test-kv-token";
  });

  it("also works with KV_REST_API_URL/TOKEN", async () => {
    redisExists.mockResolvedValueOnce(1);
    const { isAlreadyProcessed } = await import("../idempotency");

    expect(await isAlreadyProcessed("evt_1")).toBe(true);
  });
});
