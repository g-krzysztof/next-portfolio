import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    ${({ theme: { colors, fonts } }) => `
      background: ${colors.paper};
      color: ${colors.ink};
      font-family: ${fonts.body};
      caret-color: ${colors.tealInk};
      accent-color: ${colors.tealInk};
    `}
    font-size: 17px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    ${({ theme: { colors } }) => `
      background: ${colors.mint};
      color: ${colors.ink};
    `}
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tealInk};
    outline-offset: 3px;
    border-radius: 6px;
  }

  html {
    scrollbar-color: ${({ theme: { colors } }) => `${colors.teal} ${colors.paperDeep}`};
  }

  img {
    display: block;
    max-width: 100%;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    cursor: pointer;
  }

  ul {
    list-style: none;
  }
`;
