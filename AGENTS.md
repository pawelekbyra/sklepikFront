# SklepikFront — nadrzędne zasady pracy agentów

Ten plik jest nadrzędną instrukcją dla agentów kodowania pracujących w repozytorium `sklepikFront`.

To repozytorium nie jest już traktowane jako neutralne demo Spree Storefront. To jest frontend projektu **Kakao Sklepik**: warstwa doświadczenia klienta, branding, UX, SEO i deployment na Vercel.

## Podział repozytoriów

System składa się z dwóch repozytoriów:

```text
pawelekbyra/sklepik
→ silnik, backend, admin, API, logika commerce, eksperymenty z core Spree

pawelekbyra/sklepikFront
→ Next.js storefront, doświadczenie klienta, branding, UX, SEO, Vercel
```

To repozytorium, `sklepikFront`, odpowiada za frontend klienta. Nie modyfikujemy tutaj core commerce. Jeśli zmiana wymaga backendu, API, admina albo zmian w silniku, należy opisać to jako wymaganie względem repo `sklepik`.

## Hierarchia decyzji

W razie konfliktu priorytetów obowiązuje kolejność:

1. Cel projektu Kakao Sklepik.
2. Decyzje właściciela projektu.
3. Lokalna dokumentacja w `AGENTS.md` i `docs/`.
4. Stabilność zakupów, koszyka i checkoutu.
5. Kompatybilność ze Spree Storefront upstream.
6. Oryginalne konwencje Spree Storefront.

## Cel tego repozytorium

`sklepikFront` ma być storefrontem dla marki Kakao Sklepik.

Projekt ma umożliwiać:

- szybki deployment na Vercel,
- pełną personalizację wyglądu sklepu,
- storytelling marki kakao,
- katalog produktów,
- stronę produktu,
- koszyk,
- checkout połączony ze Spree API,
- SEO,
- strony informacyjne,
- przyszłe moduły: quizy, VOD, gry, edukacja, program lojalnościowy i AI.

## Główna zasada

Frontend ma być miejscem magii, ale nie może rozwalać core commerce.

Eksperymentalne elementy, takie jak gry, VOD, quizy czy AI, mają być izolowane od krytycznej ścieżki zakupowej.

Checkout, koszyk, płatności i konto klienta muszą pozostać stabilne.

## Zasady dla agentów

Przed zmianą kodu agent ma ustalić, czy zmiana dotyczy:

- brandingu,
- homepage,
- layoutu,
- headera,
- footera,
- katalogu,
- strony produktu,
- koszyka,
- checkoutu,
- konta klienta,
- SEO,
- integracji API,
- deploymentu,
- dokumentacji.

Agent powinien:

- preferować małe, logiczne commity,
- nie zmieniać checkoutu bez jasnego powodu,
- nie usuwać integracji ze Spree API,
- nie wprowadzać nowych usług bez uzasadnienia,
- nie hardcodować danych produkcyjnych,
- traktować `sklepik` jako źródło backendu i API,
- utrzymywać zgodność dokumentacji z repo `sklepik`.

## Czego nie robić

Nie traktuj tego repo jako zwykłego demo Spree Storefront.

Nie przenoś tu logiki backendowej.

Nie próbuj rozwiązywać problemów core commerce w frontendzie, jeśli powinny być rozwiązane w `sklepik`.

Nie zmieniaj krytycznej ścieżki checkoutu przy okazji zmian wizualnych.

Nie usuwaj gotowych mechanizmów Spree Storefront bez powodu.

## Aktualny etap

Projekt jest w fazie przygotowania Kakao MVP.

Najpierw trzeba:

- uporządkować dokumentację,
- zmapować pliki brandingu,
- skonfigurować połączenie ze Spree API,
- wykonać pierwszy bezpieczny branding commit,
- przygotować deployment na Vercel.

## Ważne dokumenty

- `AGENTS.md` — nadrzędne zasady pracy w tym repo.
- `docs/kierunek-frontu.md` — kierunek frontendowy.
- `docs/system-map.md` — podział odpowiedzialności między `sklepik` i `sklepikFront`.

Jeśli agent ma wątpliwość, ma najpierw sprawdzić dokumentację lokalną, a dopiero potem upstreamowe README Spree Storefront.
