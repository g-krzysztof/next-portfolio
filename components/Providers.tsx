'use client';

import { useState, type ReactNode } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import isPropValid from '@emotion/is-prop-valid';
import {
  ServerStyleSheet,
  StyleSheetManager,
  ThemeProvider,
  type ShouldForwardProp,
} from 'styled-components';
import { GlobalStyle, theme } from '../styles';
import { LangProvider } from './Home/lang';
import type { Lang } from './Home/copy';

// styled-components v6 forwards all props to the DOM by default;
// keep v5 behaviour so unknown props don't end up as HTML attributes
const shouldForwardProp: ShouldForwardProp<'web'> = (propName, target) =>
  typeof target === 'string' ? isPropValid(propName) : true;

// Podczas renderu na serwerze zbiera style z komponentów i wstrzykuje je
// do HTML-a, więc strona nie mruga bez CSS przed hydracją
const StyledComponentsRegistry = ({ children }: { children: ReactNode }) => {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
  );
};

// Granica klienta: wszystko, co potrzebuje kontekstu (styled-components,
// motyw, język), siedzi pod tym komponentem
export const Providers = ({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) => (
  <StyledComponentsRegistry>
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ThemeProvider theme={theme}>
        <LangProvider lang={lang}>
          <GlobalStyle />
          {children}
        </LangProvider>
      </ThemeProvider>
    </StyleSheetManager>
  </StyledComponentsRegistry>
);
