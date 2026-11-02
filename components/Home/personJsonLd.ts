import type { StackGroup } from '../../content/types';
import { CONTACT, SITE_URL, WORKPLACES, t, type Lang } from './copy';

// Dane strukturalne (schema.org) dla wyszukiwarek: strona profilowa z osobą.
// Teksty biorą się z copy.ts i content/*.json, więc obie wersje językowe
// zmieniają się razem z resztą strony
export const personJsonLd = (lang: Lang, stack: StackGroup[]) => {
  const copy = t(lang);
  const url = lang === 'pl' ? SITE_URL : `${SITE_URL}/${lang}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    inLanguage: lang,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Krzysztof Gryc',
      givenName: 'Krzysztof',
      familyName: 'Gryc',
      jobTitle: copy.role,
      description: copy.metaDescription,
      url,
      image: `${SITE_URL}/images/avatar-kriss.png`,
      email: `mailto:${CONTACT.email}`,
      worksFor: { '@type': 'Organization', name: WORKPLACES[0] },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tychy',
        addressCountry: 'PL',
      },
      knowsLanguage: ['pl', 'en'],
      // grupa „na co dzień” ze stacku
      knowsAbout: stack[0]?.lines.flat().map(({ name }) => name) ?? [],
      sameAs: [CONTACT.linkedin, CONTACT.github],
    },
  };
};

// JSON w <script> nie może zawierać „</script>”, stąd ucieczka znaku <
export const serializeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, '\\u003c');
