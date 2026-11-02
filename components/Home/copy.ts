// Stałe dane i teksty interfejsu. Treść merytoryczna (doświadczenie, stack,
// opinie) leży w content/{pl,en}.json; tutaj tylko to, co należy do samego layoutu.

export const LOCALES = ['pl', 'en'] as const;
export type Lang = (typeof LOCALES)[number];

export const isLang = (value?: string): value is Lang =>
  LOCALES.includes(value as Lang);

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

// Linia „gdzie pracowałem” w hero: komercyjny React od KATO, firmy od najnowszej
export const REACT_SINCE = 2019;
export const WORKPLACES = [
  'Grupa ZPR Media',
  'Wirtualna Polska (Autentika)',
  'KATO Software House',
];

export const SECTIONS = [
  { id: 'doswiadczenie', pl: 'Doświadczenie', en: 'Experience' },
  { id: 'opinie', pl: 'Rekomendacje', en: 'Recommendations' },
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
    openTo: 'Szukam roli Senior React Developera: zdalnie, od lutego 2027',
    helloA: 'Cześć,',
    helloB: 'tu Krzysiek.',
    lede: 'Senior React Frontend Developer z ponad dziesięcioletnim stażem w webie. Zaczynałem jako grafik, dlatego frontend robię okiem projektanta.',
    flipHint: 'Odwróć kartę, żeby zobaczyć cały stack',
    flipToBack: 'Pokaż resztę stacku',
    flipMore: 'Pokaż resztę',
    coreStack: 'Najważniejszy stack',
    flipToFront: 'Wróć do kontaktu',
    role: 'Senior React Frontend Developer',
    downloadCv: 'Pobierz CV',
    ogTagline:
      'React, TypeScript, Next.js. Playery wideo i audio, CMS, narzędzia redakcyjne.',
    avatarAlt:
      'Krzysztof Gryc, rysunkowy portret: łysy mężczyzna w okularach, z długą siwiejącą brodą, w czarnej koszulce',
    cardBackTitle: 'Na co dzień',
    aboutTitle: 'O mnie',
    recPicker: 'Rekomendacje, przewijane w poziomie',
    recCount: 'rekomendacji od przełożonych i współpracowników',
    recMode: 'Sposób wyświetlania rekomendacji',
    recModeReel: 'Animacja',
    recModeText: 'Sam tekst',
    reactYears: 'komercyjnie w React',
    prev: 'Poprzednia rekomendacja',
    next: 'Następna rekomendacja',
    reelAbout: 'o Krzysztofie',
    reelPlay: 'Odtwórz rolkę z opinią',
    reelPause: 'Zatrzymaj rolkę z opinią',
    reelReplay: 'Odtwórz rolkę jeszcze raz',
    expStack: 'Stack:',
    expYears: (n: number) => {
      const last = n % 10;
      const teen = n % 100 >= 12 && n % 100 <= 14;
      if (n === 1) return '1 rok';
      return `${n} ${last >= 2 && last <= 4 && !teen ? 'lata' : 'lat'}`;
    },
    projectRole: 'Moja rola',
    projectWork: 'Co zrobiłem',
    projectProblem: 'Problem',
    projectProduct: 'Produkt',
    projectFacts: 'Projekt w liczbach',
    projectMore: 'Pokaż szczegóły',
    projectTabs: 'Zakres pracy w projekcie',
    mapDemo: 'Interaktywna ilustracja interfejsu mapy, nie zrzut ekranu',
    demoCaption: 'Ilustracja idei interfejsu, dane fikcyjne',
    mapLayers: 'Warstwy',
    mapTheme: 'Motyw',
    mapLayerFields: 'Złoża',
    mapLayerBlocks: 'Bloki licencyjne',
    mapLayerWells: 'Odwierty',
    mapThemeLight: 'Jasny',
    mapThemeDark: 'Ciemny',
    mapThemeCvd: 'Daltonizm',
    mapResult: 'Wynik 1 z 24',
    editorDemo: 'Interaktywna ilustracja edytora treści, nie zrzut ekranu',
    editorAdd: 'Dodaj element',
    editorView: 'Widok',
    editorEdit: 'Edycja',
    editorMobile: 'Podgląd mobilny',
    editorSaved: 'Zapisano lokalnie',
    editorSaving: 'Zapisywanie…',
    editorReadability: 'Czytelność',
    editorSuggestions: 'Sugestie AI',
    editorValidation: 'Walidacja',
    editorOk: 'Bez błędów',
    editorWarn: 'Zdjęcie bez podpisu',
    editorTags: ['gospodarka', 'energetyka', 'giełda'],
    editorParts: {
      image: 'Zdjęcie',
      gallery: 'Galeria',
      quote: 'Cytat',
      table: 'Tabela',
      stocks: 'Notowania',
      timeline: 'Oś czasu',
    },
    playersDemo:
      'Playery wideo i radiowe w działaniu: nagrania i zrzuty ze stron demo',
    playersTitle: 'Playery w działaniu',
    playersPrev: 'Poprzednie ujęcie',
    playersNext: 'Następne ujęcie',
    playersPause: 'Zatrzymaj przewijanie',
    playersPlay: 'Wznów przewijanie',
    playersSlide: (n: number, total: number) => `${n} z ${total}`,
    playersShots: {
      portrait: {
        title: 'Pionowe wideo',
        text: 'Format 9:16 pod telefon, z udostępnianiem i pełnym ekranem.',
      },
      player: {
        title: 'Player Video',
        text: 'Ekran startowy z dużym przyciskiem odtwarzania, udostępnianiem i pełnym ekranem. Głośność rozwija się po najechaniu na ikonę dźwięku.',
      },
    },
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
      'Krzysztof Gryc – Senior React Frontend Developer. React, TypeScript, Next.js, media products: video and audio players, CMS, editorial tools.',
    openTo: 'Looking for a Senior React Developer role: remote, from February 2027',
    helloA: 'Hi,',
    helloB: 'I’m Krzysiek.',
    lede: 'Senior React Frontend Developer with over ten years in web. I started out as a graphic designer, so I build front ends with a designer’s eye.',
    flipHint: 'Flip the card to see the full stack',
    flipToBack: 'Show the rest of the stack',
    flipMore: 'Show the rest',
    coreStack: 'Core stack',
    flipToFront: 'Back to contact',
    role: 'Senior React Frontend Developer',
    downloadCv: 'Download CV',
    ogTagline:
      'React, TypeScript, Next.js. Video and audio players, CMS, editorial tools.',
    avatarAlt:
      'Krzysztof Gryc, illustrated portrait: a bald man in glasses with a long greying beard, wearing a black T-shirt',
    cardBackTitle: 'Day to day',
    aboutTitle: 'About me',
    recPicker: 'Recommendations, scroll horizontally',
    recCount: 'recommendations from managers and colleagues',
    recMode: 'How to show the recommendations',
    recModeReel: 'Animated',
    recModeText: 'Text only',
    reactYears: 'of commercial React',
    prev: 'Previous recommendation',
    next: 'Next recommendation',
    reelAbout: 'on Krzysztof',
    reelPlay: 'Play the recommendation reel',
    reelPause: 'Pause the recommendation reel',
    reelReplay: 'Replay the recommendation reel',
    expStack: 'Stack:',
    expYears: (n: number) => `${n} ${n === 1 ? 'year' : 'years'}`,
    projectRole: 'My role',
    projectWork: 'What I did',
    projectProblem: 'Problem',
    projectProduct: 'The product',
    projectFacts: 'The project in numbers',
    projectMore: 'Show details',
    projectTabs: 'Scope of work on the project',
    mapDemo: 'Interactive illustration of the map interface, not a screenshot',
    demoCaption: 'Illustration of the interface idea, made-up data',
    mapLayers: 'Layers',
    mapTheme: 'Theme',
    mapLayerFields: 'Fields',
    mapLayerBlocks: 'Licence blocks',
    mapLayerWells: 'Wells',
    mapThemeLight: 'Light',
    mapThemeDark: 'Dark',
    mapThemeCvd: 'Colour-blind',
    mapResult: 'Result 1 of 24',
    editorDemo:
      'Interactive illustration of the content editor, not a screenshot',
    editorAdd: 'Add a part',
    editorView: 'View',
    editorEdit: 'Edit',
    editorMobile: 'Mobile preview',
    editorSaved: 'Saved locally',
    editorSaving: 'Saving…',
    editorReadability: 'Readability',
    editorSuggestions: 'AI suggestions',
    editorValidation: 'Validation',
    editorOk: 'No issues',
    editorWarn: 'Image without a caption',
    editorTags: ['economy', 'energy', 'stock market'],
    editorParts: {
      image: 'Image',
      gallery: 'Gallery',
      quote: 'Quote',
      table: 'Table',
      stocks: 'Market quotes',
      timeline: 'Timeline',
    },
    playersDemo:
      'Video and radio players in action: recordings and screenshots from the demo pages',
    playersTitle: 'The players in action',
    playersPrev: 'Previous shot',
    playersNext: 'Next shot',
    playersPause: 'Pause',
    playersPlay: 'Resume',
    playersSlide: (n: number, total: number) => `${n} of ${total}`,
    playersShots: {
      portrait: {
        title: 'Vertical video',
        text: 'A 9:16 format made for phones, with sharing and full screen.',
      },
      player: {
        title: 'Video Player',
        text: 'The start screen with a big play button, sharing and full screen. Volume slides out when you hover over the sound icon.',
      },
    },
    readMore: 'Read in full',
    readLess: 'Show less',
    contactLead: 'E-mail, phone or LinkedIn, whichever suits you.',
    footer: 'Powered by Next.js',
  },
};

export const t = (lang: Lang) => COPY[lang] || COPY.pl;

export type Copy = ReturnType<typeof t>;
