import { type Client, createClient } from "@spree/sdk";
import type { SpreeNextConfig } from "./types";

let _client: Client | null = null;
let _config: SpreeNextConfig | null = null;

function getEnvConfig(): SpreeNextConfig | null {
  const baseUrl = process.env.SPREE_API_URL;
  const publishableKey = process.env.SPREE_PUBLISHABLE_KEY;

  if (!baseUrl || !publishableKey) return null;

  return {
    baseUrl,
    publishableKey,
    defaultCountry: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY,
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  };
}

/**
 * Returns true when the Spree SDK can be initialized. Use this to avoid
 * touching cached Spree fetches during static builds without API env vars.
 */
export function isSpreeConfigured(): boolean {
  return Boolean(_client || _config || getEnvConfig());
}

/**
 * Initialize the Spree Next.js integration.
 * Call this once in your app (e.g., in `lib/storefront.ts`).
 * If not called, the client will auto-initialize from SPREE_API_URL and SPREE_PUBLISHABLE_KEY env vars.
 */
export function initSpreeNext(config: SpreeNextConfig): void {
  _config = config;
  _client = createClient({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
  });
}

/**
 * Get the Client instance. Auto-initializes from env vars if needed.
 */
export function getClient(): Client {
  if (!_client) {
    const envConfig = getEnvConfig();

    if (envConfig) {
      initSpreeNext(envConfig);
    } else {
      throw new Error(
        "Spree client is not configured. Either call initSpreeNext() or set SPREE_API_URL and SPREE_PUBLISHABLE_KEY environment variables.",
      );
    }
  }
  return _client!;
}

/**
 * Get the current config. Auto-initializes from env vars if needed.
 */
export function getConfig(): SpreeNextConfig {
  if (!_config) {
    getClient(); // triggers auto-init
  }
  return _config!;
}

/**
 * Reset the client (useful for testing).
 */
export function resetClient(): void {
  _client = null;
  _config = null;
}
