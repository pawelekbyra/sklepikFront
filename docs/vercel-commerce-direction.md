# Kierunek: Vercel Commerce + Spree

## Decyzja

Chcemy użyć **Vercel Commerce** jako jakościowego kierunku dla storefrontu.

Nie chodzi tylko o inspirację wizualną. Traktujemy Vercel Commerce jako preferowany model frontendu: wysokiej jakości Next.js commerce, dobry pod Vercel, nowoczesny App Router i lepszy punkt startu dla premium UX.

## Ważne zastrzeżenie

Oficjalny `vercel/commerce` jest aktywnie utrzymywany głównie w wersji Shopify.

Vercel Commerce zakłada architekturę providerów: warstwa UI i aplikacji może zostać, ale provider commerce musi być podmieniony.

Dla nas oznacza to:

```text
Vercel Commerce UI / app structure
+
custom Spree provider / adapter
+
sklepik jako backend Spree
```

Nie przechodzimy na Shopify.

Nie wyrzucamy `sklepik`.

Nie rezygnujemy z własnego backendu.

## Docelowa architektura

```text
sklepik
→ Spree backend, admin, API, produkty, zamówienia, płatności

sklepikFront
→ Vercel Commerce-style Next.js storefront
→ custom adapter do Spree API
→ deployment na Vercel
```

## Co trzeba będzie zrobić

Żeby użyć Vercel Commerce z naszym backendem Spree, trzeba przygotować adapter, który mapuje oczekiwania frontu na Spree API.

Minimalny adapter powinien obsłużyć:

- listę produktów,
- szczegóły produktu,
- warianty,
- kolekcje/kategorie,
- wyszukiwanie,
- koszyk,
- dodawanie do koszyka,
- aktualizację koszyka,
- checkout,
- ceny,
- obrazy produktów,
- SEO/metadane produktu.

## Ryzyko

To nie jest najkrótsza droga do działającego sklepu.

Oficjalny Spree Storefront działa ze Spree API od razu. Vercel Commerce wymaga adaptera.

Ryzyko jest takie, że uzyskamy lepszy frontend, ale opóźnimy działający koszyk i checkout.

## Dlaczego mimo to może być warto

Vercel Commerce może dać:

- lepszy kod frontendu,
- lepszy UX jako punkt wyjścia,
- lepszy fit pod Vercel,
- większą popularność i więcej wzorców,
- prostsze myślenie o premium storefrontcie,
- mniej generyczny klimat niż standardowy Spree Storefront.

## Decyzja robocza

Przechodzimy w kierunku Vercel Commerce, ale zapisujemy to jako decyzję wymagającą adaptera Spree.

Dopóki adapter nie działa, nie wolno udawać, że mamy pełny sklep.

## Następny krok

1. Utworzyć albo pozyskać repo bazujące na `vercel/commerce`.
2. Zmapować strukturę Vercel Commerce.
3. Znaleźć warstwę providerową Shopify.
4. Zaprojektować `lib/spree` jako zamiennik `lib/shopify`.
5. Sprawdzić minimalny zakres: produkty → produkt → koszyk.
6. Dopiero potem decydować, czy zastępujemy obecny kod `sklepikFront`, czy tworzymy równoległą gałąź/prototyp.
