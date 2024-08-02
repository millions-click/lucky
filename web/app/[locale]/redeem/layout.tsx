import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function Layout({
  children,
  params: { locale },
}: PropsWithChildren<{ params: { locale: string } }>) {
  unstable_setRequestLocale(locale);

  return (
    <div className="hero min-h-screen bg-[url('/assets/images/bg/realms.webp')]">
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center glass rounded-box max-sm:mx-2">
        {children}
      </div>
    </div>
  );
}
