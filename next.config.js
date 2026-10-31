/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
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

module.exports = nextConfig;
