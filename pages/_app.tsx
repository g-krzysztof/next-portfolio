import Head from 'next/head';
import type { AppProps } from 'next/app';
import isPropValid from '@emotion/is-prop-valid';
import { Bricolage_Grotesque, Onest } from 'next/font/google';
import {
  StyleSheetManager,
  ThemeProvider,
  type ShouldForwardProp,
} from 'styled-components';
import '../styles/globals.css';
import { GlobalStyle, theme } from '../styles';
import { ClarityAnalytics } from '../components/ClarityAnalytics';
import { useRouter } from 'next/router';
import { LOCALES, SITE_URL } from '../components/Home/copy';
import { useLang } from '../components/Home/lang';

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

// styled-components v6 forwards all props to the DOM by default;
// keep v5 behaviour so unknown props don't end up as HTML attributes
const shouldForwardProp: ShouldForwardProp<'web'> = (propName, target) =>
  typeof target === 'string' ? isPropValid(propName) : true;

function MyApp({ Component, pageProps }: AppProps) {
  const { lang, copy } = useLang();
  const { asPath, defaultLocale } = useRouter();
  // adres bez hasha i query, z prefiksem języka (polski bez prefiksu)
  const path = asPath.split(/[?#]/)[0];
  const urlFor = (locale: string) =>
    SITE_URL +
    (locale === defaultLocale ? '' : `/${locale}`) +
    (path === '/' ? '' : path);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Krzysztof Gryc – Senior React Frontend Developer</title>
          <meta name="description" content={copy.metaDescription} />
          <link rel="canonical" href={urlFor(lang)} />
          {LOCALES.map((locale) => (
            <link
              key={locale}
              rel="alternate"
              hrefLang={locale}
              href={urlFor(locale)}
            />
          ))}
          <link rel="alternate" hrefLang="x-default" href={urlFor('pl')} />
          <meta name="theme-color" content={theme.colors.field} />
        </Head>
        <style jsx global>{`
          :root {
            --font-display: ${displayFont.style.fontFamily};
            --font-body: ${bodyFont.style.fontFamily};
          }
        `}</style>
        <GlobalStyle />
        <ClarityAnalytics />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export default MyApp;
