# Bulletproof React - Next.js Architecture Guide

## Overview
A feature-based, scalable architecture for building production-ready Next.js applications using the App Router. This structure emphasizes modularity, maintainability, and team collaboration through domain-driven organization.

**Key Highlights:**
- Feature-based architecture for better scalability
- Type-safe routing with centralized path management
- Environment variable validation with Zod
- Built-in support for internationalization (next-intl)
- Unidirectional data flow

---

## 📁 Actual Folder Structure

```
nextjs-app/
│
├── src/
│   ├── app/                      # Next.js App Router (routes & pages)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── provider.tsx         # Global providers wrapper
│   │   ├── not-found.tsx        # 404 page
│   │   │
│   │   ├── app/                 # Protected app routes (/app/*)
│   │   │   ├── _components/    # App-level shared components
│   │   │   ├── discussions/    # /app/discussions routes
│   │   │   ├── profile/        # /app/profile routes
│   │   │   └── users/          # /app/users routes
│   │   │
│   │   ├── auth/                # Auth routes (/auth/*)
│   │   │   ├── _components/    # Auth-level shared components
│   │   │   ├── login/          # /auth/login route
│   │   │   └── register/       # /auth/register route
│   │   │
│   │   └── public/              # Public routes (/public/*)
│   │       └── discussions/    # Public discussions
│   │
│   ├── components/               # Shared components across entire app
│   │   ├── ui/                  # Reusable UI primitives
│   │   │   ├── button/
│   │   │   ├── dialog/
│   │   │   ├── drawer/
│   │   │   ├── dropdown/
│   │   │   ├── form/
│   │   │   ├── link/
│   │   │   ├── md-preview/
│   │   │   ├── notifications/
│   │   │   ├── spinner/
│   │   │   └── table/
│   │   ├── layouts/             # Layout components
│   │   └── errors/              # Error boundary components
│   │
│   ├── config/                   # Configuration files (ONLY 2 FILES)
│   │   ├── env.ts               # Environment variables with Zod validation
│   │   └── paths.ts             # Centralized route paths
│   │
│   ├── features/                 # ⭐ CORE: Feature-based modules
│   │   ├── auth/
│   │   ├── comments/
│   │   ├── discussions/
│   │   ├── teams/
│   │   └── users/
│   │
│   ├── hooks/                    # Shared custom React hooks
│   │
│   ├── lib/                      # Pre-configured third-party libraries
│   │   ├── api-client.ts        # Axios configuration
│   │   ├── auth.tsx             # Auth context & provider
│   │   ├── authorization.ts     # Permission/role management
│   │   └── react-query.ts       # React Query configuration
│   │
│   ├── types/                    # Shared TypeScript types
│   │
│   ├── utils/                    # Shared utility functions
│   │
│   └── styles/                   # Global styles & Tailwind
│
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.cjs           # Tailwind CSS configuration
└── package.json
```

---

## 🎯 Feature-Based Architecture (Core Concept)

### The `/features` Folder Structure

Each feature is **self-contained** with its own components and API calls. **Important:** Features do NOT have index.ts files - components and APIs are imported directly.

```
features/
│
├── [feature-name]/              # e.g., discussions, users, comments, teams, auth
│   │
│   ├── api/                     # Feature-specific API calls & React Query hooks
│   │   ├── get-[feature].ts    # GET requests + useQuery hooks
│   │   ├── get-[features].ts   # List fetching
│   │   ├── create-[feature].ts # POST requests + useMutation hooks
│   │   ├── update-[feature].ts # PUT/PATCH requests + useMutation hooks
│   │   └── delete-[feature].ts # DELETE requests + useMutation hooks
│   │
│   └── components/              # Feature-specific UI components (direct .tsx files)
│       ├── [feature]-list.tsx
│       ├── [feature]-view.tsx
│       ├── create-[feature].tsx
│       ├── update-[feature].tsx
│       └── delete-[feature].tsx
│
# NOTE: No hooks/, stores/, types/, utils/, or index.ts in features!
# - React Query hooks are co-located in api/ files
# - Shared hooks go in /src/hooks
# - Types go in /src/types
# - Utils go in /src/utils
```

---

## 📋 Real Feature Example: `discussions` (From Actual Codebase)

```
features/discussions/
│
├── api/
│   ├── get-discussions.ts       # List all discussions + useDiscussions hook
│   ├── get-discussion.ts        # Get single discussion + useDiscussion hook
│   ├── create-discussion.ts     # Create discussion + useCreateDiscussion hook
│   ├── update-discussion.ts     # Update discussion + useUpdateDiscussion hook
│   └── delete-discussion.ts     # Delete discussion + useDeleteDiscussion hook
│
└── components/
    ├── discussions-list.tsx     # List view component
    ├── discussion-view.tsx      # Single discussion view
    ├── create-discussion.tsx    # Creation form/modal
    ├── update-discussion.tsx    # Edit form/modal
    └── delete-discussion.tsx    # Delete confirmation
```

### API File Pattern (from get-discussions.ts):

```typescript
import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Discussion, Meta } from '@/types/api';

// 1. API function
export const getDiscussions = ({ page }: { page?: number } = { page: 1 }) => {
  return api.get(`/discussions`, { params: { page } });
};

// 2. Query options (for server components & hooks)
export const getDiscussionsQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ['discussions', { page }],
    queryFn: () => getDiscussions({ page }),
  });
};

// 3. React Query hook (for client components)
export const useDiscussions = ({
  queryConfig,
  page
}: UseDiscussionsOptions) => {
  return useQuery({
    ...getDiscussionsQueryOptions({ page }),
    ...queryConfig,
  });
};
```

**Key Pattern:** Each API file exports:
1. The raw API function
2. Query/Mutation options (for React Query)
3. Custom hook for easy consumption

---

## 🔑 Key Architecture Principles

### 1. **Feature Encapsulation**
- Each feature contains its own `api/` and `components/` folders
- Features are independent modules focused on specific domain logic
- React Query hooks are co-located with API calls in `api/` files

### 2. **No Feature Index Files**
- Unlike some architectures, features DON'T export through `index.ts`
- Import components and hooks directly from their file paths
- This keeps the structure simple and explicit

### 3. **Centralized Configuration**
- **All routes** defined in `/src/config/paths.ts`
- **All environment variables** validated in `/src/config/env.ts`
- Type-safe and easy to refactor

### 4. **Shared vs Feature-Specific**
- **`/src/components/ui`**: Components used across multiple features
- **`/src/features/[feature]/components`**: Components used only in that feature
- **`/src/hooks`**: Hooks used across the entire app
- **`/src/lib`**: Pre-configured third-party library instances

### 5. **Colocation of Related Code**
- API functions + React Query hooks in same file
- Components in feature-specific folders
- Keep related code together for easier maintenance

### 6. **Unidirectional Data Flow**
- App layer → Features → Shared modules
- Features cannot import from each other
- Prevents circular dependencies

## 🌍 Internationalization with next-intl

### Setup Structure for French & English Locales

```
src/
├── app/
│   └── [locale]/                # Locale-based routing
│       ├── layout.tsx           # Locale-specific layout
│       ├── page.tsx
│       ├── app/
│       ├── auth/
│       └── public/
│
├── i18n/                        # Internationalization folder
│   ├── request.ts               # Server-side i18n configuration
│   └── routing.ts               # Routing configuration
│
└── messages/                    # Translation files
    ├── en.json                  # English translations
    └── fr.json                  # French translations
```

### Translation Files Structure

**`messages/en.json`:**
```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email",
    "password": "Password"
  },
  "discussions": {
    "title": "Discussions",
    "create": "Create Discussion",
    "noDiscussions": "No discussions found"
  }
}
```

**`messages/fr.json`:**
```json
{
  "common": {
    "welcome": "Bienvenue",
    "loading": "Chargement...",
    "error": "Une erreur s'est produite"
  },
  "auth": {
    "login": "Connexion",
    "register": "S'inscrire",
    "email": "E-mail",
    "password": "Mot de passe"
  },
  "discussions": {
    "title": "Discussions",
    "create": "Créer une discussion",
    "noDiscussions": "Aucune discussion trouvée"
  }
}
```

### i18n Configuration

**`i18n/routing.ts`:**
```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always' // or 'as-needed'
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**`i18n/request.ts`:**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

### Usage in Components

**Server Components:**
```typescript
import { useTranslations } from 'next-intl';

export default function DiscussionsPage() {
  const t = useTranslations('discussions');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('create')}</button>
    </div>
  );
}
```

**Client Components:**
```typescript
'use client';

import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('auth');

  return (
    <form>
      <input placeholder={t('email')} />
      <input type="password" placeholder={t('password')} />
      <button>{t('login')}</button>
    </form>
  );
}
```

### Locale-Aware Navigation

```typescript
import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';

// Link automatically includes current locale
<Link href={paths.app.discussions.getHref()}>
  {t('discussions.title')}
</Link>

// Programmatic navigation
import { useRouter } from '@/i18n/routing';

const router = useRouter();
router.push(paths.app.profile.getHref());
```

### Language Switcher Component

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: 'en' | 'fr') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select value={locale} onChange={(e) => handleChange(e.target.value)}>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

---

## 📦 Key Folders Explained

### `/src/app` - Application Layer
- Composes features together
- Handles Next.js routing and pages
- Manages global providers (theme, auth, etc.)

### `/src/components` - Shared Components

Only truly reusable components across features (from actual codebase):

```
components/
├── ui/                    # UI primitives
│   ├── button/
│   ├── dialog/
│   ├── drawer/
│   ├── dropdown/
│   ├── form/
│   ├── link/
│   ├── md-preview/        # Markdown preview
│   ├── notifications/
│   ├── spinner/
│   └── table/
├── layouts/               # Layout components
│   ├── content-layout.tsx
│   └── dashboard-layout.tsx
└── errors/                # Error boundaries
    └── error-boundary.tsx
```

**Important:** Feature-specific components go in `/src/features/[feature]/components/`

### `/src/lib` - Pre-configured Libraries

Pre-configured instances of third-party libraries (actual files from codebase):

```
lib/
├── api-client.ts         # Axios instance with interceptors
├── auth.tsx              # Authentication context & provider
├── authorization.ts      # Role-based access control (RBAC)
└── react-query.ts        # React Query configuration
```

**`lib/api-client.ts` - Centralized API client:**
```typescript
import Axios from 'axios';
import { env } from '@/config/env';

export const api = Axios.create({
  baseURL: env.API_URL,
});

// Add interceptors for auth tokens, error handling, etc.
```

**`lib/react-query.ts` - React Query setup:**
```typescript
import { QueryClient, DefaultOptions } from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;
```

## 🔧 Configuration Files (EXACTLY 2 FILES)

### `/src/config/env.ts` - Environment Variable Validation

```typescript
import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
    APP_URL: z.string().optional().default('http://localhost:3000'),
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
  });

  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(`Invalid env provided...`);
  }

  return parsedEnv.data;
};

export const env = createEnv();
```

**Usage:**
```typescript
import { env } from '@/config/env';

const apiUrl = env.API_URL;
```

### `/src/config/paths.ts` - Centralized Route Management

```typescript
export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
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
  },
} as const;
```

**Usage:**
```typescript
import { paths } from '@/config/paths';
import Link from 'next/link';

<Link href={paths.app.discussions.getHref()}>Discussions</Link>
<Link href={paths.app.discussion.getHref(discussionId)}>View Discussion</Link>
```

**Benefits of Centralized Paths:**
- ✅ Type-safe routing (TypeScript autocomplete)
- ✅ No typos in route strings
- ✅ Easy refactoring (change path in one place)
- ✅ Supports dynamic parameters
- ✅ Built-in query parameter encoding

---

## ✅ Benefits of This Architecture

| Benefit | Description |
|---------|-------------|
| **Scalability** | Easy to add new features without restructuring |
| **Maintainability** | Related code stays together, easier to understand |
| **Team Collaboration** | Multiple developers can work on different features independently |
| **Reduced Coupling** | Features are loosely coupled through public APIs |
| **Clear Boundaries** | Obvious where new code should go |
| **Easier Refactoring** | Can refactor/remove features without affecting others |

---

## 🚀 Getting Started

### 1. Start with Basic Structure
Create the core folders in `/src`:
- `app`, `assets`, `components`, `config`, `features`, `hooks`, `lib`, `stores`, `types`, `utils`

### 2. Create Your First Feature
```bash
mkdir -p src/features/users/{api,components,hooks,types,utils}
touch src/features/users/index.ts
```

### 3. Add Shared Components
Place truly reusable components in `/src/components/ui`

### 4. Configure Libraries
Set up pre-configured instances in `/src/lib`

---

## 📐 Import Patterns & Rules

### Correct Import Patterns

```typescript
// ✅ CORRECT: Import features directly (NO index.ts)
import { DiscussionsList } from '@/features/discussions/components/discussions-list';
import { useDiscussions } from '@/features/discussions/api/get-discussions';
import { useCreateDiscussion } from '@/features/discussions/api/create-discussion';

// ✅ CORRECT: Import shared components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// ✅ CORRECT: Import from config
import { paths } from '@/config/paths';
import { env } from '@/config/env';

// ✅ CORRECT: Import from lib
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';

// ✅ CORRECT: Import utilities
import { formatDate } from '@/utils/format';

// ✅ CORRECT: Import types
import type { User, Discussion } from '@/types/api';
```

### Unidirectional Import Flow

```
┌─────────────────────────────────────────────────┐
│                 /src/app/*                      │
│         (routes, pages, layouts)                │
│         CAN import from everything              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            /src/features/*                      │
│         (feature modules)                       │
│  CAN import from: components, hooks,            │
│                   lib, types, utils             │
│  CANNOT import from: app, other features        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  /src/components, /hooks, /lib, /types, /utils │
│         (shared modules)                        │
│  CANNOT import from: app, features              │
└─────────────────────────────────────────────────┘
```

**Key Rules:**
1. **App** can import from anywhere
2. **Features** can import from shared modules, NOT from other features or app
3. **Shared modules** can only import from each other
4. This prevents circular dependencies and maintains clean architecture

---

## 🎨 Feature Examples (From Actual Codebase)

### Actual Features in bulletproof-react/nextjs-app:

1. **`auth`** - Authentication & registration
   - Components: login-form, register-form
   - No API folder (uses lib/auth.tsx)

2. **`discussions`** - Discussion management
   - API: get-discussions, get-discussion, create-discussion, update-discussion, delete-discussion
   - Components: discussions-list, discussion-view, create-discussion, update-discussion, delete-discussion

3. **`comments`** - Comments on discussions
   - API: get-comments, create-comment, delete-comment
   - Components: comments-list, comments, create-comment, delete-comment

4. **`users`** - User management & profiles
   - API: get-users, delete-user, update-profile
   - Components: users-list, delete-user, update-profile

5. **`teams`** - Team/organization management
   - API: get-teams

### Your App Structure (Example)

**Small App (3-5 features):**
- `auth` - Login, registration, password reset
- `dashboard` - Main dashboard
- `profile` - User profile management
- `settings` - App settings

**Medium App (6-10 features):**
- `auth`, `users`, `dashboard`
- `products`, `orders`, `payments`
- `notifications`, `search`, `settings`

**Large App (10+ features):**
- Group by business domain
- Maintain consistent naming
- Keep features independent

---

## 💡 Pro Tips

1. **API + Hooks Pattern**: Always co-locate React Query hooks with API calls in the same file
2. **Direct Imports**: Import from exact file paths, not through index files
3. **Path Management**: Use `paths.ts` for ALL routes - never hardcode route strings
4. **Environment Variables**: Always validate env vars with Zod in `env.ts`
5. **Feature Boundaries**: If Feature A needs Feature B's data, create a shared hook in `/src/hooks`
6. **Component Organization**: 3+ features using same component? Move it to `/src/components/ui`
7. **Type Safety**: Keep shared types in `/src/types`, feature-specific types inline
8. **React Query**: Export both queryOptions (for server) and hooks (for client) from API files
9. **Internationalization**: Organize translations by domain (auth, discussions, common, etc.)
10. **App Router**: Use `_components` folders for route-group-specific shared components

---

## 🔄 Quick Start Checklist

### 1. Setup Base Folders
```bash
mkdir -p src/{app,components/{ui,layouts,errors},config,features,hooks,lib,types,utils,styles}
mkdir -p src/i18n
mkdir -p messages
```

### 2. Create Configuration Files
```bash
# Create env.ts with Zod validation
touch src/config/env.ts

# Create paths.ts for centralized routing
touch src/config/paths.ts
```

### 3. Setup Internationalization
```bash
# Create i18n config files
touch src/i18n/request.ts
touch src/i18n/routing.ts

# Create translation files
touch messages/en.json
touch messages/fr.json
```

### 4. Configure Libraries
```bash
# Create lib configuration files
touch src/lib/api-client.ts
touch src/lib/react-query.ts
touch src/lib/auth.tsx
touch src/lib/authorization.ts
```

### 5. Create Your First Feature
```bash
# Example: discussions feature
mkdir -p src/features/discussions/{api,components}
touch src/features/discussions/api/get-discussions.ts
touch src/features/discussions/components/discussions-list.tsx
```

### 6. Setup Providers
```bash
# Root layout with providers
touch src/app/layout.tsx
touch src/app/provider.tsx
```

---

## 📚 Additional Resources

- **Repository:** https://github.com/alan2207/bulletproof-react
- **Next.js App Router:** https://nextjs.org/docs/app
- **React Query:** https://tanstack.com/query/latest
- **next-intl:** https://next-intl-docs.vercel.app/
- **Zod:** https://zod.dev/

---

**This architecture is based on the actual bulletproof-react nextjs-app implementation, production-tested and follows Domain-Driven Design principles for building scalable Next.js applications with full internationalization support.**
