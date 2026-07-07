# Deployment storefrontu (Vercel)

Storefront jest wdrażany na Vercel: projekt **`sklepik_front`**, produkcja `sklepikkk.vercel.app`, deploy automatyczny z gałęzi `main` tego repo. Backend, z którym rozmawia, żyje na Render (`kakaowy-sklepik.onrender.com`) — mapa całego systemu: `sklepik/docs/architektura.md`.

## Zmienne środowiskowe

Prawdziwe wartości ustawiamy wyłącznie w Vercel (Project Settings → Environment Variables) albo lokalnie w `.env.local` (nie commitować). W repo jest `.env.local.example`.

### Wymagane

| Zmienna | Rola |
|---|---|
| `SPREE_API_URL` | Adres backendu (produkcyjnie: `https://kakaowy-sklepik.onrender.com`; lokalnie `http://localhost:3000`) |
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
- `SPREE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM` — e-maile transakcyjne przez webhooki (`src/app/api/webhooks/spree`).
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

## Znane ograniczenia

- **Cache:** produkty/rynki są cache'owane (`"use cache"` + edge Vercela) — zmiany z admina widać po ~10–15 min, dopóki nie powstanie webhook rewalidacyjny (roadmapa F4 w `sklepik/docs/roadmap.md`).
- Backend na darmowym Renderze ma cold start ~18 s po bezczynności — pierwsze żądanie po przerwie bywa wolne; to backend, nie front.
