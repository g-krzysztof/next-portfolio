import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // polski pod /, angielski pod /en; bez przekierowań wg Accept-Language,
  // żeby roboty i linki zawsze trafiały w wersję z adresu
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    localeDetection: false,
  },
  // dawne podstrony żyją dziś jako sekcje strony głównej
  async redirects() {
    return [
      { source: '/resume', destination: '/#doswiadczenie', permanent: true },
      { source: '/recommendation', destination: '/#opinie', permanent: true },
      { source: '/contact', destination: '/#kontakt', permanent: true },
    ];
  },
};

export default nextConfig;
