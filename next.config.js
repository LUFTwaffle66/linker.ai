import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    return {
      beforeFiles: [
        // Strip locale from API routes
        {
          source: '/:locale(en|fr)/api/:path*',
          destination: '/api/:path*',
        },
        {
          source: '/:locale(en|fr)/trpc/:path*',
          destination: '/trpc/:path*',
        },
        // Add default locale to page routes for clean URLs
        {
          source: '/onboarding/:path*',
          destination: '/en/onboarding/:path*',
        },
        {
          source: '/dashboard',
          destination: '/en/dashboard',
        },
        {
          source: '/messages',
          destination: '/en/messages',
        },
        {
          source: '/notifications',
          destination: '/en/notifications',
        },
        {
          source: '/payments',
          destination: '/en/payments',
        },
        {
          source: '/settings',
          destination: '/en/settings',
        },
        {
          source: '/projects',
          destination: '/en/projects',
        },
        {
          source: '/projects/:id',
          destination: '/en/projects/:id',
        },
        {
          source: '/browse',
          destination: '/en/browse',
        },
        {
          source: '/post-project',
          destination: '/en/post-project',
        },
        {
          source: '/submit-proposal',
          destination: '/en/submit-proposal',
        },
        {
          source: '/freelancer/:id',
          destination: '/en/freelancer/:id',
        },
        {
          source: '/client/:id',
          destination: '/en/client/:id',
        },
      ],
    };
  },
};

export default withNextIntl(config);
