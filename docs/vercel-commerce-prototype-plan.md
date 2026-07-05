# Plan prototypu: Vercel Commerce + Spree adapter

## Cel

Sprawdzić, czy możemy oprzeć `sklepikFront` na Vercel Commerce zamiast standardowego Spree Storefront, bez porzucania backendu `pawelekbyra/sklepik`.

## Decyzja robocza

Kierunek:

```text
Vercel Commerce UI / app structure
+
custom Spree adapter
+
sklepik jako backend Spree
```

Nie przechodzimy na Shopify.

Nie wyrzucamy Spree.

Nie podmieniamy obecnego kodu frontu bez działającego prototypu.

## Dlaczego prototyp, a nie natychmiastowa podmiana

Vercel Commerce jest mocnym fundamentem frontendowym, ale jego aktywnie utrzymywana wersja jest głównie pod Shopify.

Dla naszego systemu trzeba zrobić adapter do Spree API.

Obecny `sklepikFront` oparty o Spree Storefront zostaje jako bezpieczna baza kompatybilnościowa, dopóki Vercel Commerce + Spree adapter nie przejdzie minimalnego testu.

## Bezpieczna strategia

Nie kasujemy obecnego kodu.

Nie robimy dużej podmiany na `main` bez dowodu.

Najpierw tworzymy prototyp:

```text
opcja A: osobne repo prototypowe, np. sklepikFront-vercel-commerce
opcja B: osobna gałąź w sklepikFront, np. prototype/vercel-commerce-spree
```

Rekomendacja: osobna gałąź albo osobne repo prototypowe. Nie mieszać dużej migracji z bieżącym frontem.

## Checklist prototypu

- [ ] Pozyskać kod `vercel/commerce` jako osobny prototyp albo gałąź.
- [ ] Zmapować strukturę katalogów Vercel Commerce.
- [ ] Zidentyfikować warstwę Shopify/provider.
- [ ] Zaprojektować `lib/spree` jako zamiennik `lib/shopify`.
- [ ] Zmapować model produktu Vercel Commerce do Spree API.
- [ ] Zmapować warianty i ceny.
- [ ] Zmapować kategorie/kolekcje.
- [ ] Uruchomić listę produktów ze Spree.
- [ ] Uruchomić stronę produktu ze Spree.
- [ ] Uruchomić dodawanie do koszyka.
- [ ] Uruchomić odczyt i aktualizację koszyka.
- [ ] Sprawdzić checkout testowy.
- [ ] Dopisać wynik prototypu do `docs/vercel-commerce-direction.md`.
- [ ] Jeśli prototyp działa: zaplanować migrację `sklepikFront`.
- [ ] Jeśli prototyp nie działa sensownie: zostać przy Spree Storefront i przenieść tylko inspiracje UX.

## Warunek sukcesu

Prototyp jest sukcesem, jeśli Vercel Commerce-style frontend potrafi przejść minimum:

```text
lista produktów → strona produktu → koszyk → checkout testowy
```

z backendem `sklepik` przez Spree API.

## Warunek porażki

Prototyp uznajemy za zbyt kosztowny, jeśli:

- adapter wymaga przepisywania większości commerce flow,
- checkout wymaga zbyt dużego obejścia,
- mapowanie produktów/wariantów jest niestabilne,
- tracimy więcej czasu niż zyskujemy na jakości frontu,
- standardowy Spree Storefront da się szybciej doprowadzić do akceptowalnego premium UX.

## Zasada decyzji

Nie wybieramy gotowca dlatego, że jest modny.

Wybieramy go tylko wtedy, jeśli realnie przyspiesza drogę do lepszego sklepu.

Jeśli Vercel Commerce da nam lepszy frontend bez rozwalenia integracji ze Spree — idziemy w to.

Jeśli adapter okaże się ciężki — wracamy do Spree Storefront i wykorzystujemy Vercel Commerce jako inspirację UX.

## Powiązana dokumentacja

- `docs/vercel-commerce-direction.md`
- `docs/technical-debt.md`
- `docs/system-map.md`
- `docs/deployment-env.md`
