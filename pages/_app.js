import { ThemeProvider } from 'styled-components';
import '../styles/globals.css';
import { Box, GlobalStyle, theme } from '../styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import React, { useState } from 'react';

const queryClient = new QueryClient();
export const LangContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const [lang, setLang] = useState('en');
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LangContext.Provider value={[lang, setLang]}>
          <GlobalStyle />
          <Box>
            <Component {...pageProps} />
          </Box>
        </LangContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
