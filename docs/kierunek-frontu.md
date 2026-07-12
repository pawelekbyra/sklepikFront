# Kierunek frontu: Serowy Michał

## Cel repozytorium

`sklepikFront` jest frontendową warstwą publicznej marki **Serowy Michał**: autonomicznego AI-przedsiębiorcy, który buduje portfolio biznesów na oczach odbiorców i dokumentuje decyzje, sukcesy oraz porażki. Technicznie repo pozostaje aplikacją Next.js 16 + React 19, konsumującą Store API backendu przez `@spree/sdk` i wdrażaną na Vercel.

Obecny sklep, katalog produktów, koszyk, checkout i konta klientów zostają w tym repo, ale nie są już jedyną osią strony głównej. Sklep jest modułem commerce i pierwszą kartą portfolio marki.

Kanon całego systemu (cel, podział repo, hierarchia decyzji): `sklepik/docs/kierunek-projektu.md`.

## Priorytety frontu

1. Zachować działający koszyk i checkout.
2. Nie psuć integracji ze Store API.
3. Ustawić stronę główną jako home marki Serowy Michał, nie landing wyłącznie sklepu.
4. Pokazać trzy filary marki: **Operator**, **Kanał**, **Portfolio**.
5. Oznaczać przyszłe projekty i dziennik jako placeholdery, dopóki właściciel nie dostarczy realnej treści.
6. Utrzymać dobre SEO, i18n i wydajność.
7. Izolować eksperymentalne funkcje od krytycznej ścieżki zakupowej.

## Kierunek marki

Nadrzędna marka: **Serowy Michał**.

Ton marki: konkretny, publiczny, bez korpo-języka, z osobowością. Strona ma pokazywać proces budowania firmy, a nie tylko finalne wyniki. Ważne jest jawne rozróżnienie między tym, co działa, co jest eksperymentem, a co jest jeszcze miejscem do uzupełnienia.

Trzy filary komunikacji:

- **Operator** — kto podejmuje decyzje i porządkuje priorytety.
- **Kanał** — publiczna historia budowania, razem z wnioskami i potknięciami.
- **Portfolio** — biznesy i moduły marki, w tym obecny sklep jako realny moduł commerce.

Nie zmyślamy dat, wyników finansowych, biografii ani nazw przyszłych biznesów. Brakujące informacje oznaczamy jako TODO albo placeholder.

## Zakres MVP frontu po zmianie kierunku

- homepage marki: hero Serowego Michała, sekcja „Jak to działa”, portfolio, sklep jako moduł, placeholder dziennika,
- header/footer z nawigacją brandową i zachowanymi wejściami do sklepu,
- katalog produktów i strona produktu,
- koszyk i checkout UI,
- strony prawne sklepu,
- podstawowe SEO dla marki.

Poza zakresem bez osobnej decyzji: zmiany w checkout/koszyku, hardcodowanie produktów lub cen, fikcyjne wpisy dziennika, nowe biznesy portfolio bez potwierdzonej treści.

## Zasady zmian frontendowych

Branding trafia głównie do: layoutu, homepage, headera, footera, komponentów marketingowych, stron informacyjnych, tekstów SEO i i18n. Checkout zmieniamy ostrożnie i tylko z jasnym powodem.

Jeśli frontend potrzebuje nowego pola, endpointu albo logiki commerce — nie udajemy tego hardcodem; opisujemy wymaganie względem repo `sklepik`.

## Aktualny etap (2026-07-12)

Zrobione: strona główna została przebudowana z układu sklepowego na home marki Serowy Michał. Kolejność sekcji to hero marki, meta-narracja „Jak to działa”, portfolio, sklep z realnymi danymi Store API oraz placeholder dziennika. Header i footer używają brandowej nazwy Serowy Michał, a sklep jest linkowany jako moduł przez `/products`.

Wciąż aktualne: katalog, koszyk, checkout i konta klientów pozostają oparte o Store API i nie zostały przebudowane w ramach rebrandingu. Placeholdery portfolio i dziennika wymagają realnej treści od właściciela zanim staną się publikowanymi faktami.
