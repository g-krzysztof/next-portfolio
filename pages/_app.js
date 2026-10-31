import Head from 'next/head';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import '../styles/globals.css';
import { Box, GlobalStyle, theme } from '../styles';
import { ClarityAnalytics } from '../components/ClarityAnalytics';
import React, { useState } from 'react';

export const LangContext = React.createContext();

// styled-components v6 forwards all props to the DOM by default;
// keep v5 behaviour so styled-system props don't end up as HTML attributes
const shouldForwardProp = (propName, target) =>
  typeof target === 'string' ? isPropValid(propName) : true;

function MyApp({ Component, pageProps }) {
  const [lang, setLang] = useState('pl');
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ThemeProvider theme={theme}>
        <LangContext.Provider value={[lang, setLang]}>
          <Head>
            <title>React Developer - krzysztofg.pl</title>
          </Head>
          <GlobalStyle />
          <ClarityAnalytics />
          <Box>
            <Component {...pageProps} />
          </Box>
        </LangContext.Provider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export default MyApp;
