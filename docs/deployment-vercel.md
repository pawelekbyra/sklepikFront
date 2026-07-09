# Deployment storefrontu (Vercel)

Storefront jest wdrażany na Vercel: projekt **`sklepik_front`**, produkcja `sklepikkk.vercel.app`, deploy automatyczny z gałęzi `main` tego repo. Backend, z którym rozmawia, żyje na **Oracle VPS** (`https://141-253-103-172.nip.io`; zmigrowany z Render 2026-07-09) — mapa całego systemu: `sklepik/docs/architektura.md`.

## Zmienne środowiskowe

Prawdziwe wartości ustawiamy wyłącznie w Vercel (Project Settings → Environment Variables) albo lokalnie w `.env.local` (nie commitować). W repo jest `.env.local.example`.

### Wymagane

| Zmienna | Rola |
|---|---|
| `SPREE_API_URL` | Adres backendu (produkcyjnie: `https://141-253-103-172.nip.io` Oracle VPS, zaufany cert Let's Encrypt; lokalnie `http://localhost:3000`) |
| `SPREE_PUBLISHABLE_KEY` | Publiczny klucz Store API (generowany w backendzie; to nie jest klucz Stripe) |
| `NEXT_PUBLIC_SITE_URL` | Publiczny adres storefrontu (SEO, sitemap, canonical) |

### Ustawienia sklepu (mają polskie defaulty w kodzie — `src/lib/store.ts`)

| Zmienna | Default | Rola |
|---|---|---|
| `NEXT_PUBLIC_STORE_NAME` | `Kakałowy Sklepik` | Nazwa sklepu |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `pl` | Domyślny język (bez prefiksu w URL; inne locale dostają `/{locale}`) |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | `pl` | Kraj do rozwiązania rynku/waluty (server-side; nie jest już segmentem URL) |
| `NEXT_PUBLIC_STORE_DESCRIPTION` | — | Opis SEO |

### Opcjonalne

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — płatności Stripe (jeszcze nieskonfigurowane; roadmapa Faza 2).
- `SPREE_WEBHOOK_SECRET` — weryfikacja podpisu `/api/webhooks/spree`; obsługuje e-maile transakcyjne (order.*, customer.password_reset_requested) **i** rewalidację cache po zmianie produktu (product.created/updated/deleted). Musi być identyczny z `secret_key` webhook endpointu ustawionego w adminie (Ustawienia → Webhooks) wskazującego na `{storefront}/api/webhooks/spree`.
- `RESEND_API_KEY`, `EMAIL_FROM` — dostawca e-maili transakcyjnych.
- `SENTRY_DSN` + `SENTRY_ORG` + `SENTRY_PROJECT` + `SENTRY_AUTH_TOKEN` — monitoring (wszystkie albo żadna); `*_SEND_DEFAULT_PII=true` tylko za zgodą użytkowników.

## Test lokalny przed deployem

```bash
npm install
npm run build && npm start   # http://localhost:3001
npx vitest run
```

## Checklist produkcyjny

- [ ] `SPREE_API_URL` wskazuje publiczny backend, `SPREE_PUBLISHABLE_KEY` zgadza się ze sklepem
- [ ] `NEXT_PUBLIC_SITE_URL` = prawdziwa domena
- [ ] Sentry skonfigurowane w całości albo wcale
- [ ] Katalog, strona produktu, koszyk i checkout działają
- [ ] Obrazy produktów ładują się (z R2 przez `CDN_HOST` backendu; host backendu musi być też wpisany w `images.remotePatterns` w `next.config.ts`, inaczej `next/image` odrzuca URL)
- [ ] W adminie (Ustawienia → Webhooks) istnieje endpoint na `{storefront}/api/webhooks/spree` z `product.created`/`product.updated`/`product.deleted`/`product.activated`/`product.archived`/`product.out_of_stock`/`product.back_in_stock` w subskrypcjach — bez tego zmiany produktów w adminie są widoczne w sklepie dopiero po TTL cache (do 10 min)

## Znane ograniczenia

- **Cache:** produkty/rynki są cache'owane (`"use cache"` + edge Vercela, TTL do 10 min). Zmiana produktu w adminie wywołuje webhook `product.*` → `/api/webhooks/spree` rewaliduje cache w sekundach (F4, zamknięte) — **pod warunkiem** że webhook endpoint jest skonfigurowany w adminie (patrz checklist wyżej). Zmiany rynków/cen poza produktem nadal czekają na TTL.
- **RESOLVED (2026-07-09):** Backend now serves a trusted Let's Encrypt certificate for `141-253-103-172.nip.io` (free wildcard DNS pointing at the Oracle VPS IP — no domain purchase needed). Node.js fetches work over `https://` again; HTTP→HTTPS redirect is re-enabled. See `docs/vercel-build-fix-2026-07-09.md` for history.
