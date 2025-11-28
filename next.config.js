import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:locale(en|fr)/api/:path*',
          destination: '/api/:path*',
        },
        {
          source: '/:locale(en|fr)/trpc/:path*',
          destination: '/trpc/:path*',
        },
      ],
    };
  },
};

export default withNextIntl(config);
