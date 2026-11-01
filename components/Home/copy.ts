// Stałe dane i teksty interfejsu. Treść merytoryczna (doświadczenie, stack,
// opinie) leży w content/{pl,en}.json; tutaj tylko to, co należy do samego layoutu.

export const LOCALES = ['pl', 'en'] as const;
export type Lang = (typeof LOCALES)[number];

export const SITE_URL = 'https://krzysztofg.pl';

export const CONTACT = {
  email: 'hello@krzysztofg.pl',
  phone: '+48 535 383 727',
  phoneHref: 'tel:+48535383727',
  github: 'https://github.com/g-krzysztof',
  linkedin: 'https://www.linkedin.com/in/krzysztof-gryc/',
};

export const cvHref = (lang: Lang) =>
  `/utils/krzysztofgryc${lang === 'pl' ? '_pl' : '_en'}.pdf`;

export const SECTIONS = [
  { id: 'opinie', pl: 'Rekomendacje', en: 'Recommendations' },
  { id: 'doswiadczenie', pl: 'Doświadczenie', en: 'Experience' },
  { id: 'projekty', pl: 'Projekty', en: 'Projects' },
  { id: 'o-mnie', pl: 'O mnie i stack', en: 'About & stack' },
  { id: 'kontakt', pl: 'Kontakt', en: 'Contact' },
];

const COPY = {
  pl: {
    skip: 'Przejdź do treści',
    menu: 'Menu',
    close: 'Zamknij',
    switchLang: 'Switch to English',
    metaDescription:
      'Krzysztof Gryc – Senior React Frontend Developer. React, TypeScript, Next.js, produkty medialne: playery wideo i audio, CMS, narzędzia redakcyjne.',
    helloA: 'Cześć,',
    helloB: 'tu Krzysiek.',
    lede: 'Senior React Frontend Developer z ponad dziesięcioletnim stażem w webie. Zaczynałem jako grafik, dlatego frontend robię okiem projektanta.',
    flipHint: 'Odwróć kartę, żeby zobaczyć stack',
    flipToBack: 'Pokaż stack',
    flipToFront: 'Wróć do kontaktu',
    role: 'Senior React Frontend Developer',
    downloadCv: 'Pobierz CV',
    cardBackTitle: 'Na co dzień',
    cardBackMore: 'Pracowałem też z',
    aboutTitle: 'O mnie',
    recPicker: 'Rekomendacje, przewijane w poziomie',
    recCount: 'rekomendacji od przełożonych i współpracowników',
    prev: 'Poprzednia rekomendacja',
    next: 'Następna rekomendacja',
    expStack: 'Stack:',
    projectRole: 'Moja rola',
    projectWork: 'Co zrobiłem',
    projectProblem: 'Problem',
    projectFacts: 'Projekt w liczbach',
    mapDemo: 'Interaktywna ilustracja interfejsu mapy, nie zrzut ekranu',
    mapCaption: 'Ilustracja idei interfejsu, dane fikcyjne',
    mapLayers: 'Warstwy',
    mapTheme: 'Motyw',
    mapLayerFields: 'Złoża',
    mapLayerBlocks: 'Bloki licencyjne',
    mapLayerWells: 'Odwierty',
    mapThemeLight: 'Jasny',
    mapThemeDark: 'Ciemny',
    mapThemeCvd: 'Daltonizm',
    mapResult: 'Wynik 1 z 24',
    readMore: 'Czytaj całość',
    readLess: 'Zwiń',
    contactLead: 'E-mail, telefon albo LinkedIn, jak Ci wygodniej.',
    footer: 'Powered by Next.js',
  },
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    switchLang: 'Przełącz na polski',
    metaDescription:
      'Senior React Frontend Developer based in Tychy, Poland. Over ten years in web, formerly a DTP designer.',
    helloA: 'Hi,',
    helloB: 'I’m Krzysiek.',
    lede: 'Senior React Frontend Developer with over ten years in web. I started out as a graphic designer, so I build front ends with a designer’s eye.',
    flipHint: 'Flip the card to see the stack',
    flipToBack: 'Show stack',
    flipToFront: 'Back to contact',
    role: 'Senior React Frontend Developer',
    downloadCv: 'Download CV',
    cardBackTitle: 'Day to day',
    cardBackMore: 'Also worked with',
    aboutTitle: 'About me',
    recPicker: 'Recommendations, scroll horizontally',
    recCount: 'recommendations from managers and colleagues',
    prev: 'Previous recommendation',
    next: 'Next recommendation',
    expStack: 'Stack:',
    projectRole: 'My role',
    projectWork: 'What I did',
    projectProblem: 'Problem',
    projectFacts: 'The project in numbers',
    mapDemo: 'Interactive illustration of the map interface, not a screenshot',
    mapCaption: 'Illustration of the interface idea, made-up data',
    mapLayers: 'Layers',
    mapTheme: 'Theme',
    mapLayerFields: 'Fields',
    mapLayerBlocks: 'Licence blocks',
    mapLayerWells: 'Wells',
    mapThemeLight: 'Light',
    mapThemeDark: 'Dark',
    mapThemeCvd: 'Colour-blind',
    mapResult: 'Result 1 of 24',
    readMore: 'Read in full',
    readLess: 'Show less',
    contactLead: 'E-mail, phone or LinkedIn, whichever suits you.',
    footer: 'Built with Next.js and styled-components.',
  },
};

export const t = (lang: Lang) => COPY[lang] || COPY.pl;

export type Copy = ReturnType<typeof t>;
