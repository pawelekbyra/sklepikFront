# Pierwszy deploy Vercel: sklepikFront

## Cel

Celem pierwszego deployu Vercel jest szybkie wystawienie `sklepikFront` publicznie, żeby można było sprawdzić:

- czy projekt buduje się poprawnie,
- czy działa routing,
- czy działa podstawowy layout,
- czy można zacząć branding Kakao Sklepik,
- czy deployment Vercel jest poprawnie skonfigurowany.

To nie jest jeszcze finalny produkcyjny sklep, jeśli backend `sklepik` nie ma publicznego URL i poprawnego `SPREE_API_URL`.

## Ważne: świadomy skrót

Pierwszy deploy Vercel przed finalnym backendem jest świadomym skrótem.

Ten skrót jest zapisany w:

```text
docs/technical-debt.md
```

Dopóki `SPREE_API_URL` nie wskazuje na publiczny backend Spree, sklep może nie mieć w pełni działających produktów, koszyka i checkoutu.

## Repozytorium do deployu

Deployujemy:

```text
pawelekbyra/sklepikFront
```

Nie deployujemy na Vercel repo `pawelekbyra/sklepik`, bo ono jest fundamentem backend/admin/API Spree.

## Ustawienia projektu Vercel

Rekomendowane ustawienia:

```text
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Install Command: npm install
Output Directory: .next
Development Command: npm run dev
```

Projekt używa skryptów z `package.json`:

```json
{
  "dev": "next dev -p 3001 --turbopack",
  "build": "next build",
  "start": "next start -p 3001"
}
```

## Minimalne zmienne środowiskowe

Na pierwszy deploy trzeba ustawić w Vercel:

```env
SPREE_API_URL=
SPREE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEFAULT_COUNTRY=pl
NEXT_PUBLIC_DEFAULT_LOCALE=pl
```

## Co wpisać tymczasowo

Jeżeli backend `sklepik` nie ma jeszcze publicznego URL, mamy trzy opcje:

### Opcja A — użyć demo/staging backendu Spree

Dobre do szybkiego sprawdzenia frontu.

Ryzyko: dane nie będą nasze.

### Opcja B — użyć tymczasowego publicznego tunelu do lokalnego backendu

Dobre do testów, ale nietrwałe.

Ryzyko: tunel może wygasnąć albo zmieniać URL.

### Opcja C — wdrożyć front bez pełnego API

Dobre do sprawdzenia buildu, routingu i statycznych elementów.

Ryzyko: katalog, koszyk i checkout mogą nie działać.

## Co będzie działać od razu

Po udanym deployu Vercel powinniśmy móc sprawdzić:

- czy aplikacja się buduje,
- czy strona publiczna się otwiera,
- czy routing Next.js działa,
- czy nie ma oczywistych błędów deploymentu,
- czy można zacząć pierwszy bezpieczny branding commit.

## Co może nie działać bez publicznego backendu

Bez poprawnego `SPREE_API_URL` i `SPREE_PUBLISHABLE_KEY` mogą nie działać:

- lista produktów,
- szczegóły produktu,
- koszyk,
- checkout,
- konto klienta,
- płatności,
- strony pobierane z API Spree.

## Warunki uznania pierwszego deployu za udany

Pierwszy deploy Vercel uznajemy za udany, jeśli:

1. build przechodzi,
2. aplikacja ma publiczny adres Vercel,
3. nie ma błędu startowego aplikacji,
4. dokumentujemy wszystkie niedziałające elementy jako zależne od backendu,
5. nie udajemy, że to pełna produkcja.

## Warunki przejścia do pełniejszego sklepu

Żeby przejść z „front działa publicznie” do „sklep działa publicznie”, trzeba:

1. wybrać hosting dla backendu `sklepik`,
2. wystawić publiczny URL Spree API,
3. ustawić prawdziwe `SPREE_API_URL` w Vercel,
4. ustawić `SPREE_PUBLISHABLE_KEY`,
5. skonfigurować Stripe testowo,
6. sprawdzić flow: produkt → koszyk → checkout → zamówienie.

## Zasada

Vercel daje nam publiczny frontend.

Spree API daje nam prawdziwy sklep.

Pierwszy deploy Vercel jest dobrym krokiem, ale nie zamyka tematu backendu.
