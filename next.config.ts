import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // polski pod /, angielski pod /en; bez przekierowań wg Accept-Language,
  // żeby roboty i linki zawsze trafiały w wersję z adresu.
  // Strona żyje w app/[lang], więc / pokazuje wersję /pl bez zmiany adresu
  async rewrites() {
    return [{ source: '/', destination: '/pl' }];
  },
  async redirects() {
    return [
      // jeden adres na wersję polską
      { source: '/pl', destination: '/', permanent: true },
      // dawne podstrony żyją dziś jako sekcje strony głównej
      { source: '/resume', destination: '/#doswiadczenie', permanent: true },
      { source: '/recommendation', destination: '/#opinie', permanent: true },
      { source: '/contact', destination: '/#kontakt', permanent: true },
    ];
  },
};

export default nextConfig;
