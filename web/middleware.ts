import { NextRequest, NextResponse } from 'next/server';
import { NextFetchEvent } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { locales, defaultLocale } from '@/i18n';
import { getLuckyPass } from '@/actions';

const i18n = createMiddleware({ locales, defaultLocale });
const localePath = new RegExp(`^/(${locales.join('|')})(.*)`);

export async function middleware(req: NextRequest, _event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  const match = pathname.match(localePath);

  if (match) {
    const path = match[2];

    if (!path) {
      const luckyPass = await getLuckyPass();
      if (luckyPass) return NextResponse.redirect(new URL('/game', req.url));
    }

    if (path.startsWith('/game')) {
      const luckyPass = await getLuckyPass();
      if (!luckyPass) return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // internationalize the request
  return i18n(req);
}

// only applies this middleware to files in the app directory.
// TODO: Update the matcher to check if the middleware is needed
//  missing cookies on /game and /game/*
//  existing cookies on landing / and /:lang (where :lang is a valid locale)
export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|console).*)'],
};
