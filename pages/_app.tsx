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
import { useEffect, useState } from 'react';
import type { Lang } from '../components/Home/copy';
import { LangContext } from '../components/Home/lang';

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
  const [lang, setLang] = useState<Lang>('pl');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ThemeProvider theme={theme}>
        <LangContext.Provider value={[lang, setLang]}>
          <Head>
            <title>Krzysztof Gryc · Senior React Developer</title>
            <meta
              name="description"
              content={
                lang === 'pl'
                  ? 'Senior React Developer z Tychów. Ponad dziesięć lat w webie, wcześniej grafik DTP.'
                  : 'Senior React Developer based in Tychy, Poland. Over ten years in web, formerly a DTP designer.'
              }
            />
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
        </LangContext.Provider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export default MyApp;
