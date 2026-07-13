# Skróty tymczasowe i dług techniczny

## Cel dokumentu

Ten dokument zapisuje świadome skróty, decyzje tymczasowe i rzeczy, które trzeba wrócić poprawić — żeby nikt nie traktował rozwiązania tymczasowego jako finalnej architektury.

Dług dotyczący całego systemu (backend, deploy, dane) żyje w `sklepik/docs/roadmap.md` i `sklepik/docs/stan-projektu.md` — tutaj tylko skróty frontowe.

## Statusy

- `otwarte` — trzeba wrócić i naprawić albo doprecyzować.
- `w toku` — temat jest aktualnie rozwiązywany.
- `zamknięte` — skrót został spłacony albo decyzja stała się finalna.

## Dług techniczny

### 2026-07-12 — Storefront to nadal "jeden deployment = jeden sklep" (multi-store Faza 1 w backendzie)

**Status:** w toku (świadoma decyzja na czas Fazy 1, nie awaria)

**Skrót:** `sklepik` wdraża wielosklepowość w panelu admina (`sklepik/docs/plans/multi-store-support.md`, F25 w `sklepik/docs/roadmap.md`) — właściciel będzie mógł zakładać kolejne sklepy i przełączać się między nimi z jednego panelu. Ten storefront (`sklepikFront`) **celowo nie zmienia się w tej fazie**: `src/lib/store.ts` nadal czyta konfigurację (nazwa, opis, domyślny kraj/locale) ze zmiennych środowiskowych ustalonych w buildzie, a `src/lib/spree/config.ts` trzyma jeden, moduł-level singleton klienta SDK zainicjalizowany raz z `SPREE_API_URL`/`SPREE_PUBLISHABLE_KEY`. Nowy sklep założony w panelu = nowy, osobny deployment Vercel tego samego repo z własnym zestawem zmiennych środowiskowych wskazujących na ten sam backend (dokładnie tak, jak dziś działa `sklepikkk.vercel.app`).

**Co trzeba zrobić (dopiero w Fazie 2, gdy właściciel zdecyduje):** rozpoznawanie sklepu dynamicznie po `Host` requestu zamiast ze stałych env-var — `src/proxy.ts` już ma dostęp do nagłówka `Host` (dziś nieużywanego), więc jest to naturalne miejsce na rozszerzenie; wymagałoby też przebudowy `src/lib/spree/config.ts` z pojedynczego singletona na klienta per-request/per-host oraz pobierania nazwy/opisu/brandingu ze Store API zamiast z env.

**Warunek zamknięcia:** decyzja właściciela o starcie Fazy 2 (dynamiczny routing po domenie) + implementacja opisana wyżej. Do tego czasu to nie jest dług do spłaty, tylko świadomy, udokumentowany zakres Fazy 1.

### 2026-07-07 — `@spree/sdk` nie ma jeszcze opublikowanej metody `store.get()`

**Status:** otwarte

**Skrót:** backend (`sklepik`) dostał nowy publiczny endpoint `GET /api/v3/store/store` i SDK w monorepie (`sklepik/packages/sdk/src/store-client.ts`) ma już `client.store.get()`, ale `@spree/sdk` zainstalowany w tym repo to opublikowana wersja npm (1.1.0), która tej metody jeszcze nie ma. `src/lib/data/store.ts` (`getStoreInfo()`) obchodzi to przez `client.request<StoreInfo>("GET", "/store")` — udokumentowany w SDK "escape hatch" na dokładnie taki przypadek — plus lokalny interfejs `StoreInfo` ręcznie skopiowany z kształtu `Spree::Api::V3::StoreSerializer`.

**Co trzeba zrobić:** po wydaniu nowej wersji `@spree/sdk` z `store.get()` — podmienić `getStoreInfo()` na `getClient().store.get()`, usunąć lokalny `StoreInfo` interface na rzecz `import type { Store } from "@spree/sdk"`, zaktualizować `@spree/sdk` w `package.json`.

**Warunek zamknięcia:** `@spree/sdk` w `package.json` ma wersję z `store.get()`, shim usunięty.

### 2026-07-07 — Logo sklepu: brak konsumenta w storefroncie (zamknięte)

**Status:** zamknięte (2026-07-07) — zadanie **F10** w `sklepik/docs/roadmap.md`

Nagłówek (`Header.tsx`) renderuje `logo_url` z nowego publicznego Store API zamiast samej tekstowej nazwy sklepu, gdy sklep ma wgrane logo (fallback na tekst gdy brak) — `max-h-10` (40px), `w-auto`, `object-contain`, bez wymuszonego cropu, spójne z tekstem pomocniczym w panelu admina (`admin.pages.settings.store.logo_dimensions_help`). JSON-LD Organization (`buildOrganizationJsonLd`, `src/lib/seo.ts`) teraz przyjmuje logo z API jako pierwszy wybór, z fallbackiem na statyczny `STORE_LOGO_URL` dla sklepów bez wgranego logo. Fetch (`getStoreInfo()`, `src/lib/data/store.ts`) idzie równolegle (`Promise.all`) z resztą danych layoutu — nie blokuje renderu, zgodnie z zasadą ustaloną przy dzisiejszym fixie `resolveCurrency`/Suspense.

### 2026-07-07 — CountrySwitcher zastąpiony LanguageSwitcher — Market switcher jeszcze nie istnieje

**Status:** w toku (krok 0+1 planu zamknięte, kroki 2-4 czekają na realny drugi rynek)

**Skrót:** `CountrySwitcher.tsx` mieszał język i walutę w jednym dropdownie i linkował wg usuniętego schematu URL `/{country}/{locale}/...` → 404 na wyborze kraju + wizualny duplikat "PL PL | PLN". Usunięty (razem z `useCountrySwitch.ts`) i zastąpiony `LanguageSwitcher.tsx` — czysto językowym przełącznikiem (pl/en dziś, de/es/fr gotowe strukturalnie w `messages/*.json`, ale niewystawione dopóki ktoś nie zweryfikuje ich jakości), niezależnym od waluty/rynku. Ten sam fix zastosowany w `MobileMenu.tsx` (panel "country" → "language").

**Co trzeba zrobić:** zbudować `MarketSwitcher` (waluta + wysyłka, oparty o cookie, nie URL) — dopiero gdy w adminie powstanie realny drugi `Market` (np. Eurozone/EUR). `updateCartMarket` (`src/lib/data/checkout.ts`) zostawiony nieużywany celowo — gotowa, przetestowana funkcja do reużycia w tym kroku.

**Warunek zamknięcia:** pełny plan w `sklepik/docs/plans/market-language-switcher.md` zrealizowany (kroki 2-4).

### 2026-07-07 — Zdjęcie główne na stronie produktu czasem się nie wyświetla (mitygacja, nie fix)

**Status:** otwarte (frontowa mitygacja wdrożona, przyczyna po stronie backendu/infra pozostaje)

**Skrót:** `MediaGallery` (`src/components/products/MediaGallery.tsx`) pokazywała jako główne zdjęcie wariant `xlarge` (2000×2000) — Spree generuje warianty Active Storage **na żądanie**, nie z góry. Na Renderze (starter/free, ograniczone CPU — patrz `sklepik/docs/stan-projektu.md` pkt 5) pierwsze wygenerowanie wariantu 2000×2000 zajęło zmierzone **12.5 s**; ten sam wariant po scache'owaniu — 1.3 s. Next.js/Vercel Image Optimization ma limit czasu na pobranie źródła — 12+ sekund go przekracza, więc pierwszy odwiedzający konkretny produkt (zanim wariant się scache'uje) widział brak zdjęcia zamiast oczekiwania.

**Zastosowana mitygacja:** `getMainImageUrl` preferuje teraz `large_url` (720×720 — i tak udokumentowany w Spree jako rozmiar pod galerię produktową) przed `xlarge_url`. Mniej pikseli = radykalnie krótszy czas generowania przy zimnym cache, mniejsze ryzyko przekroczenia timeoutu. `xlarge` zostaje tylko w `MediaLightbox` (powiększenie na kliknięcie — świadoma akcja użytkownika, może poczekać).

**Co zostaje nierozwiązane:** to mitygacja ryzyka, nie usunięcie przyczyny — każdy nowy rozmiar wariantu nadal generuje się leniwie przy pierwszym żądaniu, więc pierwszy odwiedzający wciąż może trafić na wolne (choć krótsze) oczekiwanie. Trwałe rozwiązanie: generowanie wariantów w tle zaraz po uploadzie zdjęcia — worker Sidekiq już działa (F7 zamknięte, backend na Oracle Cloud od 2026-07-09), ale nic jeszcze nie enqueue'uje tego joba, patrz **F20** w `sklepik/docs/roadmap.md`.

**Warunek zamknięcia:** worker w tle pre-generuje warianty przy uploadzie (F7 domknięte), więc żaden odwiedzający nigdy nie trafia na zimne generowanie.

### 2026-07-06 — Idempotencja webhooków e-mail w pamięci procesu

**Status:** zamknięte kodowo 2026-07-11, wymaga konfiguracji właściciela

**Skrót:** ochrona przed duplikatami zdarzeń przeniesiona z `Set` w pamięci na Upstash Redis (`src/lib/webhooks/idempotency.ts`, klucz `webhook-processed:{eventId}`, TTL 7 dni) — restart instancji Vercela już nie zeruje ochrony, **pod warunkiem że `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` (albo `KV_REST_API_URL`/`KV_REST_API_TOKEN` z Vercel KV) są ustawione**. Bez nich moduł po cichu wraca do starego zachowania (in-memory `Set`, log ostrzeżenia w produkcji) — działa, ale nie jest trwałe.

**Co trzeba zrobić:** właściciel zakłada bazę Upstash Redis (darmowy plan wystarcza) albo podłącza Vercel KV do projektu i ustawia dwie zmienne środowiskowe na Vercelu — kod jest gotowy na obie konwencje nazw.

**Warunek zamknięcia:** ✅ kod gotowy (F6 w `sklepik/docs/roadmap.md`). Pełne zamknięcie operacyjne — gdy zmienne są faktycznie ustawione na produkcji.

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
### 2026-07-14 — Storefront composition MVP

**Status:** otwarte, bezpieczny zakres pierwszej wersji

Strona główna renderuje obecnie dwa bezpieczne typy sekcji z dokumentu publikowanego przez backend: `hero` i `product_grid`. To świadomie mały kontrakt MVP. Nie ma jeszcze motywów, edycji kolorów/typografii, breakpointowych ustawień layoutu, preview URL ani migracji dokumentów między wersjami renderera. Rozszerzać kontrakt sekcja po sekcji; nie dodawać dowolnego HTML/JavaScript. Brak opublikowanego dokumentu celowo zachowuje istniejący storefront kakao.
