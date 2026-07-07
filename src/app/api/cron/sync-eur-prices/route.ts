import { NextResponse } from "next/server";

/**
 * Daily Vercel Cron (see vercel.json) that keeps EUR prices in sync with
 * PLN base prices at the current NBP (Polish central bank) exchange rate.
 *
 * "Best effort" pricing, deliberately not live conversion at checkout:
 * rates are fetched once a day, rounded to a psychological .99 price, and
 * written as ordinary Spree::Price rows — a customer never sees the price
 * move mid-session, and any product can still be manually overridden in
 * the admin afterward (this job only touches rows it created/last wrote).
 *
 * No background worker is required on the backend (Sidekiq is disabled on
 * the current Render plan) — this route does the fetch/compute/write in
 * one request, authenticated as a scoped Admin API secret key rather than
 * a JWT admin login, since there's no human session to refresh.
 */

const NBP_RATE_URL =
  "https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json";

interface AdminPrice {
  id: string;
  variant_id: string;
  currency: string;
  amount: string;
}

interface AdminPricesResponse {
  data: AdminPrice[];
  meta: { pages: number; page: number };
}

function roundToPsychological99(amount: number): string {
  // Round to the nearest whole unit, then land on X.99 — matches the
  // manual PLN prices already set for the seeded cocoa catalog.
  const rounded = Math.max(1, Math.round(amount));
  return (rounded - 0.01).toFixed(2);
}

async function fetchEurPlnRate(): Promise<number> {
  const res = await fetch(NBP_RATE_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`NBP rate fetch failed: ${res.status}`);
  }
  const body = await res.json();
  const rate = body?.rates?.[0]?.mid;
  if (typeof rate !== "number" || rate <= 0) {
    throw new Error(
      `NBP rate response missing a usable mid rate: ${JSON.stringify(body)}`,
    );
  }
  return rate; // PLN per 1 EUR
}

async function fetchAllPlnPrices(
  backendUrl: string,
  apiKey: string,
): Promise<AdminPrice[]> {
  const prices: AdminPrice[] = [];
  let page = 1;
  let pages = 1;

  do {
    const url = new URL(`${backendUrl}/api/v3/admin/prices`);
    url.searchParams.set("q[currency_eq]", "PLN");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(
        `Admin prices fetch failed (page ${page}): ${res.status}`,
      );
    }
    const body: AdminPricesResponse = await res.json();
    prices.push(...body.data);
    pages = body.meta.pages;
    page += 1;
  } while (page <= pages);

  return prices;
}

async function upsertEurPrices(
  backendUrl: string,
  apiKey: string,
  rows: { variant_id: string; currency: string; amount: string }[],
): Promise<number> {
  if (rows.length === 0) return 0;

  const res = await fetch(`${backendUrl}/api/v3/admin/prices/bulk_upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prices: rows }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`bulk_upsert failed: ${res.status} ${text}`);
  }
  const body = await res.json();
  return body.price_count ?? rows.length;
}

export async function GET(request: Request): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = (process.env.SPREE_API_URL || "").replace(/\/$/, "");
  const apiKey = process.env.SPREE_ADMIN_SECRET_KEY;
  if (!backendUrl || !apiKey) {
    return NextResponse.json(
      { error: "SPREE_API_URL or SPREE_ADMIN_SECRET_KEY not configured" },
      { status: 503 },
    );
  }

  try {
    const rate = await fetchEurPlnRate();
    const plnPrices = await fetchAllPlnPrices(backendUrl, apiKey);

    const rows = plnPrices
      .map((p) => {
        const plnAmount = Number.parseFloat(p.amount);
        if (!Number.isFinite(plnAmount) || plnAmount <= 0) return null;
        const eurAmount = roundToPsychological99(plnAmount / rate);
        return { variant_id: p.variant_id, currency: "EUR", amount: eurAmount };
      })
      .filter(
        (
          row,
        ): row is { variant_id: string; currency: string; amount: string } =>
          row !== null,
      );

    const priceCount = await upsertEurPrices(backendUrl, apiKey, rows);

    return NextResponse.json({
      synced: true,
      rate,
      plnPriceCount: plnPrices.length,
      eurPriceCount: priceCount,
    });
  } catch (error) {
    console.error("[sync-eur-prices]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
