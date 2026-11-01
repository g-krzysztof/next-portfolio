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
    factsDemo:
      'Wideo i audio w internecie w sześciu liczbach, przewijane jak relacja',
    factsTitle: 'Wideo i audio w sieci: o co toczy się gra',
    factsPrev: 'Poprzednia liczba',
    factsNext: 'Następna liczba',
    factsPause: 'Zatrzymaj przewijanie',
    factsPlay: 'Wznów przewijanie',
    factsSlide: (n: number, total: number) => `${n} z ${total}`,
    factsInPractice: 'W praktyce',
    factsSource: 'Źródło',
    factsItems: [
      {
        kind: 'share',
        value: '75%',
        label:
          'danych w sieciach komórkowych na świecie to wideo. Tak było na koniec 2025 roku.',
        takeaway:
          'Wideo to dziś główny sposób korzystania z internetu, a player jest jednym z najważniejszych elementów serwisu, nie dodatkiem do artykułu.',
        source: 'Ericsson Mobility Report, 2026',
      },
      {
        kind: 'reels',
        value: '70–80%',
        label:
          'wideo oglądanego na smartfonach pochodzi z mediów społecznościowych, głównie krótkie formy.',
        takeaway:
          'Widzowie przyzwyczaili się do pionowych rolek, więc serwis informacyjny też musi je mieć. Dlatego player ma tryb pionowych rolek z feedem.',
        source: 'Ericsson Mobility Report, listopad 2025',
      },
      {
        kind: 'adblock',
        value: '34%',
        label: 'internautów w Polsce blokuje reklamy.',
        takeaway:
          'To reklamy finansują darmowe treści. Gdy blokada wytnie ich skrypty, widz i tak musi zobaczyć wideo, a nie czarny prostokąt.',
        source: 'eyeo, 2026 Ad-Blocking Report (dane za 2025)',
      },
      {
        kind: 'radio',
        value: '2,5 mln',
        label: 'Polaków słucha radia przez internet.',
        extra: {
          value: 'blisko 400 tys.',
          label: 'więcej słuchaczy w sieci niż w 2022 roku',
        },
        takeaway:
          'Radio przenosi się do przeglądarki. Player radiowy gra stacje na żywo i na bieżąco pokazuje, co leci.',
        source: 'Komitet Badań Radiowych, raport Radio 2025',
      },
      {
        kind: 'law',
        value: '28.06.2025',
        label:
          'Od tego dnia w całej Unii obowiązuje Europejski Akt o Dostępności. Obejmuje między innymi dostęp do usług audiowizualnych.',
        takeaway:
          'Dostępność to już obowiązek prawny, a nie dodatek. Odsłuch artykułów oparty na text-to-speech, który wdrażałem, otwiera treść dla osób, które nie mogą czytać z ekranu.',
        source:
          'Dyrektywa (UE) 2019/882; w Polsce ustawa z 26 kwietnia 2024 r.',
      },
      {
        kind: 'scale',
        value: '9,9 mln',
        label:
          'internautów miesięcznie odwiedza serwisy Grupy ZPR Media, w których działają te playery. To 183 mln odsłon.',
        extra: {
          value: '11,3 mln',
          label: 'Polaków co tydzień słucha stacji radiowych grupy',
        },
        takeaway:
          'Przy takiej skali błąd widzi naraz bardzo wielu ludzi, dlatego awarie symulujemy i testujemy, zanim zdarzą się na produkcji.',
        source:
          'Mediapanel, Gemius/PBI, styczeń 2026; Radio Track, Kantar, XI 2025 – I 2026',
      },
    ],
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
    factsDemo: 'Online video and audio in six numbers, playing like a story',
    factsTitle: 'Online video and audio: what’s at stake',
    factsPrev: 'Previous number',
    factsNext: 'Next number',
    factsPause: 'Pause',
    factsPlay: 'Resume',
    factsSlide: (n: number, total: number) => `${n} of ${total}`,
    factsInPractice: 'In practice',
    factsSource: 'Source',
    factsItems: [
      {
        kind: 'share',
        value: '75%',
        label:
          'of all mobile network data worldwide is video. That was the share at the end of 2025.',
        takeaway:
          'Video is now the main way people use the internet, and the player is one of the most important parts of a news site, not an add-on to the article.',
        source: 'Ericsson Mobility Report, 2026',
      },
      {
        kind: 'reels',
        value: '70–80%',
        label:
          'of video watched on smartphones comes from social media, mostly short-form.',
        takeaway:
          'Viewers are used to vertical reels, so a news site needs them too. That is why the player has a vertical reels mode with a feed.',
        source: 'Ericsson Mobility Report, November 2025',
      },
      {
        kind: 'adblock',
        value: '34%',
        label: 'of internet users in Poland block ads.',
        takeaway:
          'Ads pay for free content. When a blocker cuts out their scripts, the viewer still has to see the video, not a black rectangle.',
        source: 'eyeo, 2026 Ad-Blocking Report (2025 data)',
      },
      {
        kind: 'radio',
        value: '2.5 million',
        label: 'Poles listen to the radio online.',
        extra: {
          value: 'nearly 400k',
          label: 'more online listeners than in 2022',
        },
        takeaway:
          'Radio is moving into the browser. The radio player streams stations live and shows what is playing as it happens.',
        source:
          'Komitet Badań Radiowych (Polish Radio Research Committee), Radio 2025 report',
      },
      {
        kind: 'law',
        value: '28.06.2025',
        label:
          'From this day the European Accessibility Act applies across the EU. Among other things, it covers access to audiovisual media services.',
        takeaway:
          'Accessibility is now a legal duty, not an extra. Article audio based on text-to-speech, which I rolled out, opens content to people who cannot read from a screen.',
        source: 'Directive (EU) 2019/882; in Poland, the act of 26 April 2024',
      },
      {
        kind: 'scale',
        value: '9.9 million',
        label:
          'internet users a month visit the Grupa ZPR Media websites where these players run. That is 183 million page views.',
        extra: {
          value: '11.3 million',
          label: 'Poles listen to the group’s radio stations every week',
        },
        takeaway:
          'At this scale, a bug is seen by a lot of people at once, so we simulate and test failures before they happen in production.',
        source:
          'Mediapanel, Gemius/PBI, January 2026; Radio Track, Kantar, Nov 2025 – Jan 2026',
      },
    ],
    readMore: 'Read in full',
    readLess: 'Show less',
    contactLead: 'E-mail, phone or LinkedIn, whichever suits you.',
    footer: 'Powered by Next.js',
  },
};

export const t = (lang: Lang) => COPY[lang] || COPY.pl;

export type Copy = ReturnType<typeof t>;
