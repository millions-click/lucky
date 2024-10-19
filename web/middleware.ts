import { NextRequest, NextResponse } from 'next/server';
import { NextFetchEvent } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { locales, defaultLocale } from '@/i18n';
import { getLuckyPass } from '@/actions';

const i18n = createMiddleware({ locales, defaultLocale });
const localePath = new RegExp(`^/(${locales.join('|')})(.*)`);
const gamePath = new RegExp(`^/game/realms(/.*)?`);

export async function middleware(req: NextRequest, _event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  const match = pathname.match(localePath);

  if (match) {
    const path = match[2];

    if (path.startsWith('/game')) {
      const luckyPass = await getLuckyPass();
      if (!luckyPass) return NextResponse.redirect(new URL('/', req.url));

      const gameMatch = path.match(gamePath);
      if (gameMatch) {
        const realm = gameMatch[1];

        if (realm) {
          const { ttl, activated } = luckyPass;
          const state = activated
            ? Date.now() > activated + ttl * 1000
              ? 'expired'
              : 'active'
            : 'inactive';
          if (state !== 'active')
            return NextResponse.redirect(
              new URL(`/game/realms?from=middleware&action=${state}`, req.url)
            );
        }
      }
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
  matcher: [
    '/((?!api|static|icons|assets|token|.*\\..*|_next|console|ipfs).*)',
  ],
};
