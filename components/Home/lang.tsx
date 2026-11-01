'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { t, type Lang } from './copy';

// Język wynika z adresu (/ albo /en): ustala go segment [lang] w app/,
// a komponenty klienckie czytają go z kontekstu
const LangContext = createContext<Lang>('pl');

export const LangProvider = ({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) => <LangContext value={lang}>{children}</LangContext>;

export const useLang = () => {
  const lang = useContext(LangContext);
  return { lang, copy: t(lang) };
};
