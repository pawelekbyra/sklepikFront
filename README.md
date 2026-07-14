# Sklepik Front — wersjonowany storefront

Wspólny rdzeń storefrontów tworzonych przez platformę **Sklepik**. Next.js 16 + React 19 + Tailwind renderuje produkty, checkout, branding i opublikowany dokument layoutu pobierany ze Store API. Sklep kakao jest pierwszym wdrożeniem referencyjnym i pozostaje domyślnym wyglądem, dopóki właściciel nie opublikuje własnej strony.

Silnik commerce, tenanty, edytor i panel właściciela żyją w drugim repozytorium — [`pawelekbyra/sklepik`](https://github.com/pawelekbyra/sklepik).

```text
pawelekbyra/sklepik       ← platforma: commerce, tenanty, panel, edytor, provisioning
pawelekbyra/sklepikFront  ← TO REPO: wspólny renderer storefrontu, UX, SEO, Vercel
```

Zasada podziału: cała logika commerce (produkty, ceny, koszyk, zamówienia, płatności) należy do backendu. Ten frontend renderuje doświadczenie klienta i niczego nie udaje hardcodem.

## Zacznij tutaj

1. **Kanon systemu** (wizja, hierarchia decyzji, architektura, stan, roadmapa): `sklepik/docs/` — [kierunek-projektu](https://github.com/pawelekbyra/sklepik/blob/main/docs/kierunek-projektu.md) · [architektura](https://github.com/pawelekbyra/sklepik/blob/main/docs/architektura.md) · [stan projektu](https://github.com/pawelekbyra/sklepik/blob/main/docs/stan-projektu.md) · [roadmapa](https://github.com/pawelekbyra/sklepik/blob/main/docs/roadmap.md)
2. **Kierunek frontu i marki:** [`docs/kierunek-frontu.md`](docs/kierunek-frontu.md)
3. **Zasady dla agentów kodowania:** [`AGENTS.md`](AGENTS.md) i [`CLAUDE.md`](CLAUDE.md)
4. **Deploy i zmienne środowiskowe:** [`docs/deployment-vercel.md`](docs/deployment-vercel.md)

## Deployment

Vercel, projekt `sklepik_front` → `sklepikkk.vercel.app` (deploy automatyczny z `main`). Backend produkcyjny działa na Oracle Cloud — aktualne adresy i topologia są w kanonicznym `sklepik/docs/architektura.md`.

## Stack i struktura

Next.js 16 (App Router, Server Components), React 19, Tailwind CSS 4, TypeScript, `@spree/sdk`, Biome, Vitest + Playwright.

```text
src/
├── app/
│   ├── [locale]/          # pl bez prefiksu w URL; inne języki z prefiksem /{locale}
│   │   ├── (storefront)/  # pełny layout: katalog, produkt, koszyk, konto
│   │   └── (checkout)/    # minimalny layout checkoutu
│   └── api/webhooks/      # webhooki z backendu (e-maile transakcyjne)
├── components/
├── lib/
│   ├── data/              # Server Actions / pobieranie danych ze Store API
│   ├── spree/             # klient SDK, middleware, konfiguracja
│   └── store.ts           # nazwa sklepu, domyślny kraj/locale (env + defaulty pl)
└── types/
```

## Rozwój lokalny

```bash
npm install
cp .env.local.example .env.local   # SPREE_API_URL, SPREE_PUBLISHABLE_KEY
npm run dev                        # http://localhost:3001

npm run check                      # Biome lint + format
npx vitest run                     # testy jednostkowe
npm run build                      # weryfikacja produkcyjna
```

Backend lokalny uruchomisz z repo `sklepik` (`pnpm server:dev` → `http://localhost:3000`) albo wskaż `SPREE_API_URL` na backend produkcyjny (tylko do odczytu danych testowych).

## Pochodzenie i licencja

Bazuje na forku oficjalnego [Spree Storefront](https://github.com/spree/storefront) (MIT — patrz [`LICENSE`](LICENSE)). Od momentu forka rozwijany jako storefront własnej marki.
