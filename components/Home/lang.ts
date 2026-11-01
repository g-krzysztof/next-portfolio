import { useRouter } from 'next/router';
import { LOCALES, t, type Lang } from './copy';

const isLang = (value?: string): value is Lang =>
  LOCALES.includes(value as Lang);

// Język wynika z adresu (/ albo /en), więc przeżywa odświeżenie,
// da się go podlinkować i zaindeksować
export const useLang = () => {
  const { locale } = useRouter();
  const lang: Lang = isLang(locale) ? locale : 'pl';
  return { lang, copy: t(lang) };
};
