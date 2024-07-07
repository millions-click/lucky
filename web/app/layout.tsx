import { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/next';
import './global.css';

// TODO: Define project metadata
export const metadata = {
  title: 'Luckyland',
  description: 'Where Prizes 🎉 and FUN 😃 never stops!',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
