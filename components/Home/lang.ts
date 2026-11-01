import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { t, type Lang } from './copy';

export const LangContext = createContext<
  [Lang, Dispatch<SetStateAction<Lang>>]
>(['pl', () => {}]);

// Język i teksty interfejsu w jednym wywołaniu
export const useLang = () => {
  const [lang, setLang] = useContext(LangContext);
  return { lang, setLang, copy: t(lang) };
};
