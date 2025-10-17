export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    signup: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    onboardingClient: {
      getHref: () => '/onboarding/client',
    },
    onboardingFreelancer: {
      getHref: () => '/onboarding/freelancer',
    },
  },

  public: {
    browse: {
      getHref: () => '/browse',
    },
    findWork: {
      getHref: () => '/find-work',
    },
    findExperts: {
      getHref: () => '/find-experts',
    },
    help: {
      getHref: () => '/help',
    },
    about: {
      getHref: () => '/about',
    },
    howItWorks: {
      getHref: () => '/how-it-works',
    },
    trustSafety: {
      getHref: () => '/trust-safety',
    },
    contact: {
      getHref: () => '/contact',
    },
    privacy: {
      getHref: () => '/privacy',
    },
    terms: {
      getHref: () => '/terms',
    },
  },

  app: {
    root: {
      getHref: () => '/app',
    },
    dashboard: {
      getHref: () => '/app',
    },
    discussions: {
      getHref: () => '/app/discussions',
    },
    discussion: {
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      getHref: () => '/app/users',
    },
    profile: {
      getHref: () => '/app/profile',
    },
    messages: {
      getHref: () => '/app/messages',
    },
    payments: {
      getHref: () => '/app/payments',
    },
    settings: {
      getHref: () => '/app/settings',
    },
    freelancerProfile: {
      getHref: () => '/app/freelancer-profile',
    },
    clientProfile: {
      getHref: () => '/app/client-profile',
    },
  },
} as const;
