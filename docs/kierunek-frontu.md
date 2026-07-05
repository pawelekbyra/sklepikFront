# Kierunek frontu: Kakao Sklepik

## Cel repozytorium

`sklepikFront` jest frontendową warstwą projektu Kakao Sklepik.

To repozytorium bazuje na gotowym Spree Storefront, ale od tego momentu jest traktowane jako storefront marki Kakao Sklepik, a nie jako neutralne demo Spree.

Celem jest stworzenie premium doświadczenia zakupowego dla produktów kakao, opartego o Next.js, Spree API i możliwość deploymentu na Vercel.

## Relacja z repo `sklepik`

`sklepikFront` nie zastępuje repo `sklepik`.

Podział jest następujący:

```text
sklepik
→ backend, admin, API, silnik commerce

sklepikFront
→ frontend klienta, branding, UX, SEO, Vercel
```

Wszystkie decyzje frontendowe muszą zakładać, że backendowym źródłem prawdy jest `sklepik`.

## Priorytety frontu

1. Zachować działający koszyk i checkout.
2. Nie psuć integracji ze Spree API.
3. Stopniowo odchodzić od generycznego wyglądu Spree Storefront.
4. Budować premium klimat marki kakao.
5. Utrzymać dobre SEO i wydajność.
6. Przygotować projekt do łatwego deploymentu na Vercel.
7. Izolować eksperymentalne funkcje od krytycznej ścieżki zakupowej.

## Kierunek marki

Robocza nazwa projektu: **Kakao Sklepik**.

Ton marki:

- premium,
- naturalny,
- spokojny,
- edukacyjny,
- ciepły,
- konkretny,
- bez przesadnego korpo-języka.

Sklep ma wyglądać jak marka z historią i jakością, nie jak losowy template e-commerce.

## Zakres MVP frontu

Pierwszy frontendowy MVP powinien objąć:

- zmianę nazwy i podstawowych tekstów na Kakao Sklepik,
- homepage z jasnym hero section,
- header z prostą nawigacją,
- footer z podstawowymi linkami,
- katalog produktów,
- stronę produktu,
- koszyk,
- checkout UI,
- strony: O nas, Dostawa, Zwroty, Kontakt,
- podstawowe SEO.

## Poza zakresem MVP

Na razie nie robimy:

- gry,
- VOD,
- AI doradcy,
- zaawansowanego quizu,
- programu lojalnościowego,
- subskrypcji,
- dużego redesignu checkoutu,
- zmian wymagających modyfikacji core backendu bez osobnej decyzji.

Te rzeczy są ważne, ale przyjdą po ustabilizowaniu podstawowego sklepu.

## Zasady zmian frontendowych

Zmiany brandingu powinny trafiać głównie do:

- layoutu,
- homepage,
- headera,
- footera,
- komponentów marketingowych,
- stron informacyjnych,
- tekstów SEO.

Zmiany checkoutu robimy ostrożnie i tylko wtedy, gdy wiadomo, że nie zaburzą flow zakupowego.

Jeśli frontend potrzebuje nowego pola, endpointu albo logiki commerce, nie próbujemy udawać tego hardcodem. Dokumentujemy wymaganie względem `sklepik`.

## Deployment

Docelowo `sklepikFront` jest kandydatem do deploymentu na Vercel.

Backend/admin/API ze `sklepik` powinny być wdrażane osobno na platformie odpowiedniej dla Spree/Rails/Docker/Postgres.

## Filozofia

`sklepik` daje kontrolę nad silnikiem.

`sklepikFront` daje widoczną przewagę: UX, marka, storytelling, SEO, szybkość i eksperymenty.

Nie budujemy tylko sklepu. Budujemy system, w którym sklep jest pierwszą wersją większej platformy commerce.
