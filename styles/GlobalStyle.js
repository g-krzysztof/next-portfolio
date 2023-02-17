import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,600;1,400;1,600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Raleway', sans-serif;
  }

  body {
    background: white;
  }

  input {
    outline: none;
    box-sizing: border-box !important;
    font-family: 'Montserrat', sans-serif;
  }

  textarea {
    outline: none;
    box-sizing: border-box !important;
    font-family: 'Montserrat', sans-serif;
  }
`
