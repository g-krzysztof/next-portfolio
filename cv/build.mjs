// HTML → PDF dla CV. PDF trafia od razu tam, skąd serwuje go strona:
// public/utils/krzysztofgryc_<lang>.pdf (link: cvHref() w components/Home/copy.ts).
//
// Użycie (z katalogu głównego repo):
//   node cv/build.mjs              → wszystkie wersje językowe (każdy folder cv/<lang>/ z index.html)
//   node cv/build.mjs pl           → tylko polska
//   node cv/build.mjs en           → tylko angielska
//   node cv/build.mjs --preview    → dodatkowo PNG każdej strony w cv/dist/ (szybki podgląd)

import { chromium } from 'playwright';
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const cvDir = dirname(fileURLToPath(import.meta.url));
const repoDir = join(cvDir, '..');
const outDir = join(repoDir, 'public', 'utils');
const previewDir = join(cvDir, 'dist');

const args = process.argv.slice(2);
const preview = args.includes('--preview');
let langs = args.filter((a) => !a.startsWith('--'));

if (langs.length === 0) {
  const entries = await readdir(cvDir, { withFileTypes: true });
  langs = entries
    .filter((e) => e.isDirectory() && existsSync(join(cvDir, e.name, 'index.html')))
    .map((e) => e.name)
    .sort();
}

await mkdir(outDir, { recursive: true });
if (preview) await mkdir(previewDir, { recursive: true });

const browser = await chromium.launch();
let failed = false;

for (const lang of langs) {
  const source = join(cvDir, lang, 'index.html');
  if (!existsSync(source)) {
    console.error(`✗ Brak pliku ${relative(repoDir, source)}`);
    failed = true;
    continue;
  }

  const page = await browser.newPage();
  await page.goto(pathToFileURL(source).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Kontrola: czy treść mieści się na każdej stronie A4 i czy wczytały się obrazki.
  const overflows = await page.$$eval('.page__main', (mains) =>
    mains
      .map((el, i) => ({ nr: i + 1, over: Math.ceil(el.scrollHeight - el.clientHeight) }))
      .filter((p) => p.over > 0),
  );
  const brokenImages = await page.$$eval('img', (imgs) =>
    imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute('src')),
  );

  if (preview) {
    await page.emulateMedia({ media: 'print' });
    const pages = await page.$$('.page');
    for (const [i, el] of pages.entries()) {
      await el.screenshot({ path: join(previewDir, `${lang}-strona-${i + 1}.png`) });
    }
  }

  const output = join(outDir, `krzysztofgryc_${lang}.pdf`);
  await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true });
  await page.close();
  console.log(`✓ [${lang}] ${relative(repoDir, output)}`);

  for (const { nr, over } of overflows) {
    console.warn(`⚠ [${lang}] Strona ${nr}: treść wychodzi poza stronę o ok. ${over}px. Skróć tekst albo przenieś blok na kolejną stronę.`);
    failed = true;
  }
  for (const src of brokenImages) {
    console.warn(`⚠ [${lang}] Nie wczytano obrazka: ${src}`);
    failed = true;
  }
}

await browser.close();
if (preview) console.log(`Podgląd PNG: ${relative(repoDir, previewDir)}/`);
if (failed) process.exitCode = 1;
