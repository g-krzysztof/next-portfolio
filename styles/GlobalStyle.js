import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: white;
  }

  input {
    outline: none;
    box-sizing: border-box !important;
  }

  textarea {
    outline: none;
    box-sizing: border-box !important;
  }
`;
