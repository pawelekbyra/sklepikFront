# Kierunek frontu: Kakałowy Sklepik

## Cel repozytorium

`sklepikFront` jest frontendową warstwą projektu Kakałowy Sklepik: premium doświadczenie zakupowe dla produktów kakao, oparte o Next.js, Store API backendu i deployment na Vercel. Repo bazuje na forku oficjalnego Spree Storefront, ale jest rozwijane jako storefront własnej marki, nie jako demo.

Kanon całego systemu (cel, podział repo, hierarchia decyzji): `sklepik/docs/kierunek-projektu.md`.

## Priorytety frontu

1. Zachować działający koszyk i checkout.
2. Nie psuć integracji ze Store API.
3. Stopniowo odchodzić od generycznego wyglądu szablonu.
4. Budować premium klimat marki kakao.
5. Utrzymać dobre SEO i wydajność.
6. Izolować eksperymentalne funkcje od krytycznej ścieżki zakupowej.

## Kierunek marki

Robocza nazwa: **Kakałowy Sklepik**.

Ton marki: premium, naturalny, spokojny, edukacyjny, ciepły, konkretny — bez korpo-języka i bez "marketplace vibe". Sklep ma wyglądać jak marka z historią i jakością, nie jak losowy template e-commerce.

Klient ma dostać odpowiedzi: czym jest kakao ceremonialne, dlaczego kupić właśnie tutaj, czym różnią się produkty, jak przygotować kakao, jak działa dostawa i zwroty.

## Zakres MVP frontu (Faza 2 roadmapy)

- homepage z jasnym hero,
- header/footer z prostą nawigacją,
- katalog produktów i strona produktu,
- koszyk i checkout UI,
- strony: O nas, Dostawa, Zwroty, Kontakt + strony prawne,
- podstawowe SEO.

Poza zakresem (świadomie później): gry, VOD, AI, quizy, subskrypcje, program lojalnościowy, duży redesign checkoutu.

## Zasady zmian frontendowych

Branding trafia głównie do: layoutu, homepage, headera, footera, komponentów marketingowych, stron informacyjnych, tekstów SEO. Checkout zmieniamy ostrożnie i tylko z jasnym powodem.

Jeśli frontend potrzebuje nowego pola, endpointu albo logiki commerce — nie udajemy tego hardcodem; opisujemy wymaganie względem repo `sklepik`.

## Aktualny etap (2026-07-06)

Zrobione: rebranding podstawowy (nazwa, layout bez elementów demo), polski domyślny locale bez prefiksu URL, katalog i strony produktów działają na realnych danych z backendu.

Przed nami (kolejność wg `sklepik/docs/roadmap.md`): rewalidacja cache po zmianach w adminie (F4), trwała idempotencja webhooków e-mail (F6), potem pełny branding premium, strony informacyjne i płatności w Fazie 2.
