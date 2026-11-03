# CV – źródło w HTML

Edytowalne źródło CV. PDF generujemy z HTML-a, więc tekst w PDF jest prawdziwy (do zaznaczenia, czytelny dla ATS).

## Struktura

```
cv/
  pl/index.html   ← treść CV po polsku (edytujesz tutaj)
  en/index.html   ← treść CV po angielsku
  styles.css      ← wygląd, wspólny dla wersji językowych; kolory i fonty z DESIGN.md strony
  fonts/          ← Onest i Bricolage Grotesque (woff2, licencja OFL)
  build.mjs       ← HTML → PDF (Playwright)
  dist/           ← podgląd PNG (ignorowany przez git)
```

Avatar brany jest z `public/images/avatar-kriss.png`.

## Pierwsze uruchomienie

```bash
yarn add -D playwright
npx playwright install chromium
```

## Generowanie PDF

PDF-y trafiają od razu do `public/utils/krzysztofgryc_<lang>.pdf`, czyli w miejsce plików, do których linkuje strona (`cvHref()` w `components/Home/copy.ts`). Po wygenerowaniu wystarczy commit i deploy.

```bash
yarn cv            # obie wersje: public/utils/krzysztofgryc_pl.pdf i _en.pdf
yarn cv pl         # tylko polska (albo: yarn cv en)
yarn cv:preview    # obie wersje + PNG każdej strony w cv/dist/
```

Podgląd na żywo: otwórz `cv/pl/index.html` w przeglądarce (Cmd+P pokazuje układ wydruku).

## Edycja

- Każda `<section class="page">` to jedna strona A4. Strony mają stałą wysokość.
- Jeśli treść się nie mieści, `build.mjs` wypisze ostrzeżenie „Strona N: treść wychodzi poza stronę” i zakończy się kodem 1. Skróć tekst albo przenieś blok (`<article class="job">`, grupę umiejętności) na kolejną stronę.
- Klauzula RODO jest tylko w stopce ostatniej strony (`.rodo`). Jeśli ogłoszenie podaje własną klauzulę, podmień tam tekst.
- Zmiana treści w jednym języku = ta sama zmiana w drugim (`pl/` i `en/` mają tę samą strukturę).
- Kolory i rozmiary: zmienne CSS na górze `styles.css`.

## Nowy język

Skopiuj `pl/` do `<lang>/`, przetłumacz treść i ustaw `lang` w `<html>`. `yarn cv` sam wykryje nowy folder. Żeby strona linkowała do nowego pliku, dopisz język w `cvHref()`.
