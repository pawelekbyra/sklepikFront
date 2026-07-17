# Kierunek frontu: wspólny storefront Fabryki Sklepów (Kakałowy Sklepik jako pierwszy tenant)

## Cel repozytorium

`sklepikFront` ewoluuje z frontendu jednej marki (Kakałowy Sklepik) w **jedną, współdzieloną aplikację obsługującą wiele sklepów** — model docelowy opisany w `sklepik/docs/plans/storefront-composition-system.md` (decyzja właściciela 2026-07-17, po odrzuceniu wcześniejszego kierunku "repo per sklep"). Jeden deployment Next.js rozpoznaje sklep po domenie/`store_id`, renderuje layout jako dane (drzewo sekcji + design tokens), i wystawia chronioną trasę `/admin` osadzającą silnik edytora z osobnego repo `edytor-sklepu`. Repo bazuje na forku oficjalnego Spree Storefront.

Do czasu ukończenia tej migracji Kakałowy Sklepik pozostaje jedynym, referencyjnym wdrożeniem — priorytety niżej (premium branding kakao) są nadal aktualne dla tego tenanta, ale nowa praca architektoniczna powinna być projektowana pod wielosklepowość, nie pod jedną markę na stałe.

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

## Aktualny etap (2026-07-11)

Zrobione: rebranding podstawowy (nazwa, layout bez elementów demo), polski domyślny locale bez prefiksu URL, katalog i strony produktów działają na realnych danych z backendu, rewalidacja cache po zmianach w adminie w tym edycji cen (F4, zamknięte), trwała idempotencja webhooków e-mail przez Upstash Redis (F6, zamknięte kodowo — wymaga ustawienia zmiennych środowiskowych na Vercelu, patrz `docs/technical-debt.md`).

Przed nami (kolejność wg `sklepik/docs/roadmap.md`): pełny branding premium, strony informacyjne, strony prawne i płatności w Fazie 2.
