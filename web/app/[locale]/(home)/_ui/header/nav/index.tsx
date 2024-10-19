import { Suspense } from 'react';
import { NavLinks } from './NavLinks';
import { Menu } from './Menu';

export const Nav = ({ locale }: { locale: string }) => {
  return (
    <nav className="flex items-center" aria-label="Main navigation">
      <Suspense>
        <Menu>
          <NavLinks locale={locale} />
        </Menu>
      </Suspense>
    </nav>
  );
};
