# Skróty tymczasowe i dług techniczny

## Cel dokumentu

Ten dokument zapisuje świadome skróty, decyzje tymczasowe i rzeczy, które trzeba wrócić poprawić.

Zasada projektu: jeśli idziemy na skróty, zapisujemy to tutaj, żeby później nikt nie traktował rozwiązania tymczasowego jako finalnej architektury.

## Statusy

- `otwarte` — trzeba wrócić i naprawić albo doprecyzować.
- `w toku` — temat jest aktualnie rozwiązywany.
- `zamknięte` — skrót został spłacony albo decyzja stała się finalna.

## Dług techniczny

### 2026-07-05 — Deploy frontu na Vercel przed finalnym backendem

**Status:** otwarte

**Skrót:** Możemy wdrożyć `sklepikFront` na Vercel wcześniej, zanim backend `sklepik` ma finalny publiczny hosting.

**Dlaczego to robimy:** Chcemy szybko zobaczyć frontend publicznie, testować wygląd, routing, build i pierwsze zmiany brandingowe Kakao Sklepik.

**Ryzyko:** Front na Vercelu nie będzie w pełni produkcyjnym sklepem, jeśli `SPREE_API_URL` nie wskazuje na publiczny backend Spree. Sam adres Vercela nie zastępuje Spree API.

**Co trzeba zrobić później:**

1. Wybrać hosting dla backendu `sklepik`.
2. Wystawić publiczny URL backendu Spree.
3. Ustawić w Vercel prawdziwe `SPREE_API_URL`.
4. Ustawić `SPREE_PUBLISHABLE_KEY`.
5. Przetestować katalog, koszyk i checkout end-to-end.

**Warunek zamknięcia:** `sklepikFront` działa na Vercel z publicznym backendem `sklepik`, a koszyk i checkout działają w środowisku testowym.

### 2026-07-05 — Branding przed pełnym finalnym deploymentem commerce

**Status:** otwarte

**Skrót:** Możemy rozpocząć podstawowy branding Kakao Sklepik, zanim cała infrastruktura backendowa jest finalnie ustawiona.

**Dlaczego to robimy:** Branding i struktura frontu mogą iść równolegle z decyzją hostingową backendu.

**Ryzyko:** Część widoków może zależeć od danych demo albo niedocelowego backendu.

**Co trzeba zrobić później:**

1. Zastąpić dane demo realnymi produktami kakao.
2. Sprawdzić, czy product pages korzystają z docelowego API.
3. Sprawdzić koszyk i checkout na docelowym backendzie.
4. Usunąć albo oznaczyć wszystkie treści demo.

**Warunek zamknięcia:** Front ma podstawowy branding Kakao Sklepik i działa z docelowymi produktami/testowym backendem Spree.

### 2026-07-05 — Vercel Commerce wymaga adaptera Spree

**Status:** otwarte

**Skrót/decyzja:** Chcemy użyć Vercel Commerce jako lepszego fundamentu frontendowego, mimo że oficjalny `vercel/commerce` jest aktywnie utrzymywany głównie pod Shopify.

**Dlaczego to robimy:** Vercel Commerce może dać lepszy UX, lepszy kod frontu, lepszy fit pod Vercel i bardziej premium punkt startu niż standardowy Spree Storefront.

**Ryzyko:** Vercel Commerce nie działa ze Spree API od razu. Trzeba przygotować custom adapter Spree, który zastąpi warstwę Shopify/provider.

**Co trzeba zrobić później:**

1. Pozyskać kod Vercel Commerce.
2. Zmapować aktualną warstwę `lib/shopify`.
3. Zaprojektować `lib/spree` jako adapter do Spree API.
4. Obsłużyć minimum: produkty, produkt, warianty, koszyk, checkout.
5. Dopiero po działającym adapterze uznać Vercel Commerce za realny storefront sklepu.

**Warunek zamknięcia:** Vercel Commerce-style frontend działa z backendem `sklepik` przez Spree API co najmniej dla flow: produkt → koszyk → checkout testowy.
