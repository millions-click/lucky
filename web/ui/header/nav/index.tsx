import { Suspense } from 'react';
import { NavLinks } from './NavLinks';
import { Menu } from './Menu';

export const Nav = () => {
  return (
    <nav className="flex items-center" aria-label="Main navigation">
      <Suspense>
        <Menu>
          <NavLinks />
        </Menu>
      </Suspense>
    </nav>
  );
};
