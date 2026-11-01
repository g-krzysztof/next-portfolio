# Zasady projektu

## Dwa języki: PL i EN

Strona i CV istnieją w dwóch wersjach językowych, które mają być zawsze zsynchronizowane. Każda zmiana treści lub interfejsu musi trafić do obu języków w tym samym zadaniu:

- `content/pl.json` i `content/en.json` – ta sama struktura i te same klucze (także pola `_todo`), różni się tylko tekst
- `components/Home/copy.ts` – teksty interfejsu w `COPY.pl` i `COPY.en`, `SECTIONS`
- `cv/pl/index.html` i `cv/en/index.html` – patrz `cv/README.md`

Wersja polska jest źródłowa: najpierw zmiana po polsku, potem tłumaczenie na angielski. Jeśli tłumaczenie budzi wątpliwości (nazwy własne, liczby, terminy branżowe), zrób najlepszą wersję i zgłoś to w podsumowaniu, zamiast zostawiać jeden język nieaktualny.
