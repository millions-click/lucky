import { PropsWithChildren } from 'react';
import { Header } from '@/ui/header';
import { Footer } from '@/ui/footer';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
