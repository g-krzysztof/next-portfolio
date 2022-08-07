import '../styles/globals.css'
import { ThemeProvider } from 'styled-components'
import { Box, GlobalStyle, theme } from '../styles'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Box>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </>
  )
}

export default MyApp
