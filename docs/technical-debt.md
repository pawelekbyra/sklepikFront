# Skróty tymczasowe i dług techniczny

## Cel dokumentu

Ten dokument zapisuje świadome skróty, decyzje tymczasowe i rzeczy, które trzeba wrócić poprawić — żeby nikt nie traktował rozwiązania tymczasowego jako finalnej architektury.

Dług dotyczący całego systemu (backend, deploy, dane) żyje w `sklepik/docs/roadmap.md` i `sklepik/docs/stan-projektu.md` — tutaj tylko skróty frontowe.

## Statusy

- `otwarte` — trzeba wrócić i naprawić albo doprecyzować.
- `w toku` — temat jest aktualnie rozwiązywany.
- `zamknięte` — skrót został spłacony albo decyzja stała się finalna.

## Dług techniczny

### 2026-07-06 — Idempotencja webhooków e-mail w pamięci procesu

**Status:** otwarte

**Skrót:** ochrona przed duplikatami zdarzeń to `Set` w pamięci (`src/lib/webhooks/handlers.ts`); restart instancji Vercela ją zeruje — klient może dostać duplikat e-maila.

**Co trzeba zrobić:** trwały magazyn (Redis / Postgres z unique constraint + TTL) — zadanie **F6** w `sklepik/docs/roadmap.md`.

**Warunek zamknięcia:** restart procesu nie resetuje ochrony przed duplikatami.

## Zamknięte

### 2026-07-07 — Cache storefrontu bez inwalidacji on-demand

**Status:** zamknięte (2026-07-07) — zadanie **F4** z `sklepik/docs/roadmap.md`

`/api/webhooks/spree` obsługuje teraz `product.created`/`product.updated`/`product.deleted`/`product.activated`/`product.archived`/`product.out_of_stock`/`product.back_in_stock` (`handleProductChanged` w `src/lib/webhooks/handlers.ts`, jeden handler — wszystkie niosą ten sam zserializowany produkt) — przy każdej takiej zmianie w adminie backend wysyła webhook, handler busuje tagi `products`, `product-filters`, `product:{slug}` oraz `revalidatePath("/", "layout")`. Backend nie wymagał żadnych zmian — `Spree::Product` już publikował te eventy.

**Warunek operacyjny (nie kod):** w panelu admina → Ustawienia → Webhooks musi istnieć endpoint wskazujący na `{storefront}/api/webhooks/spree` z powyższymi eventami (lub `product.*`) w subskrypcjach — skonfigurowane 2026-07-07 — a `SPREE_WEBHOOK_SECRET` na Vercelu musi być tym samym sekretem co `secret_key` tego endpointu.

**Jak dodać kolejny event w przyszłości** (np. inwalidacja przy zmianie rynku/ceny — patrz `sklepik/docs/roadmap.md` F4, otwarta reszta): (1) napisz handler w `src/lib/webhooks/handlers.ts` i dopisz go do mapy w `src/app/api/webhooks/spree/route.ts`; (2) dopiero potem dopisz nazwę eventu do subskrypcji tego samego endpointu w adminie. Świadomie nie subskrybujemy `*` — event bez handlera to niepotrzebny ruch webhookowy (delivery + HTTP POST) donikąd.

### 2026-07-05 — Deploy frontu na Vercel przed finalnym backendem

**Status:** zamknięte (2026-07-06)

Backend działa publicznie na Render, front ma ustawione prawdziwe `SPREE_API_URL` + `SPREE_PUBLISHABLE_KEY`, katalog renderuje realne produkty. Pełna weryfikacja checkoutu z płatnościami to Faza 2 roadmapy (Stripe jeszcze nieskonfigurowany).

### 2026-07-05 — Branding przed pełnym finalnym deploymentem commerce

**Status:** zamknięte (2026-07-06)

Rebranding "Kakałowy Sklepik" wdrożony (nazwa, layout, locale-only URLs, usunięte linki demo Spree); w backendzie zseedowano 6 realnych produktów kakao. Dalszy branding premium to normalna praca Fazy 2, nie dług.

### 2026-07-05 — Vercel Commerce wymaga adaptera Spree

**Status:** zamknięte (2026-07-06) — **kierunek odrzucony**

Brak ROI: `@spree/sdk` + obecny storefront realizują ten sam zakres, a adaptacja `vercel/commerce` (utrzymywanego pod Shopify) wymagałaby napisania i utrzymywania całego adaptera provider→Spree. Żaden dokument w repo nie traktuje już migracji na Vercel Commerce jako aktywnego planu.
