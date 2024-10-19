import { NavLink } from './NavLink';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type LinkItem = {
  id: string;
  href: string;
  label: string;
  title: string;
  image: string;
  content: string;
};
const items = [
  {
    id: 'roadmap',
    href: '/roadmap',
    image: '/assets/images/pages/roadmap.png',
  },
  {
    id: 'leaderboard',
    href: '/leaderboard',
    image: '/assets/images/pages/leaderboard.png',
  },
  {
    id: 'buy',
    href: '/buy',
    image: '/assets/images/pages/buy.png',
  },
  {
    id: 'tokenomics',
    href: '/tokenomics',
    image: '/assets/images/pages/tokenomics.png',
  },
  {
    id: 'about',
    href: '/about',
    image: '/assets/images/pages/about.png',
  },
  {
    id: 'whitepaper',
    href: '/whitepaper',
    image: '/assets/images/pages/whitepaper.png',
  },
] as Array<LinkItem>;

export const NavLinks = ({ locale }: { locale: string }) => {
  const t = useTranslations('Components.Shortcuts.pages');
  const pages = useMemo(() => {
    return items.map(({ id, href, image }) => ({
      id,
      image,
      href: `/${locale}${href}`,
      label: t(`${id}.label`),
      title: t(`${id}.title`),
      content: t(`${id}.content`),
    }));
  }, [locale]);

  return (
    <>
      {pages.map((item) => (
        <NavLink key={item.id} {...item}>
          {item.label}
        </NavLink>
      ))}
    </>
  );
};
