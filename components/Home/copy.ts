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
    flipToBack: 'Pokaż resztę stacku',
    flipMore: 'Pokaż cały stack',
    coreStack: 'Najważniejszy stack',
    flipToFront: 'Wróć do kontaktu',
    role: 'Senior React Frontend Developer',
    downloadCv: 'Pobierz CV',
    ogTagline:
      'React, TypeScript, Next.js. Playery wideo i audio, CMS, narzędzia redakcyjne.',
    avatarAlt:
      'Krzysztof Gryc, rysunkowy portret: łysy mężczyzna w okularach, z długą siwiejącą brodą, w czarnej koszulce',
    cardBackTitle: 'Mój stack',
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
    projectOutcomes: 'Co wniosłem do projektu',
    projectMore: 'Pokaż szczegóły',
    projectTabs: 'Projekty komercyjne',
    projectOwn: 'Projekt własny',
    projectShots: 'Zrzuty ekranu',
    mapDemo: 'Interaktywna ilustracja interfejsu mapy, nie zrzut ekranu',
    demoCaption: 'Ilustracja idei interfejsu, dane fikcyjne',
    mapLayers: 'Warstwy',
    mapLayerFields: 'Złoża',
    mapLayerBlocks: 'Bloki licencyjne',
    mapLayerWells: 'Odwierty',
    mapOpacity: (layer: string) => `${layer}: krycie`,
    mapBasemap: 'Podkład',
    mapBaseStandard: 'Standardowy',
    mapBaseBrand: 'Kolory marki',
    mapBaseNote: 'Każdy kolor terenu przeliczony RGB → HCL i z powrotem',
    mapWell: (name: string) => `Odwiert ${name}: przybliż`,
    mapBlock: (id: string) => `Blok licencyjny ${id}`,
    mapHint: 'Kliknij odwiert',
    mapReset: 'Pokaż całość',
    mapResult: 'Wynik 1 z 24',
    editorDemo:
      'Interaktywna ilustracja szablonu Scrollytelling w edytorze treści, nie zrzut ekranu',
    editorTemplate: 'Szablon',
    editorSaved: 'Zapisano',
    editorSaving: 'Zapisywanie…',
    editorColumns: 'Kolumny',
    editorColsShort: 'kol.',
    editorAdd: 'Dodaj',
    editorRemove: 'Usuń',
    editorView: 'Struktura',
    editorTree: 'Drzewo w edytorze',
    editorFlat: 'Zapis do API',
    editorType: 'typ',
    editorFlatNote:
      'Adapter spłaszcza drzewo przy zapisie i odtwarza je przy odczycie, więc API dalej dostaje płaską listę bloków.',
    editorNodes: {
      container: 'Kontener',
      section: 'Sekcja',
      image: 'Zdjęcie',
      text: 'Tekst',
      quote: 'Cytat',
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
      radio: {
        title: 'Player radiowy',
        text: 'Stacja na żywo z „teraz gramy”: okładka, tytuł i wykonawca. Stację zmienia się z listy pod logo.',
      },
      radioMobile: {
        title: 'Player radiowy na telefonie',
        text: 'Ten sam player w jednej kolumnie: logo i wybór stacji nad kartą z tym, co teraz gra.',
      },
    },
    // neutralne teksty w mockupie playera radiowego
    radioMock: {
      radio: 'Nazwa radia',
      station: 'Nazwa stacji',
      nowPlaying: 'TERAZ GRAMY',
      track: 'Tytuł piosenki',
      artist: 'Wykonawca',
    },
    readMore: 'Czytaj całość',
    readLess: 'Zwiń',
    recLinkedin: 'Na LinkedIn',
    recLinkedinLabel: 'Rekomendacja na LinkedIn (nowa karta)',
    contactLead: 'E-mail, telefon albo LinkedIn, jak Ci wygodniej.',
  },
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    switchLang: 'Przełącz na polski',
    metaDescription:
      'Krzysztof Gryc – Senior React Frontend Developer. React, TypeScript, Next.js, media products: video and audio players, CMS, editorial tools.',
    openTo:
      'Looking for a Senior React Developer role: remote, from February 2027',
    helloA: 'Hi,',
    helloB: 'I’m Krzysiek.',
    lede: 'Senior React Frontend Developer with over ten years in web. I started out as a graphic designer, so I build front ends with a designer’s eye.',
    flipToBack: 'Show the rest of the stack',
    flipMore: 'Show the rest of the stack',
    coreStack: 'Core stack',
    flipToFront: 'Back to contact',
    role: 'Senior React Frontend Developer',
    downloadCv: 'Download CV',
    ogTagline:
      'React, TypeScript, Next.js. Video and audio players, CMS, editorial tools.',
    avatarAlt:
      'Krzysztof Gryc, illustrated portrait: a bald man in glasses with a long greying beard, wearing a black T-shirt',
    cardBackTitle: 'My stack',
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
    projectOutcomes: 'What I brought to the project',
    projectMore: 'Show details',
    projectTabs: 'Commercial projects',
    projectOwn: 'Personal project',
    projectShots: 'Screenshots',
    mapDemo: 'Interactive illustration of the map interface, not a screenshot',
    demoCaption: 'Illustration of the interface idea, made-up data',
    mapLayers: 'Layers',
    mapLayerFields: 'Fields',
    mapLayerBlocks: 'Licence blocks',
    mapLayerWells: 'Wells',
    mapOpacity: (layer: string) => `${layer}: opacity`,
    mapBasemap: 'Basemap',
    mapBaseStandard: 'Standard',
    mapBaseBrand: 'Brand colours',
    mapBaseNote: 'Every terrain colour converted RGB → HCL and back',
    mapWell: (name: string) => `Well ${name}: zoom in`,
    mapBlock: (id: string) => `Licence block ${id}`,
    mapHint: 'Click a well',
    mapReset: 'Show all',
    mapResult: 'Result 1 of 24',
    editorDemo:
      'Interactive illustration of the Scrollytelling template in the content editor, not a screenshot',
    editorTemplate: 'Template',
    editorSaved: 'Saved',
    editorSaving: 'Saving…',
    editorColumns: 'Columns',
    editorColsShort: 'col.',
    editorAdd: 'Add',
    editorRemove: 'Remove',
    editorView: 'Structure',
    editorTree: 'Tree in the editor',
    editorFlat: 'Saved to the API',
    editorType: 'type',
    editorFlatNote:
      'An adapter flattens the tree on save and rebuilds it on read, so the API still gets a flat list of blocks.',
    editorNodes: {
      container: 'Container',
      section: 'Section',
      image: 'Image',
      text: 'Text',
      quote: 'Quote',
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
      radio: {
        title: 'Radio player',
        text: 'A live station with “now playing”: cover art, title and artist. You switch stations from the list under the logo.',
      },
      radioMobile: {
        title: 'Radio player on a phone',
        text: 'The same player in a single column: the logo and station picker above the “now playing” card.',
      },
    },
    radioMock: {
      radio: 'Radio name',
      station: 'Station name',
      nowPlaying: 'NOW PLAYING',
      track: 'Song title',
      artist: 'Artist',
    },
    readMore: 'Read in full',
    readLess: 'Show less',
    recLinkedin: 'On LinkedIn',
    recLinkedinLabel: 'Recommendation on LinkedIn (opens in a new tab)',
    contactLead: 'E-mail, phone or LinkedIn, whichever suits you.',
  },
};

export const t = (lang: Lang) => COPY[lang] || COPY.pl;

export type Copy = ReturnType<typeof t>;
