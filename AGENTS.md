# sklepikFront — instrukcja dla agentów kodowania

To repozytorium to **wspólny, wersjonowany storefront platformy Sklepik**: Next.js 16 + React 19, renderer opublikowanego layoutu, doświadczenie klienta, branding, UX, SEO i deploy na Vercel. Sklep kakao jest pierwszym tenantem referencyjnym. Storefront rozmawia ze Store API backendu przez `@spree/sdk`.

Backend, admin i API żyją w osobnym repo **`pawelekbyra/sklepik`** — tam też jest **kanon całego systemu**. Nie duplikujemy go tutaj:

- `sklepik/docs/kierunek-projektu.md` — cel projektu, podział repo, **hierarchia decyzji**.
- `sklepik/docs/architektura.md` — mapa systemu i hostingu.
- `sklepik/docs/stan-projektu.md` — bieżący stan i znane problemy.
- `sklepik/docs/roadmap.md` — backlog i priorytety.

**Konwencje techniczne tego repo i protokół dokumentacji: [`CLAUDE.md`](CLAUDE.md).** Tematy frontowe: [`docs/README.md`](docs/README.md).

Żelazne minimum:

- Frontend nie zawiera logiki commerce — produkty, ceny, koszyk, zamówienia to zawsze Store API. Jeśli brakuje pola/endpointu, opisz wymaganie względem repo `sklepik`, nie hardcoduj.
- Nie zmieniaj checkoutu/koszyka przy okazji zmian wizualnych; eksperymenty (quizy, VOD, AI) izoluj od krytycznej ścieżki zakupowej.
- Nie commituj sekretów. Zmienne środowiskowe: [`docs/deployment-vercel.md`](docs/deployment-vercel.md).
- Świadome skróty zapisuj w [`docs/technical-debt.md`](docs/technical-debt.md).
- **Po każdym zadaniu zaktualizuj dotknięte dokumenty** (tu i — jeśli zmiana dotyczy całego systemu — `sklepik/docs/stan-projektu.md`), tak żeby dokumentacja odzwierciedlała rzeczywisty stan.
