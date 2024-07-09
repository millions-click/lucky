import { NextRequest, NextResponse } from 'next/server';
import { NextFetchEvent } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { locales, defaultLocale } from '@/i18n';
import { getLuckyPass } from '@/actions';

const i18n = createMiddleware({ locales, defaultLocale });

export async function middleware(req: NextRequest, _event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (pathname.includes('/game')) {
    const luckyPass = await getLuckyPass();
    if (!luckyPass) return NextResponse.redirect(new URL('/', req.url));
  }

  // internationalize the request
  return i18n(req);
}

// only applies this middleware to files in the app directory.
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|console).*)'],
};
