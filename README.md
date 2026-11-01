## This is a personal website created with [Next.js](https://nextjs.org/)

### simple stack used:

- next (App Router, React Server Components, static generation)
- styled components
- eslint
- prettier
- custom hooks

### structure

- `app/[lang]/` – root layout and page per language (`/` = Polish via rewrite, `/en` = English); both are prerendered with `generateStaticParams`
- `app/[lang]/page.tsx` – Server Component: reads content on the server (`content/index.ts`, `server-only`) and passes each section only the data it needs
- `components/Providers.tsx` – client boundary: styled-components SSR registry, theme, language context
- `content/{pl,en}.json` – site content, `cv/` – CV source (HTML → PDF)
