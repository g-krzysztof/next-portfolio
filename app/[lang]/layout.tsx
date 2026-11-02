import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter, Onest } from 'next/font/google';
import '../../styles/globals.css';
import { theme } from '../../styles/theme';
import { Providers } from '../../components/Providers';
import { ClarityAnalytics } from '../../components/ClarityAnalytics';
import { LOCALES, SITE_URL, isLang, t } from '../../components/Home/copy';

const displayFont = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Onest({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
});

// tylko licznik czasu w mockupie playera wideo (wzór używa Inter)
const interFont = Inter({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-inter',
  display: 'swap',
});

// polski pod /, angielski pod /en (rewrite / → /pl w next.config.ts);
// inne wartości segmentu kończą się 404, obie wersje są prerenderowane
export const dynamicParams = false;

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

const pathFor = (lang: string) => (lang === 'pl' ? '/' : `/${lang}`);

export const generateMetadata = async ({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> => {
  const { lang } = await params;
  const current = isLang(lang) ? lang : 'pl';
  const copy = t(current);
  const title = 'Krzysztof Gryc – Senior React Frontend Developer';

  // podgląd linku na LinkedIn, Slacku i Teams; obrazek daje opengraph-image.tsx
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: copy.metaDescription,
    openGraph: {
      type: 'profile',
      title,
      description: copy.metaDescription,
      url: pathFor(lang),
      siteName: 'Krzysztof Gryc',
      locale: current === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: current === 'pl' ? 'en_US' : 'pl_PL',
      firstName: 'Krzysztof',
      lastName: 'Gryc',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: copy.metaDescription,
    },
    alternates: {
      canonical: pathFor(lang),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, pathFor(l)])),
        'x-default': '/',
      },
    },
    icons: { icon: '/favicon.svg' },
  };
};

export const viewport: Viewport = {
  themeColor: theme.colors.field,
};

const RootLayout = async ({ children, params }: LayoutProps<'/[lang]'>) => {
  const { lang } = await params;
  const current = isLang(lang) ? lang : 'pl';

  return (
    <html
      lang={current}
      className={`${displayFont.variable} ${bodyFont.variable} ${interFont.variable}`}
    >
      <body>
        <Providers lang={current}>{children}</Providers>
        <ClarityAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
