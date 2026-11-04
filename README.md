# krzysztofg.pl

Personal portfolio of **Krzysztof Gryc, Senior React Frontend Developer**.

- **Live:** [krzysztofg.pl](https://krzysztofg.pl) (Polish) · [krzysztofg.pl/en](https://krzysztofg.pl/en) (English)
- **CV (PDF):** [PL](public/utils/krzysztofgryc_pl.pdf) · [EN](public/utils/krzysztofgryc_en.pdf)

The site is meant to be a work sample in itself: a small codebase, but built with the same care I bring to production front ends.

## Tech stack

- **Next.js 16** (App Router, React Server Components, fully static generation)
- **React 19**, **TypeScript**
- **styled-components** with SSR registry and a typed theme
- **markdown-to-jsx** for content with custom inline tags
- **Playwright** to render the CV from HTML to PDF
- ESLint, Prettier

## Highlights

- **Static, bilingual site.** Polish lives at `/`, English at `/en`. Both are prerendered with `generateStaticParams`; no `Accept-Language` redirects, so crawlers and shared links always get the version in the URL. `hreflang` alternates and canonical URLs are set per language.
- **Server Components by default.** `app/[lang]/page.tsx` reads content on the server (`server-only`) and passes each section only the data it needs. Client code is limited to interactive parts.
- **Content separated from code.** All copy lives in `content/pl.json` and `content/en.json` with the same keys, typed in `content/types.ts`.
- **Interactive project illustrations** instead of screenshots of private client work, all built from scratch with fake data:
  - `EditorDemo`: a tree-structured scrollytelling template inside an editor built for a flat list of blocks, with a view of how the adapter flattens the tree on save
  - `MapDemo`: a map whose terrain is recoloured into a brand palette via the HCL colour space (sRGB ↔ CIELab ↔ LCh written by hand), with a layer panel, opacity slider and animated zoom
  - `VideoPlayerMock`, `RadioPlayerMock`: player UIs recreated from designs, scaled proportionally with a CSS custom property
- **SEO and link previews.** Per-language Open Graph images generated at build time (`opengraph-image.tsx`), `Person` JSON-LD, Twitter cards, old URLs (`/resume`, `/contact`, …) permanently redirected to sections.
- **Accessibility.** Semantic sections, `prefers-reduced-motion` respected, decorative mockups hidden from assistive tech.
- **CV as code.** The CV is HTML + CSS (`cv/`) sharing the site's design tokens and fonts, rendered to PDF with Playwright. The text in the PDF is real, so it's selectable and ATS-friendly. The build fails if content overflows an A4 page. Details: [cv/README.md](cv/README.md).

## Project structure

```
app/[lang]/              layout, page and OG image per language
components/Home/         page sections, demos, UI copy (copy.ts)
components/Providers.tsx client boundary: styled-components registry, theme, language context
content/                 site content (pl.json, en.json) and its types
cv/                      CV source (HTML/CSS) and PDF build script
hooks/, styles/          shared hooks, theme, breakpoints, global styles
public/                  images and generated CV PDFs
```

## Running locally

Requires Node.js 26 (see `.nvmrc`) and Yarn.

```bash
yarn install
yarn dev          # http://localhost:3060
```

| Script            | What it does                                           |
| ----------------- | ------------------------------------------------------ |
| `yarn build`      | production build (static)                              |
| `yarn start`      | serve the production build                             |
| `yarn lint`       | ESLint with autofix                                    |
| `yarn prettier`   | format the codebase                                    |
| `yarn cv`         | generate both CV PDFs into `public/utils/`             |
| `yarn cv:preview` | CV PDFs plus a PNG preview of every page in `cv/dist/` |

## Contact

The best way to reach me is through the contact section on [krzysztofg.pl](https://krzysztofg.pl/en#kontakt) or [LinkedIn](https://www.linkedin.com/in/krzysztof-gryc/).
