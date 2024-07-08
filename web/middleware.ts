import type { NextRequest } from 'next/server';
import { NextFetchEvent } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { locales, defaultLocale } from '@/i18n';

const i18n = createMiddleware({ locales, defaultLocale });

export function middleware(req: NextRequest, _event: NextFetchEvent) {
  // internationalize the request
  return i18n(req);
}

// only applies this middleware to files in the app directory.
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|console).*)'],
};
