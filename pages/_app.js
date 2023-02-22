import { ThemeProvider } from 'styled-components';
import '../styles/globals.css';
import { Box, GlobalStyle, theme } from '../styles';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Box>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
