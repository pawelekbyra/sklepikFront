# Skróty tymczasowe i dług techniczny

## Cel dokumentu

Ten dokument zapisuje świadome skróty, decyzje tymczasowe i rzeczy, które trzeba wrócić poprawić — żeby nikt nie traktował rozwiązania tymczasowego jako finalnej architektury.

Dług dotyczący całego systemu (backend, deploy, dane) żyje w `sklepik/docs/roadmap.md` i `sklepik/docs/stan-projektu.md` — tutaj tylko skróty frontowe.

## Statusy

- `otwarte` — trzeba wrócić i naprawić albo doprecyzować.
- `w toku` — temat jest aktualnie rozwiązywany.
- `zamknięte` — skrót został spłacony albo decyzja stała się finalna.

## Dług techniczny

### 2026-07-07 — CountrySwitcher zastąpiony LanguageSwitcher — Market switcher jeszcze nie istnieje

**Status:** w toku (krok 0+1 planu zamknięte, kroki 2-4 czekają na realny drugi rynek)

**Skrót:** `CountrySwitcher.tsx` mieszał język i walutę w jednym dropdownie i linkował wg usuniętego schematu URL `/{country}/{locale}/...` → 404 na wyborze kraju + wizualny duplikat "PL PL | PLN". Usunięty (razem z `useCountrySwitch.ts`) i zastąpiony `LanguageSwitcher.tsx` — czysto językowym przełącznikiem (pl/en dziś, de/es/fr gotowe strukturalnie w `messages/*.json`, ale niewystawione dopóki ktoś nie zweryfikuje ich jakości), niezależnym od waluty/rynku. Ten sam fix zastosowany w `MobileMenu.tsx` (panel "country" → "language").

**Co trzeba zrobić:** zbudować `MarketSwitcher` (waluta + wysyłka, oparty o cookie, nie URL) — dopiero gdy w adminie powstanie realny drugi `Market` (np. Eurozone/EUR). `updateCartMarket` (`src/lib/data/checkout.ts`) zostawiony nieużywany celowo — gotowa, przetestowana funkcja do reużycia w tym kroku.

**Warunek zamknięcia:** pełny plan w `sklepik/docs/plans/market-language-switcher.md` zrealizowany (kroki 2-4).

### 2026-07-07 — Zdjęcie główne na stronie produktu czasem się nie wyświetla (mitygacja, nie fix)

**Status:** otwarte (frontowa mitygacja wdrożona, przyczyna po stronie backendu/infra pozostaje)

**Skrót:** `MediaGallery` (`src/components/products/MediaGallery.tsx`) pokazywała jako główne zdjęcie wariant `xlarge` (2000×2000) — Spree generuje warianty Active Storage **na żądanie**, nie z góry. Na Renderze (starter/free, ograniczone CPU — patrz `sklepik/docs/stan-projektu.md` pkt 5) pierwsze wygenerowanie wariantu 2000×2000 zajęło zmierzone **12.5 s**; ten sam wariant po scache'owaniu — 1.3 s. Next.js/Vercel Image Optimization ma limit czasu na pobranie źródła — 12+ sekund go przekracza, więc pierwszy odwiedzający konkretny produkt (zanim wariant się scache'uje) widział brak zdjęcia zamiast oczekiwania.

**Zastosowana mitygacja:** `getMainImageUrl` preferuje teraz `large_url` (720×720 — i tak udokumentowany w Spree jako rozmiar pod galerię produktową) przed `xlarge_url`. Mniej pikseli = radykalnie krótszy czas generowania przy zimnym cache, mniejsze ryzyko przekroczenia timeoutu. `xlarge` zostaje tylko w `MediaLightbox` (powiększenie na kliknięcie — świadoma akcja użytkownika, może poczekać).

**Co zostaje nierozwiązane:** to mitygacja ryzyka, nie usunięcie przyczyny — każdy nowy rozmiar wariantu nadal generuje się leniwie przy pierwszym żądaniu, więc pierwszy odwiedzający wciąż może trafić na wolne (choć krótsze) oczekiwanie. Trwałe rozwiązanie: generowanie wariantów w tle zaraz po uploadzie zdjęcia (wymaga workera Sidekiq — **F7** w `sklepik/docs/roadmap.md`, obecnie wyłączony na darmowym/starter planie Render).

**Warunek zamknięcia:** worker w tle pre-generuje warianty przy uploadzie (F7 domknięte), więc żaden odwiedzający nigdy nie trafia na zimne generowanie.

### 2026-07-06 — Idempotencja webhooków e-mail w pamięci procesu

**Status:** otwarte

**Skrót:** ochrona przed duplikatami zdarzeń to `Set` w pamięci (`src/lib/webhooks/handlers.ts`); restart instancji Vercela ją zeruje — klient może dostać duplikat e-maila.

**Co trzeba zrobić:** trwały magazyn (Redis / Postgres z unique constraint + TTL) — zadanie **F6** w `sklepik/docs/roadmap.md`.

**Warunek zamknięcia:** restart procesu nie resetuje ochrony przed duplikatami.

## Zamknięte

### 2026-07-07 — Strony blokowały się na `resolveCurrency` przed Suspense

**Status:** zamknięte (2026-07-07)

**Problem:** strona główna, listing produktów i strona kategorii robiły `await resolveCurrency(...)` bezpośrednio w komponencie strony (`page.tsx`), poza jakąkolwiek granicą `<Suspense>`. `resolveCurrency` woła Store API (`/api/v3/store/markets`) na backendzie Render. Skutek: cała strona — łącznie ze statyczną powłoką (Hero, nagłówki, breadcrumbs) — czekała na ten jeden request, zanim przeglądarka dostała cokolwiek. Przy wolniejszych odpowiedziach Render (obserwowane 1.7–5.7 s na `/api/v3/store/markets`, patrz `sklepik/docs/stan-projektu.md` pkt 5 — OOM/wydajność Render) dawało to kilkusekundowy biały ekran przy każdym cache miss (co godzinę, `cacheLife("hours")`).

**Fix:** `resolveCurrency(...)` nie jest już await'owane w `page.tsx` — promise leci nierozwiązany do komponentów już opakowanych w `<Suspense>` (`FeaturedProducts`, `ProductListing`), gdzie jest await'owane równolegle z pobieraniem produktów/filtrów. Powłoka strony streamuje się natychmiast; skeleton pokazuje się tylko dla części zależnej od API.

**Zasada na przyszłość:** żaden `await` do Store API nie powinien siedzieć bezpośrednio w `page.tsx` bez `<Suspense>` nad nim — zawsze przekazuj promise w dół do komponentu, który jest już pod granicą Suspense, i await'uj go tam (wzorzec `use()`/await z React 19, patrz `CLAUDE.md`).

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
