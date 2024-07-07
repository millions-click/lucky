import { PropsWithChildren } from 'react';
import { Header } from '@/ui/header';

export default function Layout({ children }: PropsWithChildren) {
  const className = [
    'hero min-h-screen w-full',
    "bg-[url('/assets/images/landing.jpg')]",
    '',
  ].join(' ');

  return (
    <>
      <Header />
      <main className="container mx-auto">
        <div className={className}>
          <div className="hero-content text-neutral-content text-center">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
