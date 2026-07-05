# Deployment i zmienne środowiskowe: sklepikFront

## Cel dokumentu

Ten dokument opisuje zmienne środowiskowe potrzebne do uruchomienia `sklepikFront` jako storefrontu Kakao Sklepik.

`sklepikFront` jest frontendem Next.js. Łączy się z backendem Spree przez Spree API, które będzie dostarczane przez repo `sklepik`.

## Najważniejszy podział

```text
sklepik
→ backend/admin/API Spree

sklepikFront
→ Next.js storefront / Vercel / UX klienta
```

Frontend nie ma własnej logiki produktów, zamówień ani płatności. Pyta o nie backend przez Spree API.

## Obowiązkowe zmienne na start

W repo istnieje `.env.local.example` z minimalnymi zmiennymi:

```env
SPREE_API_URL=http://localhost:3000
SPREE_PUBLISHABLE_KEY=your_publishable_api_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### `SPREE_API_URL`

Adres backendu Spree.

Lokalnie albo testowo może wyglądać tak:

```env
SPREE_API_URL=http://localhost:3000
```

Na produkcji musi wskazywać publiczny adres backendu, np.:

```env
SPREE_API_URL=https://api.twojadomena.pl
```

albo adres z Render/Fly/Railway/VPS.

### `SPREE_PUBLISHABLE_KEY`

Publiczny klucz API Spree używany przez storefront po stronie serwera Next.js.

To nie jest klucz Stripe.

Ten klucz trzeba uzyskać/skonfigurować w backendzie Spree.

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Publiczny klucz Stripe do płatności po stronie klienta.

Na start powinien być testowy:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Dopiero przy produkcji używa się klucza live:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Zmienne opcjonalne, które prawdopodobnie dodamy później

Na podstawie upstreamowego Spree Storefront mogą pojawić się też:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEFAULT_COUNTRY=
NEXT_PUBLIC_DEFAULT_LOCALE=
GTM_ID=
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
SPREE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
SENTRY_SEND_DEFAULT_PII=false
NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII=false
```

Nie wszystkie są potrzebne na MVP.

## Minimalny zestaw pod Vercel MVP

Na pierwszy deploy Vercel potrzebujemy najpewniej:

```env
SPREE_API_URL=
SPREE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEFAULT_COUNTRY=pl
NEXT_PUBLIC_DEFAULT_LOCALE=pl
```

Uwaga: `SPREE_API_URL` musi wskazywać backend dostępny publicznie z internetu. Vercel nie połączy się z backendem działającym tylko lokalnie.

## Koszty

Samo Spree API nie kosztuje. Jest częścią open-source'owego Spree.

Koszty pojawiają się przy infrastrukturze i usługach:

- hosting backendu Spree,
- baza danych Postgres,
- Redis, jeśli będzie używany,
- hosting frontendowy Vercel, jeśli przekroczymy darmowe limity,
- domena,
- Stripe/PayPal/Adyen — prowizje transakcyjne,
- Resend lub inny provider maili,
- Sentry/monitoring, jeśli przekroczymy darmowe limity.

## Zasada bezpieczeństwa

Nie commitujemy prawdziwych sekretów do repo.

Do repo można commitować tylko przykłady typu:

```env
SPREE_API_URL=https://example.com
SPREE_PUBLISHABLE_KEY=example_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_example
```

Prawdziwe wartości ustawiamy w:

- Vercel Project Settings → Environment Variables,
- panelu hostingu backendu,
- lokalnym `.env.local`, jeśli ktoś pracuje lokalnie.

## Następny krok techniczny

1. Ustalić, gdzie będzie hostowany backend `sklepik`.
2. Uzyskać publiczny URL backendu.
3. Wygenerować albo odczytać `SPREE_PUBLISHABLE_KEY` w Spree.
4. Ustawić zmienne w Vercel dla `sklepikFront`.
5. Uruchomić testowy deploy frontu.
