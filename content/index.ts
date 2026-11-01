import 'server-only';
import type { Content } from './types';
import type { Lang } from '../components/Home/copy';
import contentPl from './pl.json';
import contentEn from './en.json';

// treść jest w repo, więc strona buduje się statycznie bez zewnętrznych zapytań;
// moduł działa tylko na serwerze, więc obie wersje nie trafiają do bundla klienta
const CONTENT = { pl: contentPl, en: contentEn } satisfies Record<
  Lang,
  Content
>;

// klucze _todo to notatki redakcyjne w JSON-ie; nie trafiają do HTML-a strony
// ani do payloadu RSC, który dostają komponenty klienckie
const withoutTodos = (content: Content): Content =>
  JSON.parse(
    JSON.stringify(content, (key, value) =>
      key === '_todo' ? undefined : value,
    ),
  );

export const getContent = (lang: Lang): Content => withoutTodos(CONTENT[lang]);
