// Stałe dane i teksty interfejsu. Treść merytoryczna (doświadczenie, stack,
// opinie) przychodzi ze Strapi; tutaj tylko to, co należy do samego layoutu.

export const CONTACT = {
  email: 'hello@krzysztofg.pl',
  phone: '+48 535 383 727',
  phoneHref: 'tel:+48535383727',
  github: 'https://github.com/g-krzysztof',
  linkedin: 'https://linkedin.com/in/krzysztof-gryc',
};

export const cvHref = (lang) =>
  `/utils/krzysztofgryc${lang === 'pl' ? '_pl' : '_en'}.pdf`;

export const SECTIONS = [
  { id: 'opinie', pl: 'Rekomendacje', en: 'Recommendations' },
  { id: 'doswiadczenie', pl: 'Doświadczenie', en: 'Experience' },
  { id: 'o-mnie', pl: 'O mnie i stack', en: 'About & stack' },
  { id: 'kontakt', pl: 'Kontakt', en: 'Contact' },
];

const COPY = {
  pl: {
    skip: 'Przejdź do treści',
    menu: 'Menu',
    close: 'Zamknij',
    switchLang: 'Switch to English',
    helloA: 'Cześć,',
    helloB: 'tu Krzysiek.',
    lede: 'Senior React Developer z ponad dziesięcioletnim stażem w webie. Zaczynałem jako grafik, dlatego frontend robię okiem projektanta.',
    flipHint: 'Odwróć kartę, żeby zobaczyć stack',
    flipToBack: 'Pokaż stack',
    flipToFront: 'Wróć do kontaktu',
    role: 'Senior React Developer',
    downloadCv: 'Pobierz CV',
    cardBackTitle: 'Na co dzień',
    cardBackMore: 'Pracowałem też z',
    aboutTitle: 'O mnie',
    recPicker: 'Rekomendacje, przewijane w poziomie',
    recTitle: 'Rekomendacje',
    recCount: 'rekomendacji od przełożonych i współpracowników',
    prev: 'Poprzednia rekomendacja',
    next: 'Następna rekomendacja',
    stackLabel: 'Na co dzień pracuję w',
    readMore: 'Czytaj całość',
    readLess: 'Zwiń',
    contactLead: 'E-mail, telefon albo LinkedIn, jak Ci wygodniej.',
    footer: 'Zbudowane w Next.js i styled-components.',
    empty: 'Nie udało się wczytać tej sekcji. Odśwież stronę albo napisz bezpośrednio.',
  },
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    switchLang: 'Przełącz na polski',
    helloA: 'Hi,',
    helloB: 'I’m Krzysiek.',
    lede: 'Senior React Developer with over ten years in web. I started out as a graphic designer, so I build front ends with a designer’s eye.',
    flipHint: 'Flip the card to see the stack',
    flipToBack: 'Show stack',
    flipToFront: 'Back to contact',
    role: 'Senior React Developer',
    downloadCv: 'Download CV',
    cardBackTitle: 'Day to day',
    cardBackMore: 'Also worked with',
    aboutTitle: 'About me',
    recPicker: 'Recommendations, scroll horizontally',
    recTitle: 'Recommendations',
    recCount: 'recommendations from managers and colleagues',
    prev: 'Previous recommendation',
    next: 'Next recommendation',
    stackLabel: 'Day to day I work with',
    readMore: 'Read in full',
    readLess: 'Show less',
    contactLead: 'E-mail, phone or LinkedIn, whichever suits you.',
    footer: 'Built with Next.js and styled-components.',
    empty: 'This section failed to load. Refresh the page or write to me directly.',
  },
};

export const t = (lang) => COPY[lang] || COPY.pl;
