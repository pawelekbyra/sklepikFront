# Mapa systemu: Kakao Sklepik

## Podział repozytoriów

System Kakao Sklepik składa się z dwóch głównych repozytoriów:

```text
pawelekbyra/sklepik
→ silnik, backend, admin, API, logika commerce, eksperymenty z core Spree

pawelekbyra/sklepikFront
→ Next.js storefront, doświadczenie klienta, branding, UX, SEO, Vercel
```

## Rola `sklepik`

Repozytorium `sklepik` odpowiada za fundament commerce:

- Spree backend,
- admin,
- API,
- produkty,
- zamówienia,
- płatności,
- wysyłkę,
- logikę commerce,
- potencjalne modyfikacje core,
- decyzje silnikowe.

Zmiany w `sklepik` powinny być dokumentowane w jego lokalnej dokumentacji, szczególnie w `docs/engine-decisions.md`, jeśli dotyczą core lub backendowego zachowania sklepu.

## Rola `sklepikFront`

Repozytorium `sklepikFront` odpowiada za warstwę klienta:

- Next.js storefront,
- homepage,
- layout,
- header,
- footer,
- katalog produktów,
- stronę produktu,
- koszykowy UX,
- checkout UI,
- konto klienta,
- SEO,
- treści marketingowe,
- storytelling kakao,
- Vercel deployment,
- przyszłe moduły doświadczenia: quizy, VOD, gry, AI, edukacja.

To repo jest miejscem, gdzie powstaje widoczna przewaga marki.

## Komunikacja między repo

`sklepikFront` komunikuje się z backendem przez Spree API.

Kluczowe zmienne środowiskowe storefrontu:

```env
SPREE_API_URL=
SPREE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEFAULT_COUNTRY=
NEXT_PUBLIC_DEFAULT_LOCALE=
```

Zmiany w API lub modelach backendowych w `sklepik` mogą wymagać dostosowania `sklepikFront`.

Zmiany UX lub frontendowe w `sklepikFront` mogą ujawnić potrzebę nowych endpointów, pól, konfiguracji albo modułów w `sklepik`.

## Zasada spójności dokumentacji

Dokumentacja w obu repozytoriach ma być zgodna co do:

- celu projektu,
- nazwy roboczej Kakao Sklepik,
- podziału odpowiedzialności,
- zasad stabilności checkoutu,
- decyzji, które repo odpowiada za daną zmianę.

Jeśli zmiana dotyczy całego systemu, trzeba zaktualizować dokumentację w obu repo.

## Zasada pracy

Nie zmieniamy frontendu tak, jakby backend był czarną skrzynką.

Nie zmieniamy backendu tak, jakby frontend nie istniał.

To są dwa repozytoria, ale jeden system.
