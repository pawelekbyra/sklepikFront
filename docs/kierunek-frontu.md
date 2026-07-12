# Kierunek frontu: Serowy Michał / sklepikFront

## Cel repozytorium

`sklepikFront` jest frontendową warstwą sklepu rozwijaną teraz jako dom marki **Serowy Michał**: opowieść o rzemieślniczej firmie z opcją zakupu produktów, w tym flagowych **HEJARTÓW**. Aplikacja nadal opiera się o Next.js, Store API backendu i deployment na Vercel. Repo bazuje na forku oficjalnego Spree Storefront, ale jest rozwijane jako storefront własnej marki, nie jako demo.

Kanon całego systemu (cel, podział repo, hierarchia decyzji): `sklepik/docs/kierunek-projektu.md`.

## Priorytety frontu

1. Zachować działający koszyk i checkout.
2. Nie psuć integracji ze Store API.
3. Stopniowo odchodzić od generycznego wyglądu szablonu.
4. Budować wyrazisty, rzemieślniczy klimat marki Serowy Michał.
5. Utrzymać dobre SEO i wydajność.
6. Izolować eksperymentalne funkcje od krytycznej ścieżki zakupowej.

## Kierunek marki

Marka frontowa: **Serowy Michał**.

Ton marki: rzemieślniczy, bezpośredni, odważny, ciepły, z humorem — bez korpo-języka i bez "marketplace vibe". Strona ma wyglądać jak dom marki z charakterem, nie jak losowy template e-commerce.

Klient ma najpierw zrozumieć, kim jest Serowy Michał i dlaczego HEJARTY są produktem-bohaterem, a dopiero potem płynnie przejść do zakupów, dostawy, zwrotów i konta.

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

## Aktualny etap (2026-07-12)

Zrobione: rebranding podstawowy (nazwa, layout bez elementów demo), polski domyślny locale bez prefiksu URL, katalog i strony produktów działają na realnych danych z backendu, rewalidacja cache po zmianach w adminie w tym edycji cen (F4, zamknięte), trwała idempotencja webhooków e-mail przez Upstash Redis (F6, zamknięte kodowo — wymaga ustawienia zmiennych środowiskowych na Vercelu, patrz `docs/technical-debt.md`).

Przed nami (kolejność wg `sklepik/docs/roadmap.md`): pełny branding premium, strony informacyjne, strony prawne i płatności w Fazie 2.

## Pivot landingu: Serowy Michał (2026-07-12)

Strona główna została przekształcona z generycznego storefrontu w dom marki **Serowy Michał**. Główna narracja prowadzi przez osobowość rzemieślniczej firmy, a sklep jest świadomie potraktowany jako opcja zakupowa. Flagowym produktem komunikowanym na froncie są **HEJARTY**; realne dane produktowe nadal pochodzą ze Store API, bez hardcodowania cen, wariantów i logiki commerce w frontendzie.

Zakres tej zmiany obejmuje homepage, wejście do podstrony sklepu, header i footer. Checkout oraz koszyk nie były zmieniane.
